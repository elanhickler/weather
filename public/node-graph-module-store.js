const nodeGraphModuleStoreTypes = Object.freeze([
  "osc",
  "additiveOsc",
  "gpuAdditiveOsc",
  "distortionOscillator",
  "dsfOscillator",
  "ellipsoid",
  "polyBlep",
  "fbPolyBlepOsc",
  "sineWavetable",
  "jerobeamNyqistShannon",
  "drumMachine",
  "kickDrum",
  "snareDrum",
  "clock",
  "clockDivider",
  "delayedTrigger",
  "buttonEvents",
  "nextPatch",
  "previousPatch",
  "randomClock",
  "triggerCounter",
  "triggerDivider",
  "stepSequencer",
  "melodySequencer",
  "chordSequencer",
  "arpeggiator",
  "spiral",
  "lorenzAttractor",
  "rosslerAttractor",
  "chuaAttractor",
  "aizawaAttractor",
  "thomasAttractor",
  "halvorsenAttractor",
  "noise",
  "stereoNoise",
  "noiseGenerator",
  "randomWalk",
  "fractalBrownianNoise",
  "clapPlugin",
  "codeblock",
  "graph",
  "graph2",
  "gain",
  "bias",
  "output",
  "macroKnob",
  "bipolarKnob",
  "valueSlider",
  "rangeSlider",
  "midiOut",
  "midiNotePitch",
  "midiController",
  "keyboardController",
  "moduleShop",
  "macroControls",
  "pitchModWheel",
  "xyPad",
  "portalInLeft",
  "portalInRight",
  "portalInMono",
  "portalOutLeft",
  "portalOutRight",
  "portalOutMono",
  "portalGenericInput",
  "portalGenericOutput",
  "groupInput",
  "groupOutput",
  "audioPlayer",
  "samplePlayer",
  "sampleLooper",
  "highpass",
  "lowpass",
  "bandpass",
  "cookbookFilter",
  "ladderFilter",
  "slewLimiter",
  "delayEffect",
  "reverbEffect",
  "distortionEffect",
  "sampleHold",
  "digitalCurveEnvelope",
  "expAdsr",
  "flowerChildEnvelopeFollower",
  "linearEnvelope",
  "pluckEnvelope",
  "vactrolEnvelope",
  "sandboxVisuals",
  "screenSpaceShader",
  "bloomGlow",
  "rgbaHsla",
  "chromaColor",
  "image",
  "canvas",
  "led",
  "visualOscilloscope",
  "parabol",
  "vibratoGenerator",
  "wowAndFlutter",
  "speakerProtection",
  "badvalMonitor",
  "textBox",
]);

const nodeGraphModuleGroupStorageKey = "soemdsp-sandbox.moduleGroups.v1";
const nodeGraphModuleCatalogVisibilityStorageKey = "soemdsp-sandbox.moduleCatalogVisibility.v2";

const nodeGraphModuleStoreDepartments = Object.freeze([
  "Oscillator",
  "Additive Engines",
  "Drum Machines",
  "Filter",
  "Effects",
  "Clock",
  "Melody Sequencer",
  "Chord Sequencer",
  "Arpeggiator",
  "Time",
  "Audio",
  "Dynamics",
  "Debug",
  "Envelope Systems",
  "Modulators",
  "Knobs",
  "Sliders",
  "Controllers",
  "Portals",
  "Samples",
  "Random",
  "Chaos",
  "Visual",
]);

const nodeGraphModuleStoreDepartmentAds = Object.freeze({
  Oscillator: {
    symbol: "∿",
    title: "Oscillator",
    pitch: "Start with a voice. Tone generators, phase motion, and the raw signal that everything else learns to orbit.",
  },
  "Additive Engines": {
    symbol: "+",
    title: "Additive Engines",
    pitch: "Harmonic engines, partial banks, and tone builders for sculpting sound from summed sine energy.",
  },
  "Drum Machines": {
    symbol: "▥",
    title: "Drum Machines",
    pitch: "Rhythm machines, drum voices, pattern engines, and percussion control surfaces.",
  },
  Filter: {
    symbol: "◫",
    title: "Filter",
    pitch: "Shape the airframe. Carve mass, reveal brightness, and teach a signal where it is allowed to fly.",
  },
  Effects: {
    symbol: "FX",
    title: "Effects",
    pitch: "Delay, reverb, distortion, and performance processors for shaping finished sound.",
  },
  Clock: {
    symbol: "◷",
    title: "Clock",
    pitch: "Pulse generators, dividers, counters, delays, and timing utilities for musical logic.",
  },
  "Melody Sequencer": {
    symbol: "♪",
    title: "Melody Sequencer",
    pitch: "Pitch lanes and melodic pattern tools for generating lines, hooks, and motion.",
  },
  "Chord Sequencer": {
    symbol: "♬",
    title: "Chord Sequencer",
    pitch: "Progression tools for harmonic movement, voicings, and chord-triggered systems.",
  },
  Arpeggiator: {
    symbol: "↟",
    title: "Arpeggiator",
    pitch: "Pattern engines for broken chords, rhythmic note motion, and performance arps.",
  },
  Time: {
    symbol: "◷",
    title: "Time",
    pitch: "Instructions, timing surfaces, labels, and the slow machinery that makes a patch readable in motion.",
  },
  Audio: {
    symbol: "OUT",
    title: "Audio",
    pitch: "Audio sinks and listening endpoints for turning patch signal into rendered or live sound.",
  },
  Dynamics: {
    symbol: "⚡",
    title: "Dynamics",
    pitch: "Power routing, level control, offsets, and response shaping for keeping a circuit alive under pressure.",
  },
  Debug: {
    symbol: "DBG",
    title: "Debug",
    pitch: "Inspection tools, sentinels, and safety monitors for catching bad values while a patch is under test.",
  },
  "Envelope Systems": {
    symbol: "⌒",
    title: "Envelop",
    pitch: "Attack, decay, sustain, release, and gate-shaped motion. Make sound and visuals breathe on command.",
  },
  Modulators: {
    symbol: "⇄",
    title: "Modulator",
    pitch: "Motion sources for pitch, amplitude, time, and texture. Small control engines that make patches move.",
  },
  Knobs: {
    symbol: "◎",
    title: "Knobs",
    pitch: "Manual control surfaces for performance, defaults, and expressive patch steering.",
  },
  Sliders: {
    symbol: "▤",
    title: "Sliders",
    pitch: "Continuous control lanes for drawing, trimming, and riding values in real time.",
  },
  Controllers: {
    symbol: "⌘",
    title: "Controllers",
    pitch: "Input devices and control bridges for keyboards, MIDI, gamepads, and external gestures.",
  },
  Portals: {
    symbol: "IO",
    title: "Portals",
    pitch: "Patch boundary portals for moving left, right, and mono signal lanes between rooms, templates, and larger circuits.",
  },
  Samples: {
    symbol: "▣",
    title: "Samples",
    pitch: "Audio clips, one-shots, loops, and sample playback tools.",
  },
  Random: {
    symbol: "✦",
    title: "Noise",
    pitch: "Noise, dust, instability, sparks, and all the useful mess a clean machine secretly needs.",
  },
  Chaos: {
    symbol: "∞",
    title: "Chaos",
    pitch: "All the various attractors and strange motion systems. The wild shelf where math starts looking back.",
  },
  Visual: {
    symbol: "V",
    title: "Visual",
    pitch: "Patch signals into sandbox behavior. Screen shake is the first control port for sound-to-visual routing.",
  },
});

