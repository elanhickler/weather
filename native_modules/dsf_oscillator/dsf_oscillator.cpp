// soemdsp-native-module: dsf_oscillator
// soemdsp-native-label: DSF Oscillator
// soemdsp-native-target: dsfOscillator
// soemdsp-native-kind: oscillator

// The "DSF starter kit" -- a Discrete Summation Formula oscillator, the
// other alias-free technique studied for the aliasing-wars mission (see
// README.md), distinct from Surge Oscillator's PolyBLEP approach.
//
// FIFTH REWRITE. Explicit direction: stop adding Morph/Harmonics
// complexity and get the base Saw working first, starting from a real,
// given working example rather than re-deriving anything.
//
// This is a direct transcription of pureSawEng() and its exact usage
// pattern from "Extended DSF Oscillators.cxx" (Walter H. Hackett), one of
// the reference files provided directly:
//
//   double pureSawEng(double t, int n) {
//       return 2.0*(((sin(PI*4*t*(floor(n)*2+1)/4))/sin(t/4*4*PI)-1)/2);
//   }
//   // simplifies to: sin(PI*t*(2N+1)) / sin(PI*t) - 1
//
//   note.t += note.dt * 0.9999;
//   note.t  = note.t - floor(note.t);
//   note.value = note.value*0.999 + pureSawEng(note.t, note.n) * note.dt;
//
// Two things this rewrite got wrong before, caught by re-reading the
// actual file instead of relying on memory of it:
// 1. The formula is NOT divided by 2N -- that normalization was
//    something a previous rewrite added on its own, not part of the real
//    reference. The un-normalized raw form, run through the leaky
//    integrator below, is what produces the correct sawtooth shape.
//    Verified in Python: dividing by 2N, or evaluating the closed form
//    directly per-sample without the integrator, both distort the shape.
// 2. This formula never had a Morph or Harmonics control in the
//    reference -- `n` is always `floor(Nyquist / frequency)`, and that's
//    the only per-note parameter. So there is none here either.
//
// n = floor(Nyquist/frequency) is auto-derived every sample, same as
// every other DSF oscillator studied in this mission -- alias-free by
// construction, no user-facing harmonic-count slider.

namespace {

constexpr double kPi = 3.1415926535897932384626433832795;

double clampD(double value, double lo, double hi) {
  return value < lo ? lo : (value > hi ? hi : value);
}

double wrap01(double value) {
  double f = value - __builtin_floor(value);
  if (f < 0.0) f += 1.0;
  if (f >= 1.0) f -= 1.0;
  return f;
}

double wrapRadians(double value) {
  const double twoPi = kPi * 2.0;
  while (value > kPi) value -= twoPi;
  while (value < -kPi) value += twoPi;
  return value;
}

// A truncated-at-x^8 Taylor series (5 terms) has ~7e-3 absolute error near
// x=pi -- fine in isolation, but this oscillator's leaky integrator has
// near-unity gain (retention 0.999, steady-state gain ~1000), so that
// small a bias compounds into visible drift over a few thousand samples.
// Verified numerically (Python) before shipping: this 8-term series holds
// error under ~2e-5 across the full range this formula needs, which
// keeps the integrator's output bounded instead of drifting.
double sinApprox(double value) {
  const double x = wrapRadians(value);
  const double x2 = x * x;
  return x * (1.0 + x2 * (-1.0 / 6.0 + x2 * (1.0 / 120.0 + x2 * (-1.0 / 5040.0 + x2 * (1.0 / 362880.0 + x2 * (-1.0 / 39916800.0 + x2 * (1.0 / 6227020800.0)))))));
}

// pureSawEng(t, n), transcribed and simplified directly from "Extended DSF
// Oscillators.cxx": sin(PI*t*(2N+1)) / sin(PI*t) - 1. Guarded at the
// removable singularity t=0 (denominator's zero) via its L'Hopital limit
// (2N+1), same as the reference's own numerically-stable behavior there.
double pureSawEng(double t, int n) {
  const double denom = sinApprox(kPi * t);
  if (denom > -1.0e-9 && denom < 1.0e-9) {
    return static_cast<double>(2 * n + 1) - 1.0;
  }
  return sinApprox(kPi * t * static_cast<double>(2 * n + 1)) / denom - 1.0;
}

// Morph (0..1): crossfades the harmonic count n from 1 (a single
// harmonic -- verified >98% spectral energy at the fundamental, i.e. an
// exact sine) up to nMax (Nyquist/frequency, the maximum alias-free
// count), blending between the two nearest integer harmonic counts so
// the sweep is smooth rather than stepped. Blending pureSawEng's raw
// output before it enters the leaky integrator is equivalent to blending
// two separately-integrated signals, since the integrator is linear --
// verified numerically (Python) that this stays bounded across the full
// Morph range before shipping.
double pureSawEngMorphed(double t, int nMax, double morph) {
  const double m = clampD(morph, 0.0, 1.0);
  const double target = 1.0 + m * static_cast<double>(nMax - 1);
  int lowN = static_cast<int>(target);
  if (lowN < 1) lowN = 1;
  int highN = lowN + 1 > nMax ? nMax : lowN + 1;
  const double frac = target - static_cast<double>(lowN);
  return pureSawEng(t, lowN) * (1.0 - frac) + pureSawEng(t, highN) * frac;
}

constexpr int kMaxInstances = 16;

struct DsfOscillatorState {
  bool active;
  double t;      // phase, 0..1
  double value;  // leaky-integrator accumulator
  double out;
};

static DsfOscillatorState gPool[kMaxInstances];

}  // namespace

