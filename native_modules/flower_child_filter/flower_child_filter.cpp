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
// Exact-reproduction note: the original design's two shaping curves used a
// node-based spline library (soemdsp::utility::Graph / soemdsp::curve::
// Rational). With that source now available, both are reproduced exactly:
//
//   - The FM/PM crossfade-vs-frequency curve is queried at a value (the
//     pitch-mapped cutoff, 3..161) that always exceeds the curve's node
//     domain (nodes only at x=0 and x=1) -- Graph::getValue clamps to the
//     last node's y for any x past the final node, and that node's y is 0
//     for both Rev1 and Rev2. So the crossfade is provably always 0 (pure
//     FM feedback, no PM component), not an approximation -- it's simplified
//     out below rather than computed.
//   - The resonance-vs-frequency soft-limit curve is reproduced with the
//     exact 3-node Graph structure and the exact Rational curve formula
//     (out = ((1+skew)*p) / (1-skew+2*skew*p)), including the detail that
//     Rev2 (unlike Rev1) samples this curve at the *frequency* slider
//     position, not at resonance.

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

// Standalone tension/ease curve (soemdsp's free-standing curve() function,
// distinct from curve::Rational below). 0->0, 1->1, tension=0 is linear.
static inline double curveShape(double v, double tension) {
  double t = tension;
  double denom = 2.0 * t * v - t - 1.0;
  if (denom == 0.0) return v;
  return (t * v - v) / denom;
}

// Exact soemdsp::curve::Rational::get(p), p already normalized to [0,1].
static inline double rationalCurve(double p, double skew) {
  return ((1.0 + skew) * p) / (1.0 - skew + 2.0 * skew * p);
}

// Exact soemdsp::utility::Graph::getValue for the 3-node shape this filter
// uses: node0=(0, n0y, linear), node1=(breakpoint, n1y, linear -- n1y==n0y
// makes this segment flat regardless of shape), node2=(1, n2y, RATIONAL
// with the given skew). x is clamped to the first node's y below x=0 and to
// the last node's y at or beyond x=1, exactly like Graph::getValue.
static inline double evalResonanceGraph(double x, double n0y, double breakpoint, double n2y, double skew) {
  if (x < 0.0) return n0y;
  if (x >= 1.0) return n2y;
  if (x < breakpoint) return n0y;  // flat segment: n1y == n0y
  double p = (x - breakpoint) / (1.0 - breakpoint);
  return n0y + (n2y - n0y) * rationalCurve(p, skew);
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

  // FM/PM crossfade is provably always 0 here -- see the exact-reproduction
  // note above. cos(0)=1, sin(0)=0, so this collapses to pure FM feedback:
  // fm = mod, pm = 0.

  const double cutoff1 = frequencyHz * 0.164312;
  const double cutoff2 = frequencyHz * 0.366131;
  const double a1 = onePoleCoefficient(cutoff1, safeRate);
  const double a2 = onePoleCoefficient(cutoff2, safeRate);

  // Resonance-vs-frequency soft-limit curve, exact Graph/Rational
  // reproduction. Rev1 samples it at the resonance value itself; Rev2
  // samples it at the frequency slider position instead (matching the
  // original's updateResonance override exactly).
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
  const double cappedTarget = reso < cap ? reso : cap;

  double selfModAmp = 1.0;
  double ellipseC = -1.0;
  if (!dirty) {
    const double graphValue = evalResonanceGraph(reso, reso, breakpoint, cappedTarget, -0.38);
    selfModAmp = jmap01(curveShape(graphValue, 0.4), 0.0368, 0.6333);
  } else {
    const double graphValue = evalResonanceGraph(freqNorm, reso, breakpoint, cappedTarget, -0.38);
    ellipseC = jmap01(curveShape(graphValue, -0.6), -1.0, 0.00001);
  }

  const double clampLimit = dirty ? 1.198 : 1.0;
  double inputSignal = clampd(-input, -clampLimit, clampLimit);

  if (chaos > 0.0) {
    inputSignal += nextNoiseBipolar(&s.rngState) * chaos;
  }

  inputSignal = s.selfMod + 0.035848699999999845 * inputSignal;

  const double mod = 1.4 * inputSignal;
  const double fm = mod;

  s.phaseOffset = 0.0;
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
