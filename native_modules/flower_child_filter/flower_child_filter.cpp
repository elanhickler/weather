// soemdsp-native-module: flower_child_filter
// soemdsp-native-label: Flower Child Filter
// soemdsp-native-target: flowerChildFilter
// soemdsp-native-kind: filter
//
// A resonant self-oscillating filter built from a phase/frequency-modulated
// sine-derived oscillator whose output is fed through two cascaded one-pole
// (6dB/octave) lowpass stages, then fed back into the oscillator's own
// modulation input. Resonance controls how much of the filtered output
// re-enters the oscillator's feedback path.
//
// Two revisions, selected by the "mode" parameter:
//   mode 0 (Clean): the feedback oscillator is a plain sine. Gentler,
//     rounds off edges at low resonance, only a slight howl at full
//     resonance.
//   mode 1 (Dirty): the feedback oscillator is reshaped through an
//     ellipse-family waveshaper whose shape tracks resonance, the input
//     clamp is wider, the feedback amount is fixed rather than
//     resonance-scaled, and the output makeup gain is pushed much harder --
//     producing an aggressive, growling character at high resonance.
//
// Approximation note: the original design used a proprietary multi-node
// spline library (piecewise EXPONENTIAL/RATIONAL easing curves) for two
// shaping curves -- the FM/PM crossfade-vs-frequency curve and the
// resonance-vs-frequency soft-limit curve. That library's exact source
// wasn't available for this port, so both curves are reproduced here with
// a documented, equivalent-shape substitute (the same rational tension
// formula used elsewhere in the original codebase, curve()), rather than
// silently guessed. The core architecture -- feedback-modulated phasor,
// waveshaper choice, one-pole cascade, resonance-scaled feedback -- is
// reproduced exactly from the original C++.