const nodeGraphModuleStoreCatalog = Object.freeze({
  osc: {
    category: "Oscillator",
    description: "Core tone generator. Turns frequency, phase, and waveform into a controllable voice.",
    notes: ["phase counter", "waveform selection", "frequency control"],
  },
  additiveOsc: {
    category: "Additive Engines",
    description: "Harmonic additive tone source using SOEMDSP waveform partial recipes.",
    notes: ["harmonic sum", "waveform selector", "band-limited partials"],
  },
  gpuAdditiveOsc: {
    category: "Additive Engines",
    description: "Buffered GPU additive engine proof module. Reuses the CPU additive path in live audio and prepares WebGPU chunk rendering with fallback.",
    label: "GPU Additive",
    notes: ["WebGPU proof", "buffered backend", "CPU fallback"],
  },
  distortionOscillator: {
    category: "Oscillator",
    description: "Placeholder for a tone source with built-in distortion character and drive-shaped motion.",
    label: "DistortionOscillator",
    notes: ["placeholder", "driven tone", "future oscillator"],
  },
  dsfOscillator: {
    category: "Oscillator",
    description: "Placeholder for a discrete summation formula oscillator with rich harmonic control.",
    label: "DSFOscillator",
    notes: ["placeholder", "harmonic series", "future oscillator"],
  },
  ellipsoid: {
    category: "Oscillator",
    description: "SOEMDSP ellipsoid motion oscillator. Emits paired X/Y curved waveform outputs from two phase-offset ellipsoid DSP paths.",
    label: "Ellipsoid",
    notes: ["geometric motion", "x/y output", "soemdsp oscillator"],
  },
  polyBlep: {
    category: "Oscillator",
    description: "Placeholder for an anti-aliased PolyBLEP oscillator for clean digital waveform edges.",
    label: "PolyBLEP",
    notes: ["placeholder", "anti-aliasing", "future oscillator"],
  },
  fbPolyBlepOsc: {
    category: "Oscillator",
    description: "Realtime forward/backward PolyBLEP oscillator test module, split out from the current PolyBLEP oscillator path for edge-repair experiments.",
    label: "F/B PolyBLEP",
    notes: ["anti-aliasing", "known-edge repair", "realtime oscillator"],
  },
  sineWavetable: {
    category: "Oscillator",
    description: "Placeholder for a sine wavetable oscillator with table-driven phase playback.",
    label: "Sinewavetable",
    notes: ["placeholder", "wavetable", "future oscillator"],
  },
  jerobeamNyqistShannon: {
    category: "Oscillator",
    description: "Placeholder for a Jerobeam Nyqist/Shannon oscillator concept and audiovisual sampling study.",
    label: "JerobeamNyqistShannon",
    notes: ["placeholder", "sampling theorem", "future oscillator"],
  },
  drumMachine: {
    category: "Drum Machines",
    description: "Placeholder for a compact pattern-driven drum machine module.",
    label: "DrumMachine",
    notes: ["placeholder", "patterns", "percussion"],
  },
  kickDrum: {
    category: "Drum Machines",
    description: "Placeholder for a synthesized kick voice with pitch drop, body, and click controls.",
    label: "KickDrum",
    notes: ["placeholder", "drum voice", "low punch"],
  },
  snareDrum: {
    category: "Drum Machines",
    description: "Placeholder for a synthesized snare voice with noise, tone, and snap controls.",
    label: "SnareDrum",
    notes: ["placeholder", "drum voice", "noise snap"],
  },
  clock: {
    category: "Clock",
    description: "Timer pulse source. Emits a steady gate for triggering samplers, sequencers, and motion events.",
    notes: ["rate and phase control", "duty cycle", "reset input"],
  },
  clockDivider: {
    category: "Clock",
    description: "Clock-aware divider. Count incoming clock edges and emit a slower gate for rhythmic subdivision.",
    notes: ["clock input", "division control", "reset input"],
  },
  delayedTrigger: {
    category: "Clock",
    description: "One-shot timer. Catch a trigger, wait a precise delay, then emit a pulse for downstream events.",
    notes: ["delayed pulse", "reset input", "one-shot timing"],
  },
  randomClock: {
    category: "Clock",
    description: "Seeded random interval clock. Emits a short trigger and a duty-controlled gate between minimum and maximum seconds.",
    notes: ["random timing", "trigger and gate outputs", "reset input"],
  },
  triggerCounter: {
    category: "Clock",
    description: "Pulse counter. Count incoming triggers, emit a wrap pulse, and expose the count as modulation.",
    notes: ["count pulses", "wrap output", "reset input"],
  },
  triggerDivider: {
    category: "Clock",
    description: "Divides incoming trigger pulses into slower clocks for envelopes, sequencers, and rhythmic patches.",
    notes: ["trigger division", "reset input", "pulse width"],
  },
  stepSequencer: {
    category: "Melody Sequencer",
    description: "Eight-step trigger sequencer. Advance it with Clock and route stepped control values anywhere.",
    notes: ["trigger input", "reset input", "stepped modulation"],
  },
  melodySequencer: {
    category: "Melody Sequencer",
    description: "Placeholder for a pitch-aware sequencer for hooks, lines, and scale-constrained motion.",
    label: "MelodySequencer",
    notes: ["placeholder", "pitch lane", "scale control"],
  },
  chordSequencer: {
    category: "Chord Sequencer",
    description: "Placeholder for arranging chord progressions and voicing changes inside the graph.",
    label: "ChordSequencer",
    notes: ["placeholder", "progressions", "voicing"],
  },
  arpeggiator: {
    category: "Arpeggiator",
    description: "Placeholder for rhythmic note-pattern generation from held chords or chord sources.",
    label: "Arpeggiator",
    notes: ["placeholder", "note pattern", "arp engine"],
  },
  spiral: {
    category: "Chaos",
    description: "Jerobeam spiral engine. Emits X/Y/Z motion-signal for alien curves and audiovisual flight paths.",
    notes: ["attractor motion", "rotation", "density and morph controls"],
  },
  lorenzAttractor: {
    category: "Chaos",
    description: "Classic butterfly attractor motion for turbulent curls and folding trajectories.",
    label: "Lorenz Attractor",
    notes: ["butterfly attractor", "3D chaos", "X/Y/Z motion"],
  },
  rosslerAttractor: {
    category: "Chaos",
    description: "Ribbon-like chaotic orbit with spiral rolls and folding motion.",
    label: "RosslerAttractor",
    notes: ["spiral fold", "continuous chaos", "planned attractor"],
  },
  chuaAttractor: {
    category: "Chaos",
    description: "Double-scroll circuit attractor for electric, mirrored, hardware-chaos behavior.",
    label: "ChuaAttractor",
    notes: ["double scroll", "circuit chaos", "planned attractor"],
  },
  aizawaAttractor: {
    category: "Chaos",
    description: "Layered orbital attractor with hovering shells and complex central motion.",
    label: "AizawaAttractor",
    notes: ["orbital shells", "3D motion", "planned attractor"],
  },
  thomasAttractor: {
    category: "Chaos",
    description: "Sine-driven strange attractor for smooth looping chaos and balanced spatial motion.",
    label: "ThomasAttractor",
    notes: ["sine feedback", "smooth chaos", "planned attractor"],
  },
  halvorsenAttractor: {
    category: "Chaos",
    description: "Dense braided attractor motion for tangled audiovisual trajectories.",
    label: "HalvorsenAttractor",
    notes: ["braided chaos", "dense orbit", "planned attractor"],
  },
  noise: {
    category: "Random",
    description: "Unstable broadband energy source for static, wind, percussion dust, and danger texture.",
    notes: ["random source", "amplitude", "texture generator"],
  },
  stereoNoise: {
    category: "Random",
    description: "Two independent broadband noise streams as X/Y vector outputs plus a summed mono output for clouds and textures.",
    notes: ["x/y source", "independent channels", "amplitude"],
  },
  noiseGenerator: {
    category: "Random",
    description: "Selectable random source for comparing uniform, gaussian, brown, pink, and crackle flavors side by side.",
    notes: ["distribution choices", "seed control", "noise lab"],
  },
  randomWalk: {
    category: "Random",
    description: "Flexible soemdsp-style random walk with white, filtered, random-step, and fixed-step motion modes.",
    notes: ["bounded walk", "jitter curve", "one-pole smoothing"],
  },
  fractalBrownianNoise: {
    category: "Random",
    description: "Three-axis layered fBm motion source with octave, persistence, scale, and seed controls for rough organic drift.",
    notes: ["out x/y/z", "seeded value noise", "slow terrain motion"],
  },
  clapPlugin: {
    category: "Audio",
    description: "Browser-side shell for a local CLAP host plugin. Stores plugin identity and can use a host instance during bounded Render Sample.",
    label: "CLAP Plugin",
    notes: ["local host", "native plugin", "offline render"],
  },
  codeblock: {
    category: "Controllers",
    description: "Patch-local JavaScript signal processor with editable input and output ports.",
    notes: ["dynamic ports", "JavaScript body", "local patch code"],
  },
  graph: {
    category: "Visual",
    description: "Patch-local soemdsp-style graph object with curve nodes and a vertical cursor position.",
    notes: ["curve display", "cursor line", "graph nodes"],
  },
  graph2: {
    category: "Visual",
    description: "Single-algorithm graph testbed for comparing linear, smooth, and meandering point interpolation.",
    label: "Graph 2",
    notes: ["global smoothing", "curve laboratory", "graph nodes"],
  },
  gain: {
    category: "Dynamics",
    description: "Signal booster and throttle. Use it to push, tame, or route engine power.",
    notes: ["multiplication", "level control", "headroom"],
  },
  bias: {
    category: "Dynamics",
    description: "Offsets a signal away from center. Useful for steering modulation and shifting control lanes.",
    notes: ["addition", "offset", "control lane shift"],
  },
  output: {
    category: "Audio",
    description: "Stereo audio sink. Route Left and Right signals here to hear the patch.",
    label: "Output",
    notes: ["audio sink", "left right inputs", "render target"],
  },
  macroKnob: {
    category: "Knobs",
    description: "Compact 4x4 external knob module. Drag it by hand and patch its value output into another module's parameter modulation input.",
    label: "Macro Knob",
    notes: ["4x4 knob", "manual control", "parameter link"],
  },
  bipolarKnob: {
    category: "Knobs",
    description: "Compact 4x4 center-zero knob module for offsets, modulation depth, and expressive push/pull control links.",
    label: "Bipolar Knob",
    notes: ["4x4 knob", "center zero", "performance control"],
  },
  valueSlider: {
    category: "Sliders",
    description: "Resizable bias-output slider for manual control in the modular view and UI view.",
    label: "Value Slider",
    notes: ["bias output", "resizable widget", "manual control"],
  },
  rangeSlider: {
    category: "Sliders",
    description: "Placeholder for paired minimum/maximum slider control for constraining modulation ranges.",
    label: "RangeSlider",
    notes: ["placeholder", "min max", "range control"],
  },
  midiOut: {
    category: "Controllers",
    description: "Manual MIDI-number source. Outputs the selected note as a normalized 0..1 signal and as the full 0..127 value.",
    notes: ["midi number", "normalized output", "full value output"],
  },
  midiNotePitch: {
    category: "Controllers",
    description: "MIDI note converter. Applies octave and pitch offsets, then emits normalized pitch, full MIDI pitch, and frequency in Hz.",
    notes: ["midi note input", "frequency output", "pitch conversion"],
  },
  midiController: {
    category: "Controllers",
    description: "Placeholder for mapping MIDI controls into the modular graph.",
    label: "MIDIController",
    notes: ["placeholder", "MIDI input", "external control"],
  },
  buttonEvents: {
    category: "Controllers",
    description: "External page button event source. Emits short pulses for explicit click, hover, down, up, enter, and leave events sent into sandbox.",
    label: "Button Events",
    notes: ["external UI", "button triggers", "music page bridge"],
  },
  nextPatch: {
    category: "Controllers",
    description: "Patch command receiver. A trigger edge loads the next saved patch through the main UI patch explorer path.",
    label: "Next Patch",
    notes: ["patch navigation", "trigger input", "music player"],
  },
  previousPatch: {
    category: "Controllers",
    description: "Patch command receiver. A trigger edge loads the previous saved patch through the main UI patch explorer path.",
    label: "Previous Patch",
    notes: ["patch navigation", "trigger input", "music player"],
  },
  keyboardController: {
    category: "Controllers",
    description: "Mouse-playable keyboard source. Emits sustained gate, one-sample gate, key index, quantized key, MIDI pitch, normalized double, phase increment, frequency, numeric pitch, and X/Y gesture values.",
    label: "MIDI Keyboard",
    notes: ["keyboard input", "midi pitch", "gesture signals"],
  },
  moduleShop: {
    category: "Controllers",
    description: "Patch-local button that opens the module browser.",
    label: "Module Browser",
    notes: ["module browser", "patch control"],
  },
  macroControls: {
    category: "Controllers",
    description: "Reads the ten macro knobs under the modular view and emits M1 through M10 as live 0..1 control signals.",
    label: "Macro Controls",
    notes: ["macro row", "manual control", "ten outputs"],
  },
  pitchModWheel: {
    category: "Controllers",
    description: "Reads the separate pitch and mod wheel controls beside the keyboard. Pitch emits -1..1, while mod emits 0..1.",
    label: "Pitch / Mod Wheel",
    notes: ["pitch wheel", "mod wheel", "performance control"],
  },
  xyPad: {
    category: "Controllers",
    description: "Placeholder for a two-axis performance pad that outputs X/Y control values.",
    label: "XYPad",
    notes: ["placeholder", "two-axis control", "performance gesture"],
  },
  portalInLeft: {
    category: "Portals",
    description: "Placeholder portal for bringing a left-channel signal into a patch region.",
    label: "In Left",
    notes: ["placeholder", "left input", "patch boundary"],
  },
  portalInRight: {
    category: "Portals",
    description: "Placeholder portal for bringing a right-channel signal into a patch region.",
    label: "In Right",
    notes: ["placeholder", "right input", "patch boundary"],
  },
  portalInMono: {
    category: "Portals",
    description: "Placeholder portal for bringing a mono signal into a patch region.",
    label: "In Mono",
    notes: ["placeholder", "mono input", "patch boundary"],
  },
  portalOutLeft: {
    category: "Portals",
    description: "Placeholder portal for sending a left-channel signal out of a patch region.",
    label: "Out Left",
    notes: ["placeholder", "left output", "patch boundary"],
  },
  portalOutRight: {
    category: "Portals",
    description: "Placeholder portal for sending a right-channel signal out of a patch region.",
    label: "Out Right",
    notes: ["placeholder", "right output", "patch boundary"],
  },
  portalOutMono: {
    category: "Portals",
    description: "Placeholder portal for sending a mono signal out of a patch region.",
    label: "Out Mono",
    notes: ["placeholder", "mono output", "patch boundary"],
  },
  portalGenericInput: {
    category: "Portals",
    description: "Placeholder portal for bringing a generic signal into a patch region.",
    label: "Generic Input",
    notes: ["placeholder", "generic input", "patch boundary"],
  },
  portalGenericOutput: {
    category: "Portals",
    description: "Placeholder portal for sending a generic signal out of a patch region.",
    label: "Generic Output",
    notes: ["placeholder", "generic output", "patch boundary"],
  },
  groupInput: {
    category: "Portals",
    description: "Defines an exposed input on a saved module group.",
    label: "Group Input",
    notes: ["group interface", "public input", "patch boundary"],
  },
  groupOutput: {
    category: "Portals",
    description: "Defines an exposed output on a saved module group.",
    label: "Group Output",
    notes: ["group interface", "public output", "patch boundary"],
  },
  samplePlayer: {
    category: "Samples",
    description: "Patch-local one-shot sample playback. Trigger starts from Start and plays to End with simple click ramps.",
    label: "Sample Player",
    notes: ["sample playback", "one shot", "audio source"],
  },
  audioPlayer: {
    category: "Samples",
    description: "Patch-local music file player with stereo outputs and a phasor-driven scrub input for sample-accurate playback head control.",
    label: "Music Player",
    notes: ["music playback", "scrubbable", "phasor", "audio source"],
  },
  sampleLooper: {
    category: "Samples",
    description: "Patch-local gated sample loop playback with loop bounds, pitch control, and seam crossfade.",
    label: "Sample Looper",
    notes: ["sample playback", "loop", "audio source"],
  },
  highpass: {
    category: "Filter",
    description: "Cuts low-frequency mass so bright signal can escape the hull.",
    notes: ["cutoff frequency", "stateful filter", "bright motion"],
  },
  lowpass: {
    category: "Filter",
    description: "Cuts high-frequency sparks and leaves heavier warm signal behind.",
    notes: ["cutoff frequency", "smoothing", "warm motion"],
  },
  bandpass: {
    category: "Filter",
    description: "Focuses a signal between low and high cut points using the one-pole filter pair.",
    notes: ["low cut", "high cut", "focused band"],
  },
  cookbookFilter: {
    category: "Filter",
    description: "RSMET cookbook biquad cascade with mode, frequency, stages, Q, and gain controls plus an in-module response curve.",
    label: "Multi Stage Filter",
    notes: ["mode selection", "biquad stages", "curve display"],
  },
  ladderFilter: {
    category: "Filter",
    description: "RSMET ladder filter using the gain-compensated getSample path with frequency, resonance, stage depth, and mode controls.",
    label: "Ladder Filter",
    notes: ["RSMET ladder", "gain compensated", "resonant stages"],
  },
  slewLimiter: {
    category: "Modulators",
    description: "Limits rising and falling motion independently, turning abrupt changes into shaped ramps.",
    notes: ["up time", "down time", "asymmetric glide"],
  },
  delayEffect: {
    category: "Effects",
    description: "SOEMDSP-style modulated fractional delay with feedback, wet/dry mix, and diffuse mode.",
    label: "Delay",
    notes: ["modulated delay", "fractional echo", "diffuse mode"],
  },
  reverbEffect: {
    category: "Effects",
    description: "Placeholder for space, room, tail, and ambience processing.",
    label: "ReverbEffect",
    notes: ["placeholder", "space", "decay"],
  },
  distortionEffect: {
    category: "Effects",
    description: "Placeholder for drive, clipping, saturation, and tone-shaping distortion effects.",
    label: "DistortionEffect",
    notes: ["placeholder", "drive", "saturation"],
  },
  sampleHold: {
    category: "Random",
    description: "Captures an input value when a trigger rises and holds it until the next trigger.",
    notes: ["triggered capture", "held output", "stepped motion"],
  },
  digitalCurveEnvelope: {
    category: "Envelope Systems",
    description: "Programmable curve envelope for drawing sharper motion and custom response shapes.",
    label: "DigitalCurveEnvelope",
    notes: ["curve table", "custom shape", "planned envelope"],
  },
  expAdsr: {
    category: "Envelope Systems",
    description: "Soundemote-style exponential ADSR. Gate it with a clock or pulse and shape the rise and fall curves.",
    label: "ExponentialEnvelope",
    notes: ["gate input", "target-ratio curves", "loopable envelope"],
  },
  flowerChildEnvelopeFollower: {
    category: "Envelope Systems",
    description: "FlowerChild-style rectified envelope follower with attack, hold, and decay slew behavior.",
    label: "FlowerChild Envelope Follower",
    notes: ["audio input", "attack hold decay", "signed follower port"],
  },
  linearEnvelope: {
    category: "Envelope Systems",
    description: "Straight-line envelope for predictable ramps, fades, gates, and simple motion.",
    label: "LinearEnvelope",
    notes: ["gate input", "linear DADSR", "loopable ramp"],
  },
  pluckEnvelope: {
    category: "Envelope Systems",
    description: "Fast feedback pluck contour for struck, picked, pinged, and percussive behaviors.",
    label: "PluckEnvelope",
    notes: ["trigger input", "decay energy", "auto release"],
  },
  vactrolEnvelope: {
    category: "Envelope Systems",
    description: "Optical-style control shaper. Feed it light and get the slow, curved response of a vactrol detector.",
    notes: ["light input", "attack/release lag", "dark current"],
  },
  sandboxVisuals: {
    category: "Visual",
    description: "Sink module for routing patch signals into the screen view. Drive shake, dim, color, scope pause/shutoff, or patch X/Y for direct visual motion.",
    notes: ["visual sink", "shake input", "scope pause"],
  },
  screenSpaceShader: {
    category: "Visual",
    description: "Scripted screen-space visual sink. Declare custom inputs and map them into screen shake, dim, color, scope pause, and offset controls.",
    notes: ["scripted visual sink", "custom inputs", "screen shader controls"],
  },
  bloomGlow: {
    category: "Visual",
    description: "Visual sink for routing patch signals into screen dimming, brightness, bloom, and glow response.",
    notes: ["visual sink", "dim input", "bloom and glow"],
  },
  rgbaHsla: {
    category: "Visual",
    description: "Precise color sink with RGB channels, HSL channels, an HSL mix control, and alpha for the screen wash.",
    notes: ["visual sink", "rgb channels", "hsla control"],
  },
  chromaColor: {
    category: "Visual",
    description: "Stylized color sink for chroma-driven screen washes with hue drift, spread, alpha, trace brightness, bloom, and glow.",
    notes: ["visual sink", "chroma wash", "moving color"],
  },
  image: {
    category: "Visual",
    description: "Patch-local image asset node. Route it into Screen Visuals Trace Image to texture phosphor trace dots.",
    notes: ["load image", "save image", "trace texture"],
  },
  canvas: {
    category: "Visual",
    description: "Layered RGBA compositor for images, scopes, shader passes, transforms, and future game-engine surfaces.",
    notes: ["layer compositor", "RGBA output", "shader script"],
  },
  led: {
    category: "Visual",
    description: "One-grid-unit signal light. Patch any gate or control signal into In and use it as a compact in-world indicator.",
    label: "LED",
    notes: ["1 GU tile", "input light", "visual indicator"],
  },
  visualOscilloscope: {
    category: "Visual",
    description: "Square in-world oscilloscope tile. Patch any signal into In and use it as a dedicated visual display.",
    notes: ["square scope", "signal display", "visual sink"],
  },
  parabol: {
    category: "Modulators",
    description: "Curved control motion for sweeps, bends, and non-linear transitions.",
    label: "Parabol",
    notes: ["parabolic curve", "control motion", "planned modulator"],
  },
  vibratoGenerator: {
    category: "Modulators",
    description: "Pitch-motion generator for musical vibrato and animated oscillator control.",
    label: "VibratoGenerator",
    notes: ["pitch modulation", "rate and depth", "planned modulator"],
  },
  wowAndFlutter: {
    category: "Modulators",
    description: "Tape-style slow wow and fast flutter motion for unstable pitch and timing character.",
    label: "WowAndFlutter",
    notes: ["wow motion", "flutter motion", "planned modulator"],
  },
  badvalMonitor: {
    category: "Debug",
    description: "Circuit sentinel. Watches for invalid values before they spread through the machine.",
    notes: ["NaN guard", "infinity guard", "debug safety"],
  },
  speakerProtection: {
    category: "Debug",
    description: "Hard safety fuse. Trips ear and speaker protection immediately if a wired sample exceeds absolute 1.0.",
    notes: ["speaker safety", "ear protection", "hard limit"],
  },
  textBox: {
    category: "Visual",
    description: "In-world label plate for prompts, lore, instructions, and electric annotations.",
    notes: ["annotation", "layout", "field notes"],
  },
});