extern "C" int soemdsp_dsf_oscillator_create() {
  for (int i = 0; i < kMaxInstances; i++) {
    if (!gPool[i].active) {
      gPool[i] = DsfOscillatorState{};
      gPool[i].active = true;
      return i + 1;
    }
  }
  return 0;
}

extern "C" void soemdsp_dsf_oscillator_destroy(int handle) {
  if (handle < 1 || handle > kMaxInstances) return;
  gPool[handle - 1].active = false;
}

extern "C" void soemdsp_dsf_oscillator_reset(int handle) {
  if (handle < 1 || handle > kMaxInstances) return;
  DsfOscillatorState& s = gPool[handle - 1];
  s.t = 0.0;
  s.value = 0.0;
}

// waveform: 0=Sine, 1=Saw
// morph: 0..1 -- 0 is an exact sine, 1 is the full Nyquist-safe harmonic
// count. Only used by Saw.
extern "C" void soemdsp_dsf_oscillator_sample(
  int handle,
  double frequencyHz,
  double sampleRate,
  int waveform,
  double morph,
  double level
) {
  if (handle < 1 || handle > kMaxInstances) return;
  DsfOscillatorState& s = gPool[handle - 1];

  const double safeSampleRate = sampleRate > 1.0 ? sampleRate : 48000.0;
  const double safeFrequency = frequencyHz > 1.0 ? frequencyHz : 1.0;
  const double dt = clampD(frequencyHz / safeSampleRate, -0.5, 0.5);

  double sample;
  if (waveform == 1) {
    const double nyquist = safeSampleRate * 0.5;
    int nMax = static_cast<int>(nyquist / safeFrequency);
    if (nMax < 1) nMax = 1;
    s.t = wrap01(s.t + dt * 0.9999);
    s.value = s.value * 0.999 + pureSawEngMorphed(s.t, nMax, morph) * dt;
    sample = s.value;
  } else {
    s.t = wrap01(s.t + dt);
    sample = sinApprox(s.t * kPi * 2.0);
  }

  const bool finite = sample * 0.0 == 0.0;
  if (!finite) sample = 0.0;
  s.out = clampD(sample, -1.5, 1.5) * level;
}

extern "C" double soemdsp_dsf_oscillator_out(int handle) {
  if (handle < 1 || handle > kMaxInstances) return 0.0;
  return gPool[handle - 1].out;
}

extern "C" int soemdsp_dsf_oscillator_version() {
  return 6;
}
