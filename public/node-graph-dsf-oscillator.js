// Shared offline JS mirror of native_modules/dsf_oscillator -- the DSF
// starter kit. See dsf_oscillator.cpp for the full derivation and design
// notes. FIFTH REWRITE: stripped back to just Sine and Saw, no Morph or
// Harmonics controls, starting from a real reference example (pureSawEng
// and its exact leaky-integrator usage pattern from "Extended DSF
// Oscillators.cxx") rather than re-deriving anything. n is always
// floor(Nyquist/frequency) -- alias-free by construction, no user-facing
// harmonic-count slider.

function createNodeGraphDsfOscillatorState() {
  return { t: 0, value: 0 };
}

// pureSawEng(t, n), transcribed and simplified directly from "Extended DSF
// Oscillators.cxx": sin(PI*t*(2N+1)) / sin(PI*t) - 1. Guarded at the
// removable singularity t=0 via its L'Hopital limit (2N+1).
function nodeGraphDsfPureSawEng(t, n) {
  const denom = Math.sin(Math.PI * t);
  if (denom > -1e-9 && denom < 1e-9) return (2 * n + 1) - 1;
  return Math.sin(Math.PI * t * (2 * n + 1)) / denom - 1;
}

// options: { frequencyHz, sampleRate, waveform (0=Sine,1=Saw), level }
function nodeGraphDsfOscillatorSample(state, options = {}) {
  const sampleRate = Number(options.sampleRate) > 1 ? Number(options.sampleRate) : 48000;
  const safeFrequency = Number(options.frequencyHz) > 1 ? Number(options.frequencyHz) : 1;
  const dt = clampNodeSliderValue((Number(options.frequencyHz) || 0) / sampleRate, -0.5, 0.5);
  const waveform = Math.round(Number(options.waveform) || 0);
  const level = Number(options.level) || 0;

  let sample;
  if (waveform === 1) {
    const nyquist = sampleRate * 0.5;
    const n = Math.max(1, Math.floor(nyquist / safeFrequency));
    state.t = wrapNodeSliderValue(state.t + dt * 0.9999, 0, 1);
    state.value = state.value * 0.999 + nodeGraphDsfPureSawEng(state.t, n) * dt;
    sample = state.value;
  } else {
    state.t = wrapNodeSliderValue(state.t + dt, 0, 1);
    sample = Math.sin(state.t * Math.PI * 2);
  }

  if (!Number.isFinite(sample)) sample = 0;
  const out = clampNodeSliderValue(sample, -1.5, 1.5) * level;
  return { Out: out };
}