function defaultNodeGraphModuleCatalogVisibility() {
  return Object.fromEntries(
    nodeGraphModuleStoreTypes.map((type) => [
      type,
      {
        developer: true,
        home: false,
      },
    ]),
  );
}

function normalizeNodeGraphModuleCatalogVisibility(value = {}) {
  const source = value && typeof value === "object" && !Array.isArray(value) ? value : {};
  return Object.fromEntries(
    nodeGraphModuleStoreTypes.map((type) => {
      const entry = source[type];
      if (entry && typeof entry === "object" && !Array.isArray(entry)) {
        return [
          type,
          {
            developer: entry.developer !== false && entry.shop !== false,
            home: entry.home === true,
          },
        ];
      }
      return [
        type,
        {
          developer: entry !== false,
          home: false,
        },
      ];
    }),
  );
}

function nodeGraphModuleCatalogVisibility() {
  return normalizeNodeGraphModuleCatalogVisibility(nodeGraphMvp.moduleCatalogVisibility);
}

function nodeGraphModuleIsStoreVisible(type, shelf = "shop") {
  const visibility = nodeGraphModuleCatalogVisibility()[type];
  if (shelf === "developer") {
    return visibility?.developer !== false;
  }
  if (shelf === "home") {
    return visibility?.home === true;
  }
  return visibility?.developer !== false;
}

