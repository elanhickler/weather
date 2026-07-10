<div align="center">

# 🌦️ weather

*RAIN — the agent in charge of weather synthesis.*
*Three algorithms, one goal: synthesize weather from first principles, not samples.*

</div>

---

## 📖 Contents

- [Static — a random pulse train](#-static--a-random-pulse-train)
- [Water & rip FX — a clean resonant filter](#-water--rip-fx--a-clean-resonant-filter)
- [Colors of noise — wind, waves, air](#-colors-of-noise--wind-waves-air)
- [Plan of attack](#-plan-of-attack)
- [Running it](#-running-it)
- [License](#-license)

---

## ⚡ Static — a random pulse train

The building block for anything that sounds like discrete droplets or crackle
rather than a continuous wash: individual rain drops hitting a surface,
distant hail, static/crackle texture underneath thunder.

The core idea is simple and deliberately not a fixed clock:

- A random inter-pulse interval (drawn from an exponential or gamma
  distribution gives more natural "clumping" than uniform random — real rain
  isn't evenly spaced).
- Each pulse gets its own randomized amplitude and a short randomized decay
  (a single-sample impulse through a fast one-pole/two-pole decay, not a
  fixed-length sample) so no two drops sound identical.
- Density (pulses/second) becomes the single knob that takes you from
  "occasional drips" to "heavy static wash" — at high enough density the
  pulse train statistically blurs into what's effectively noise, which is
  the natural bridge to the noise-color work below.

This is the same family of idea as the shot-noise / Poisson-click generators
used for granular rain synthesis in classic procedural-audio work — nothing
exotic, just done with real per-event randomization instead of a looped
sample.

---

## 💧 Water & rip FX — a clean resonant filter

Water, rips, and tearing/ripping FX all want the same underlying tool: a
**resonant filter driven by an excitation signal** (noise or an impulse),
tuned so the resonance itself becomes the pitched/tonal part of the sound —
water droplets ping at a resonant frequency, a rip has a fast-sweeping
resonant peak riding on top of a broadband tear.

Two concrete references for the actual DSP, both explored in depth in this
account's `soemdsp-sandbox-analog-filters` work:

- **Flower Child Filter, Rev1 (Clean mode)** — a feedback-modulated
  sine-oscillator resonator through two cascaded one-pole lowpass stages,
  with resonance-scaled feedback. This is the "clean" end of the family: at
  low-to-moderate resonance it behaves like a normal resonant lowpass; pushed
  toward full resonance it self-oscillates with only a slight howl rather
  than an aggressive scream, which is exactly the character wanted for a
  clean droplet "ping" or a smooth rip-sweep rather than a growl.
  ([source](https://github.com/elanhickler/soemdsp-sandbox-analog-filters/blob/analog-filters/native_modules/flower_child_filter/flower_child_filter.cpp))
- **RS-MET's work in general** — Robin Schmidt's RS-MET library is the
  reference implementation this account has been porting/verifying against
  for the whole analog-filters effort. For a genuinely clean, well-documented
  resonator to build from, the zero-delay-feedback state-variable filter is
  the strongest candidate: it's derived directly from the analog RBJ
  cookbook topology (trapezoidal-integrator TDF2, no unit-delay artifacts),
  produces simultaneous lowpass/bandpass/highpass outputs from one shared
  core, and every mode (including the bell/peak response most useful for a
  tonal "ping") is a small, exact, closed-form coefficient set — no
  approximation needed.
  ([RS-MET StateVariableFilter.h](https://github.com/RobinSchmidt/RS-MET/blob/master/Libraries/RobsJuceModules/rapt/Filters/Musical/StateVariableFilter.h))

The practical plan: drive that resonator with the pulse train above (for
individual droplets/pings) or with colored noise (for a continuous water
wash), and sweep its center frequency/resonance quickly for rip/tear FX.

---

## 🌬️ Colors of noise — wind, waves, air

Everything that isn't discrete events wants a **noise color**, not a pulse
train — ocean waves, sustained wind/air currents, and mechanical air sounds
(air conditioner hum, vacuum cleaner drone) are all continuous, broadband,
and differ mainly in *where their energy sits in the spectrum*:

| Color | Spectral shape | Where it fits here |
|---|---|---|
| **White** | Flat power spectral density | Raw excitation source for the resonant filter above; rarely used directly as an audible texture |
| **Pink** (1/f) | Equal energy per octave | Steady wind, distant surf — the "natural background" color; most real-world ambient noise leans pink |
| **Red / Brown** (1/f²) | Heavier low-end rolloff | Deep ocean wave rumble, low air-current rumble under a storm |
| **Blue** (f) | Rising with frequency | Hiss-forward textures — a vacuum cleaner's higher-pitched whine sits here |
| **Violet** (f²) | Steep high-frequency emphasis | Sharpest/harshest hiss component, used sparingly, layered under blue for "motor whine" edge |

Practically: air conditioner and vacuum sounds are built as a **layered mix**
— a brown/red rumble for the motor body, a band-limited pink/blue layer for
the airflow hiss, and (for air conditioner specifically) a narrow resonant
peak from the water/rip filter above tuned to a low hum frequency for the
compressor's tonal component. Ocean waves are the same layering idea at a
much slower time scale: a brown noise bed shaped by a very slow LFO
envelope (the swell), with a pink/white transient layer at each wave's peak
for the foam/crash detail.

---

## 🗺️ Plan of attack

| Piece | Status |
|---|---|
| Random pulse train (static/droplets) | 🔲 not started |
| Pulse Explosion module (skewed-gaussian burst scheduler) | ✅ built |
| Clean resonant filter (water/rip FX) | 🔲 not started |
| Noise color generators (white/pink/red/blue/violet) | 🔲 not started |
| Layered composites (wind, waves, air conditioner, vacuum) | 🔲 not started |

**Pulse Explosion** (`pulseExplosion` node type) is the first piece built: on a
rising-edge trigger it schedules a burst of single-sample pulses across a
Start/Center/End Time window via rejection sampling against a skewed tent-shaped
density curve (Time Spread controls how tightly the burst concentrates around
Center Time). An optional Seed makes the burst reproducible; a Curve output
exposes the same density shape as a continuous signal so it can be patched
elsewhere. The node's display draws the density curve with dots at the exact
pre-calculated pulse positions the current seed/parameters will produce.

This is a plan, not a changelog — everything else here is still just a plan,
not claimed as built.

---

## ▶️ Running it

```powershell
# Requirements: Python 3, a modern browser. No package install needed.

git clone https://github.com/elanhickler/weather.git
cd weather

python server.py
# open http://127.0.0.1:8765

python scripts\smoke_test.py
```

---

## 📄 License

Source-available for noncommercial use only, same as upstream `soemdsp-sandbox`.
Commercial use requires a separate written commercial license from
Soundemote. See [`LICENSE`](LICENSE).