namespace {

static const int kMaxInstances = 32;
static const double kPi     = 3.141592653589793238;
static const double kTwoPi  = 6.283185307179586476;
static const double kHalfPi = 1.5707963267948966192;

union DoubleBits {
  double d;
  unsigned long long u;
};

static double poly_sin_0_halfpi(double x) {
  const double x2 = x * x;
  return x * (1.0 + x2 * (-1.6666666666666667e-1 + x2 * (8.3333333333333329e-3 + x2 * (-1.9841269841269841e-4 + x2 * (2.7557319223985888e-6 + x2 * (-2.5052108385441720e-8 + x2 * 1.6059043836821614e-10))))));
}

// x must be in [0, pi]
static double dsp_sin_0_pi(double x) {
  if (x > kHalfPi) x = kPi - x;
  return poly_sin_0_halfpi(x);
}

// x must be in [0, pi]
static double dsp_cos_0_pi(double x) {
  double y = kHalfPi - x;
  if (y < 0.0) return -poly_sin_0_halfpi(-y);
  return poly_sin_0_halfpi(y);
}

// x must be in (-pi/2, 0]
static double dsp_tan_neg_halfquarter(double x) {
  const double ax = -x;
  const double s = poly_sin_0_halfpi(ax);
  const double c = poly_sin_0_halfpi(kHalfPi - ax);
  return (c == 0.0) ? -1e15 : -(s / c);
}

static inline double dsp_floor(double x) {
  double xi = (double)(long long)x;
  return (x < xi) ? xi - 1.0 : xi;
}

// Full-range sin/cos via quadrant folding onto the [0, pi/2] polynomial.
static double dsp_sin(double x) {
  double wrapped = x - kTwoPi * dsp_floor(x / kTwoPi);
  double sign = 1.0;
  if (wrapped >= kPi) {
    wrapped -= kPi;
    sign = -1.0;
  }
  return sign * dsp_sin_0_pi(wrapped);
}

static double dsp_cos(double x) {
  return dsp_sin(x + kHalfPi);
}

// 2^f for f in [0,1), truncated Taylor series of e^(f*ln2) -- accurate to
// better than 1e-5 relative error, which is far more precision than a
// musical pitch-to-frequency conversion needs.
static double pow2_frac(double f) {
  const double c1 = 0.6931471805599453, c2 = 0.2402265069591007,
               c3 = 0.05550410866482158, c4 = 0.009618129107628477,
               c5 = 0.001333355814670365, c6 = 0.0001540353039338161;
  return 1.0 + f * (c1 + f * (c2 + f * (c3 + f * (c4 + f * (c5 + f * c6)))));
}

static double dsp_exp2(double x) {
  double xi = dsp_floor(x);
  double f = x - xi;
  double p = pow2_frac(f);
  long long n = (long long)xi;
  DoubleBits bits;
  bits.d = p;
  long long expBits = (long long)((bits.u >> 52) & 0x7FF);
  expBits += n;
  if (expBits < 1) expBits = 1;
  if (expBits > 2046) expBits = 2046;
  bits.u = (bits.u & ~(0x7FFULL << 52)) | ((unsigned long long)expBits << 52);
  return bits.d;
}

static inline double dsp_sqrt(double x) {
  if (x <= 0.0) return 0.0;
  double guess = x;
  for (int i = 0; i < 24; i++) guess = 0.5 * (guess + x / guess);
  return guess;
}

static inline double clampd(double v, double lo, double hi) {
  return v < lo ? lo : (v > hi ? hi : v);
}

static inline double jmap01(double v, double outMin, double outMax) {
  return outMin + (outMax - outMin) * v;
}

// Standard 0->0, 1->1 rational tension/ease curve. tension=0 is linear.
static inline double curveShape(double v, double tension) {
  double t = tension;
  double denom = 2.0 * t * v - t - 1.0;
  if (denom == 0.0) return v;
  return (t * v - v) / denom;
}

static inline double pitchToFreq(double pitch) {
  return 440.0 * dsp_exp2((pitch - 69.0) / 12.0);
}

// waveshape::sine -- phase is unipolar [0,1)
static inline double waveSine(double phase) {
  return dsp_sin(phase * kTwoPi);
}

// waveshape::ellipse -- phase is unipolar [0,1). A/B_sin/B_cos/C per the
// original signature; Flower Child always calls it with A=0, B_sin=0,
// B_cos=1, C=ellipseC.
static inline double waveEllipse(double phase, double ellipseC) {
  double sinX = dsp_sin(phase * kTwoPi);
  double cosX = dsp_cos(phase * kTwoPi);
  double sqrtVal = dsp_sqrt(cosX * cosX + (ellipseC * sinX) * (ellipseC * sinX));
  if (sqrtVal < 1e-12) sqrtVal = 1e-12;
  return cosX / sqrtVal;
}

// Simple xorshift32 PRNG for the (nearly-unfiltered in the original --
// its bandpass corners sit at ~0.125Hz and ~20.6kHz) noise contribution.
static inline double nextNoiseBipolar(unsigned int* state) {
  unsigned int x = *state;
  x ^= x << 13;
  x ^= x >> 17;
  x ^= x << 5;
  *state = x;
  return ((double)x / 4294967295.0) * 2.0 - 1.0;
}

// One-pole (6dB/octave) lowpass stage matching rsLadderFilter's LP_6 tap
// with resonance fixed at 0 (Flower Child never sets resonance on its two
// internal lowpass stages) -- includes the same soft input nonlinearity
// the ladder architecture always applies at its input node.
struct OnePoleStage {
  double y1;
};

static inline double onePoleCoefficient(double cutoffHz, double sampleRate) {
  double rawWc = kTwoPi * cutoffHz / sampleRate;
  double wc = clampd(rawWc, 1e-9, kPi * 0.98);
  double s = dsp_sin_0_pi(wc);
  double c = dsp_cos_0_pi(wc);
  double t = dsp_tan_neg_halfquarter(0.25 * (wc - kPi));
  double denom = s - c * t;
  if (denom > -1e-12 && denom < 1e-12) denom = (denom >= 0.0) ? 1e-12 : -1e-12;
  return t / denom;
}

static inline double onePoleStep(OnePoleStage* stage, double input, double a) {
  double y0 = input;
  y0 = y0 / (1.0 + y0 * y0);
  stage->y1 = y0 + a * (y0 - stage->y1);
  return stage->y1;
}

struct FlowerChildState {
  bool active;
  double phase;
  double phaseOffset;
  OnePoleStage stage1;
  OnePoleStage stage2;
  double selfMod;
  unsigned int rngState;
};

static FlowerChildState gPool[kMaxInstances];

}  // namespace

extern "C" int soemdsp_flower_child_filter_create() {
  for (int i = 0; i < kMaxInstances; i++) {
    if (!gPool[i].active) {
      FlowerChildState& s = gPool[i];
      s.phase = 0.0;
      s.phaseOffset = 0.0;
      s.stage1.y1 = 0.0;
      s.stage2.y1 = 0.0;
      s.selfMod = 0.0;
      s.rngState = 0x9E3779B9u + (unsigned int)(i + 1) * 2654435761u;
      s.active = true;
      return i + 1;
    }
  }
  return 0;
}

extern "C" void soemdsp_flower_child_filter_destroy(int handle) {
  if (handle < 1 || handle > kMaxInstances) return;
  gPool[handle - 1].active = false;
}