function applyNodeGraphModuleCatalogVisibility(value = {}) {
  nodeGraphMvp.moduleCatalogVisibility = normalizeNodeGraphModuleCatalogVisibility(value);
  renderNodeGraphModuleStoreCatalog();
}

function loadNodeGraphModuleCatalogVisibilityLocal() {
  if (!nodeGraphLocalDefaultPresetAllowed()) {
    return null;
  }
  try {
    const text = window.localStorage.getItem(nodeGraphModuleCatalogVisibilityStorageKey);
    if (!text) {
      return null;
    }
    return normalizeNodeGraphModuleCatalogVisibility(JSON.parse(text));
  } catch {
    return null;
  }
}

function saveNodeGraphModuleCatalogVisibilityLocal(value = nodeGraphModuleCatalogVisibility()) {
  if (!nodeGraphLocalDefaultPresetAllowed()) {
    return false;
  }
  try {
    window.localStorage.setItem(
      nodeGraphModuleCatalogVisibilityStorageKey,
      JSON.stringify(normalizeNodeGraphModuleCatalogVisibility(value)),
    );
    return true;
  } catch {
    return false;
  }
}

function nodeGraphModuleStoreEntries() {
  return nodeGraphModuleStoreTypes
    .map((type) => ({
      ...(nodeGraphModuleStoreCatalog[type] || {}),
      type,
      demoPatch: nodeGraphModuleStoreDemoPatchAvailable(type),
      demoListen: nodeGraphModuleStoreDemoListenAvailable(type),
      developerVisible: nodeGraphModuleIsStoreVisible(type, "developer"),
      homeVisible: nodeGraphModuleIsStoreVisible(type, "home") && Object.hasOwn(nodeGraphModuleDefinitions, type),
      implemented: Object.hasOwn(nodeGraphModuleDefinitions, type),
      label: nodeGraphModuleStoreCatalog[type]?.label || nodeGraphNodeLabels[type] || type,
      shopVisible: nodeGraphModuleIsStoreVisible(type, "shop") && Object.hasOwn(nodeGraphModuleDefinitions, type),
      visible: nodeGraphModuleIsStoreVisible(type, "shop") && Object.hasOwn(nodeGraphModuleDefinitions, type),
    }));
}

function setNodeGraphModuleCatalogVisibility(type, visible, shelf = "shop") {
  if (!nodeGraphModuleStoreTypes.includes(type)) {
    return;
  }
  const key = shelf === "home" ? "home" : "developer";
  const current = nodeGraphModuleCatalogVisibility();
  nodeGraphMvp.moduleCatalogVisibility = {
    ...current,
    [type]: {
      ...(current[type] || { developer: true, home: false }),
      [key]: Boolean(visible),
    },
  };
  saveNodeGraphModuleCatalogVisibilityLocal();
  renderNodeGraphModuleStoreCatalog();
}

function setNodeGraphModuleStoreDepartment(department = "") {
  nodeGraphMvp.moduleStoreDepartment = "";
  renderNodeGraphModuleStoreCatalog();
}

function nodeGraphNormalizeModuleDepartmentSearch(value = "") {
  return String(value || "").trim().toLowerCase();
}

function normalizeNodeGraphModuleStoreGridColumns(value) {
  const number = Math.round(Number(value));
  return Number.isFinite(number) ? Math.max(1, Math.min(16, number)) : 4;
}

function nodeGraphModuleStoreEntryMatchesSearch(entry, query) {
  const needle = nodeGraphNormalizeModuleDepartmentSearch(query);
  if (!needle) {
    return true;
  }
  const haystack = [
    entry.label,
    entry.type,
    entry.category,
    entry.description,
    ...(entry.notes || []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return haystack.includes(needle);
}

function syncNodeGraphModuleShopGridColumns() {
  const columns = normalizeNodeGraphModuleStoreGridColumns(nodeGraphMvp.moduleStoreGridColumns);
  nodeGraphMvp.moduleStoreGridColumns = columns;
  const input = document.getElementById("nodeModuleShopFitInput");
  if (input && input.value !== String(columns)) {
    input.value = String(columns);
  }
  const labelSizeRem = Math.max(0.54, Math.min(1.02, 1.02 - ((columns - 1) * 0.07)));
  const panel = document.getElementById("nodeModuleShopView");
  panel?.style.setProperty("--node-module-shop-columns", String(columns));
  panel?.style.setProperty("--node-module-shop-label-size", `${labelSizeRem.toFixed(3)}rem`);
}

function normalizeNodeGraphModuleShopWindowSize(size = {}) {
  const source = size && typeof size === "object" ? size : {};
  return {
    width: Math.max(260, Math.min(980, Math.round(Number(source.width) || 520))),
    height: Math.max(260, Math.round(Number(source.height) || 620)),
  };
}

function applyNodeGraphModuleShopWindowSize(size = {}) {
  const panel = document.getElementById("nodeModuleShopView");
  const normalized = normalizeNodeGraphModuleShopWindowSize(size);
  if (panel) {
    panel.style.setProperty("--node-module-shop-width", `${normalized.width}px`);
    panel.style.setProperty("--node-module-shop-height", `${normalized.height}px`);
  }
  return normalized;
}

function nodeGraphModuleShopWindowSizeFromElement(panel = document.getElementById("nodeModuleShopView")) {
  const rect = panel?.getBoundingClientRect?.();
  return normalizeNodeGraphModuleShopWindowSize({
    width: rect?.width,
    height: rect?.height,
  });
}

function saveNodeGraphModuleShopWindowSizeToUserSettings() {
  const panel = document.getElementById("nodeModuleShopView");
  if (typeof rememberNodeGraphWorkspaceWindowState === "function") {
    rememberNodeGraphWorkspaceWindowState(
      "moduleBrowser",
      panel,
      { open: !panel?.hidden, size: nodeGraphModuleShopWindowSizeFromElement(panel) },
      { status: false },
    );
  }
}

function handleNodeGraphModuleShopFitInput(event) {
  nodeGraphMvp.moduleStoreGridColumns = normalizeNodeGraphModuleStoreGridColumns(event?.currentTarget?.value);
  syncNodeGraphModuleShopGridColumns();
}

function handleNodeGraphModuleDepartmentSearchInput(event) {
  nodeGraphMvp.moduleStoreDepartmentSearch = String(event?.currentTarget?.value || "");
  renderNodeGraphModuleStoreCatalog();
}

function handleNodeGraphModuleDepartmentSearchKeydown(event) {
  if (event?.key !== "Escape") {
    return;
  }
  event.preventDefault();
  event.stopPropagation();
  nodeGraphMvp.moduleStoreDepartmentSearch = "";
  event.currentTarget.value = "";
  renderNodeGraphModuleStoreCatalog();
}

function nodeGraphModuleStoreDemoPatchAvailable(type) {
  return Boolean(
    Object.hasOwn(nodeGraphModuleDefinitions, type) &&
    !["audioInput", "groupInput", "groupOutput", "moduleGroup", "output"].includes(type)
  );
}

function nodeGraphModuleStoreDemoListenAvailable(type) {
  if (!nodeGraphModuleStoreDemoPatchAvailable(type)) {
    return false;
  }
  return nodeGraphPatchNodeOutputPorts(createNodeGraphPatchNode(type, { id: "demo" })).length > 0;
}

function nodeGraphModuleStoreDemoPatch(type) {
  if (!nodeGraphModuleStoreDemoPatchAvailable(type)) {
    return null;
  }
  const definition = nodeGraphModuleDefinitions[type];
  const outputPorts = nodeGraphPatchNodeOutputPorts(createNodeGraphPatchNode(type, { id: "demo" }));
  const sourcePort = outputPorts.find((port) => port !== "Gate") || outputPorts[0] || "";
  const nodes = [
    createNodeGraphPatchNode(type, { gx: 3, gy: 5, id: "demo" }),
    createNodeGraphPatchNode("output", { gx: 16, gy: 5, id: "output" }),
  ];
  const connections = [];
  if (sourcePort) {
    connections.push({
      destinationNode: "output",
      destinationPort: "Left",
      sourceNode: "demo",
      sourcePort,
    });
    connections.push({
      destinationNode: "output",
      destinationPort: "Right",
      sourceNode: "demo",
      sourcePort,
    });
  }
  return validateNodeGraphPatch({
    audio: { targetSampleRate: 44100 },
    bypassedNodes: [],
    connections,
    format: { ...nodeGraphPatchFormat },
    grid: { ...nodeGraphGrid },
    info: {
      author: "Soundemote",
      description: `Demo patch for ${nodeGraphNodeLabels[type] || type}.`,
      name: `${nodeGraphNodeLabels[type] || type} demo`,
      tags: `${definition?.category || "module"}, demo`,
    },
    modulations: [],
    monitors: [],
    nodes,
    timing: {
      tempoBpm: 120,
      timeSignatureDenominator: 4,
      timeSignatureNumerator: 4,
    },
    uiItems: [],
    view: { widthGu: 22, heightGu: 13 },
    visual: normalizeNodeGraphPatchVisual(nodeGraphMvp.patch?.visual),
    windows: normalizeNodeGraphPatchWindows({}),
  });
}

function playNodeGraphRenderedAudioElement() {
  const audio = document.getElementById("audioPlayer");
  if (!audio?.src) {
    return;
  }
  audio.currentTime = 0;
  audio.play?.().catch?.((_error) => {});
}

function withNodeGraphModuleStoreDemoPatch(entry, callback) {
  const userPatch = cloneNodeGraphPatch(nodeGraphMvp.patch);
  const demoPatch = nodeGraphModuleStoreDemoPatch(entry.type);
  if (!demoPatch) {
    setNodeGraphScriptStatus(`${entry.label} demo unavailable`, false);
    return;
  }
  commitNodeGraphPatch(demoPatch, {
    record: false,
    status: `${entry.label} demo loaded`,
  });
  callback({ demoPatch, userPatch });
}

function listenToNodeGraphModuleStoreDemo(entry) {
  withNodeGraphModuleStoreDemoPatch(entry, ({ userPatch }) => {
    renderNodeGraphAudio();
    const rendered = nodeGraphMvp.rendered ? { ...nodeGraphMvp.rendered } : null;
    const statusText = rendered ? `${entry.label} demo rendered` : `${entry.label} demo render blocked`;
    commitNodeGraphPatch(userPatch, {
      record: false,
      status: "returned to your patch",
    });
    if (rendered) {
      nodeGraphMvp.rendered = rendered;
      syncNodeGraphRenderedAudioElement();
      playNodeGraphRenderedAudioElement();
      setNodeGraphScriptStatus(statusText, true);
    } else {
      markNodeGraphRenderPending(statusText);
      setNodeGraphScriptStatus(statusText, false);
    }
  });
}

function watchNodeGraphModuleStoreDemo(entry) {
  withNodeGraphModuleStoreDemoPatch(entry, () => {
    setNodeGraphViewMode("ui");
  });
}

function editNodeGraphModuleStoreDemo(entry) {
  withNodeGraphModuleStoreDemoPatch(entry, () => {
    setNodeGraphViewMode("modular-only");
  });
}

function createNodeGraphModuleStoreButton(entry) {
  const card = document.createElement("div");
  card.className = "scene-context-store-card";
  card.dataset.moduleEnabled = String(entry.visible);
  card.dataset.homeEnabled = String(entry.homeVisible);
  card.dataset.developerEnabled = String(entry.developerVisible);
  card.title = `${entry.label}: ${entry.description || "Module reference entry."}`;
  card.setAttribute("aria-label", entry.visible && entry.implemented
    ? `Add ${entry.label} module`
    : `${entry.label} module unavailable`);

  const label = document.createElement("strong");
  label.textContent = entry.label;

  const actions = document.createElement("div");
  actions.className = "node-module-store-card-actions";

  const homeButton = document.createElement("button");
  homeButton.className = "node-module-store-card-action";
  homeButton.type = "button";
  homeButton.dataset.storeToggleModule = entry.type;
  homeButton.dataset.storeToggleShelf = "home";
  homeButton.dataset.visible = String(!entry.homeVisible);
  homeButton.title = entry.homeVisible ? "Remove from Home" : "Add to Home";
  homeButton.setAttribute("aria-label", homeButton.title);
  homeButton.textContent = entry.homeVisible ? "🏠-" : "🏠+";
  actions.append(homeButton);

  if (entry.visible && entry.implemented) {
    const addButton = document.createElement("button");
    addButton.className = "node-module-store-card-action node-module-store-card-add";
    addButton.type = "button";
    addButton.dataset.contextModule = entry.type;
    addButton.title = `Add ${entry.label}`;
    addButton.setAttribute("aria-label", `Add ${entry.label}`);
    addButton.textContent = "+";
    actions.append(addButton);
  }

  card.append(label, actions);
  return card;
}

function createNodeGraphModuleDepartmentButton(department, entries) {
  const ad = nodeGraphModuleStoreDepartmentAds[department] || {};
  const titleText = ad.title || department;
  const button = document.createElement("button");
  button.className = "scene-context-store-department-card";
  button.type = "button";
  button.dataset.storeDepartment = department;
  button.title = `${titleText}: module department`;
  button.setAttribute("aria-label", `Open ${titleText} module department.`);
  button.addEventListener("click", (event) => {
    event.stopPropagation();
    setNodeGraphModuleStoreDepartment(department);
  });

  const symbol = document.createElement("span");
  symbol.className = "scene-context-store-department-symbol";
  symbol.setAttribute("aria-hidden", "true");
  symbol.textContent = ad.symbol || "◇";

  const title = document.createElement("strong");
  title.className = "scene-context-store-department-title";
  title.textContent = titleText;

  const preview = document.createElement("span");
  preview.className = "scene-context-store-department-preview";
  preview.textContent = entries
    .slice(0, 4)
    .map((entry) => entry.label)
    .join(" / ");

  button.append(symbol, title, preview);
  return button;
}

function loadNodeGraphModuleGroupsLocal() {
  if (!nodeGraphLocalDefaultPresetAllowed()) {
    return {};
  }
  try {
    const parsed = JSON.parse(window.localStorage.getItem(nodeGraphModuleGroupStorageKey) || "{}");
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return {};
    }
    return parsed;
  } catch {
    return {};
  }
}

function saveNodeGraphModuleGroupsLocal(groups) {
  if (!nodeGraphLocalDefaultPresetAllowed()) {
    return false;
  }
  try {
    window.localStorage.setItem(nodeGraphModuleGroupStorageKey, JSON.stringify(groups));
    return true;
  } catch {
    return false;
  }
}

function createNodeGraphModuleGroupButton(name, group) {
  const card = document.createElement("div");
  card.className = "scene-context-store-card";
  card.dataset.moduleGroup = name;
  card.dataset.contextGroup = name;
  const label = document.createElement("strong");
  label.textContent = name;
  card.append(label);
  return card;
}

function renderNodeGraphModuleGroupCatalog() {
  const shell = document.getElementById("nodeModuleGroups");
  const target = document.getElementById("nodeModuleGroupList");
  if (!shell || !target) {
    return;
  }
  const groups = loadNodeGraphModuleGroupsLocal();
  const names = Object.keys(groups).sort((a, b) => a.localeCompare(b));
  target.innerHTML = "";
  for (const name of names) {
    target.append(createNodeGraphModuleGroupButton(name, groups[name]));
  }
  shell.hidden = names.length === 0;
}

function renderNodeGraphModuleStoreCatalog() {
  const available = document.getElementById("nodeModuleDepartmentList");
  const homeShell = document.getElementById("nodeModuleHomeShelfShell");
  const homeShelf = document.getElementById("nodeModuleHomeShelf");
  const developerShell = document.getElementById("nodeModuleDeveloperListShell");
  const developerList = document.getElementById("nodeModuleDeveloperList");
  const shopView = document.getElementById("nodeModuleShopView");
  if (!available || !homeShell || !homeShelf || !developerShell || !developerList || !shopView) {
    return;
  }

  available.innerHTML = "";
  homeShelf.innerHTML = "";
  developerList.innerHTML = "";
  syncNodeGraphModuleShopGridColumns();

  const entries = nodeGraphModuleStoreEntries();
  const departmentSearch = nodeGraphMvp.moduleStoreDepartmentSearch || "";
  const departmentSearchField = document.getElementById("nodeModuleDepartmentSearch");
  if (departmentSearchField && departmentSearchField.value !== departmentSearch) {
    departmentSearchField.value = departmentSearch;
  }

  const matchingEntries = entries.filter((item) => nodeGraphModuleStoreEntryMatchesSearch(item, departmentSearch));
  const publicEntries = matchingEntries.filter((entry) => entry.implemented && entry.visible);
  const homeEntries = entries.filter((entry) => entry.implemented && entry.homeVisible);
  const developerEntries = matchingEntries.filter((entry) => !entry.implemented);

  for (const entry of homeEntries) {
    homeShelf.append(createNodeGraphModuleStoreButton(entry));
  }
  homeShell.hidden = homeEntries.length === 0;

  for (const entry of publicEntries) {
    available.append(createNodeGraphModuleStoreButton(entry));
  }
  if (!available.children.length) {
    const empty = document.createElement("div");
    empty.className = "scene-context-store-empty";
    empty.textContent = departmentSearch
      ? "No modules match this search."
      : "No modules are available.";
    available.append(empty);
  }

  for (const entry of developerEntries) {
    developerList.append(createNodeGraphModuleStoreButton(entry));
  }
  developerShell.hidden = developerEntries.length === 0;
  renderNodeGraphModuleGroupCatalog();
}

function positionNodeGraphModuleShopView(x, y) {
  const panel = document.getElementById("nodeModuleShopView");
  if (!panel) {
    return;
  }
  panel.style.position = "fixed";
  panel.style.margin = "0";
  const { left, top } = nodeGraphFloatingWindowPosition(panel, x, y);
  panel.style.left = `${left}px`;
  panel.style.top = `${top}px`;
  panel.style.right = "auto";
  if (typeof rememberNodeGraphWorkspaceWindowState === "function") {
    rememberNodeGraphWorkspaceWindowState(
      "moduleBrowser",
      panel,
      { open: !panel.hidden, position: { left, top } },
      { persist: false },
    );
  }
}

function positionNodeGraphModuleShopViewNearPoint(point = null) {
  const panel = document.getElementById("nodeModuleShopView");
  if (!panel) {
    return;
  }
  const x = Number(point?.x);
  const y = Number(point?.y);
  panel.hidden = false;
  const rect = panel.getBoundingClientRect();
  positionNodeGraphModuleShopView(
    Number.isFinite(x) ? x : Math.max(12, (window.innerWidth - rect.width) * 0.5),
    Number.isFinite(y) ? y : 72,
  );
}

function beginNodeGraphModuleShopViewDrag(event) {
  if (event.button > 0 || nodeGraphDialogDragTargetIsInteractive(event)) {
    return;
  }
  const panel = document.getElementById("nodeModuleShopView");
  if (!panel || panel.hidden) {
    return;
  }
  const rect = panel.getBoundingClientRect();
  nodeGraphMvp.moduleShopDragging = {
    handle: event.currentTarget,
    offsetX: event.clientX - rect.left,
    offsetY: event.clientY - rect.top,
    pointerId: event.pointerId ?? null,
  };
  event.currentTarget.classList.add("dragging");
  positionNodeGraphModuleShopView(rect.left, rect.top);
  event.currentTarget.setPointerCapture?.(event.pointerId);
  event.preventDefault();
  event.stopPropagation();
}

function dragNodeGraphModuleShopView(event) {
  const drag = nodeGraphMvp.moduleShopDragging;
  if (
    !drag ||
    (drag.pointerId !== null && event.pointerId !== undefined && drag.pointerId !== event.pointerId)
  ) {
    return;
  }
  positionNodeGraphModuleShopView(
    event.clientX - drag.offsetX,
    event.clientY - drag.offsetY,
  );
  event.preventDefault();
}

function endNodeGraphModuleShopViewDrag(event) {
  const drag = nodeGraphMvp.moduleShopDragging;
  if (
    !drag ||
    (drag.pointerId !== null && event.pointerId !== undefined && drag.pointerId !== event.pointerId)
  ) {
    return;
  }
  drag.handle.classList.remove("dragging");
  if (event.pointerId !== undefined && drag.handle.hasPointerCapture?.(event.pointerId)) {
    drag.handle.releasePointerCapture(event.pointerId);
  }
  nodeGraphMvp.moduleShopDragging = null;
  if (typeof rememberNodeGraphWorkspaceWindowState === "function") {
    rememberNodeGraphWorkspaceWindowState(
      "moduleBrowser",
      document.getElementById("nodeModuleShopView"),
      { open: true },
      { status: false },
    );
  }
}

function beginNodeGraphModuleShopViewResize(event) {
  if (event.button > 0) {
    return;
  }
  const panel = document.getElementById("nodeModuleShopView");
  if (!panel || panel.hidden) {
    return;
  }
  const rect = panel.getBoundingClientRect();
  nodeGraphMvp.moduleShopResizing = {
    handle: event.currentTarget,
    pointerId: event.pointerId ?? null,
    startClientX: event.clientX,
    startClientY: event.clientY,
    startWidth: rect.width,
    startHeight: rect.height,
  };
  event.currentTarget.classList.add("dragging");
  if (event.pointerId !== undefined) {
    event.currentTarget.setPointerCapture(event.pointerId);
  }
  event.preventDefault();
  event.stopPropagation();
}

function dragNodeGraphModuleShopViewResize(event) {
  const drag = nodeGraphMvp.moduleShopResizing;
  if (
    !drag ||
    (drag.pointerId !== null && event.pointerId !== undefined && drag.pointerId !== event.pointerId)
  ) {
    return;
  }
  applyNodeGraphModuleShopWindowSize({
    width: drag.startWidth + event.clientX - drag.startClientX,
    height: drag.startHeight + event.clientY - drag.startClientY,
  });
  event.preventDefault();
}

function endNodeGraphModuleShopViewResize(event) {
  const drag = nodeGraphMvp.moduleShopResizing;
  if (
    !drag ||
    (drag.pointerId !== null && event.pointerId !== undefined && drag.pointerId !== event.pointerId)
  ) {
    return;
  }
  drag.handle.classList.remove("dragging");
  if (event.pointerId !== undefined && drag.handle.hasPointerCapture?.(event.pointerId)) {
    drag.handle.releasePointerCapture(event.pointerId);
  }
  nodeGraphMvp.moduleShopResizing = null;
  saveNodeGraphModuleShopWindowSizeToUserSettings();
}

function openNodeGraphModuleShop(point = null) {
  nodeGraphMvp.sceneContextPoint = point;
  nodeGraphMvp.sceneContextTargetNode = null;
  nodeGraphMvp.sceneContextTargetWire = null;
  nodeGraphMvp.moduleStoreDepartment = "";
  closeNodeSceneContextMenu();
  setNodeGraphViewMode("shop");
  const panel = document.getElementById("nodeModuleShopView");
  if (typeof applyNodeGraphModuleShopWindowSize === "function") {
    applyNodeGraphModuleShopWindowSize(nodeGraphMvp.workspaceWindowStates?.moduleBrowser?.size);
  }
  if (
    typeof positionNodeGraphWorkspaceWindowFromState !== "function" ||
    !positionNodeGraphWorkspaceWindowFromState("moduleBrowser", panel)
  ) {
    positionNodeGraphModuleShopViewNearPoint(point);
  }
  if (typeof rememberNodeGraphWorkspaceWindowState === "function") {
    rememberNodeGraphWorkspaceWindowState("moduleBrowser", panel, { open: true }, { status: false });
  }
}

function loadNodeGraphModuleStoreStateLocal() {
  renderNodeGraphModuleStoreCatalog();
}