extern "C" double soemdsp_flower_child_filter_sample(
  int handle,
  double input,
  double frequency,   // 0..1 normalized slider, matches original
  double resonance,   // 0..1
  double chaosAmount,  // 0..1
  int mode,            // 0 = Clean (Rev1), 1 = Dirty (Rev2)
  double sampleRate
) {
  if (handle < 1 || handle > kMaxInstances) return 0.0;
  FlowerChildState& s = gPool[handle - 1];

  const double safeRate = sampleRate < 1.0 ? 44100.0 : sampleRate;
  const double freqNorm = clampd(frequency, 0.0, 1.0);
  const double reso = clampd(resonance, 0.0, 1.0);
  const double chaos = clampd(chaosAmount, 0.0, 1.0);
  const bool dirty = mode != 0;

  const double maxNormFreq = safeRate <= 44100.0 ? 0.928 : 1.0;
  const double normalizedFreqInUse = jmap01(freqNorm < maxNormFreq ? freqNorm : maxNormFreq, 3.0, 161.0);
  const double frequencyHz = pitchToFreq(normalizedFreqInUse);

  // FM/PM crossfade-vs-frequency curve (approximated -- see file header).
  // Starts near 0.21 (clean) / 0.2 (dirty) at the lowest cutoff and eases
  // toward 0 (pure FM feedback) as cutoff frequency rises.
  const double crossfadeStart = dirty ? 0.2 : 0.21;
  const double fmPmCrossfade = crossfadeStart * (1.0 - curveShape(freqNorm, 0.53));

  const double cutoff1 = frequencyHz * 0.164312;
  const double cutoff2 = frequencyHz * 0.366131;
  const double a1 = onePoleCoefficient(cutoff1, safeRate);
  const double a2 = onePoleCoefficient(cutoff2, safeRate);

  // Resonance soft-limit curve (approximated -- see file header). Tracks
  // resonance 1:1 up to a breakpoint, then eases toward a per-mode/tier cap
  // so the feedback amount can't push the oscillator past a safe bound.
  double breakpoint, cap;
  if (dirty) {
    if (safeRate <= 44100.0) { breakpoint = 0.816054; cap = 0.602339; }
    else if (safeRate <= 88200.0) { breakpoint = 0.902657; cap = 0.654971; }
    else { breakpoint = 0.977649; cap = 0.760234; }
  } else {
    if (safeRate <= 44100.0) { breakpoint = 0.732441; cap = 0.649123; }
    else if (safeRate <= 88200.0) { breakpoint = 0.816054; cap = 0.818713; }
    else { breakpoint = 0.879599; cap = 0.807018; }
  }
  double effectiveReso = reso;
  if (reso > breakpoint) {
    double t = (reso - breakpoint) / (1.0 - breakpoint);
    double cappedTarget = reso < cap ? reso : cap;
    effectiveReso = breakpoint + (cappedTarget - breakpoint) * curveShape(t, -0.38);
  }

  double selfModAmp = 1.0;
  double ellipseC = -1.0;
  if (!dirty) {
    selfModAmp = jmap01(curveShape(effectiveReso, 0.4), 0.0368, 0.6333);
  } else {
    ellipseC = jmap01(curveShape(effectiveReso, -0.6), -1.0, 0.00001);
  }

  const double clampLimit = dirty ? 1.198 : 1.0;
  double inputSignal = clampd(-input, -clampLimit, clampLimit);

  if (chaos > 0.0) {
    inputSignal += nextNoiseBipolar(&s.rngState) * chaos;
  }

  inputSignal = s.selfMod + 0.035848699999999845 * inputSignal;

  const double mod = 1.4 * inputSignal;
  const double fm = dsp_cos(kHalfPi * fmPmCrossfade) * mod;
  const double pm = dsp_sin(kHalfPi * fmPmCrossfade) * mod;

  s.phaseOffset = pm;
  const double incAmt = (frequencyHz * fm) / safeRate;
  s.phase = s.phase + incAmt;
  s.phase = s.phase - dsp_floor(s.phase);
  double unipolarPhase = s.phase + s.phaseOffset;
  unipolarPhase = unipolarPhase - dsp_floor(unipolarPhase);

  double oscValue = dirty
    ? waveEllipse(unipolarPhase, ellipseC) * 0.1
    : waveSine(unipolarPhase) * 1.3;

  double out = onePoleStep(&s.stage1, oscValue, a1);
  out = onePoleStep(&s.stage2, out, a2);

  s.selfMod = dirty ? out * 0.465 : out * selfModAmp;

  return dirty ? out * 5.22 : out * 1.31;
}

extern "C" int soemdsp_flower_child_filter_version() {
  return 1;
}
