# soemdsp-sandbox

Browser sandbox for trying `soemdsp` patching, generated artifacts, waveform
views, Render Sample, and Live Audio.

## Requirements

- Python 3
- A modern browser

No package install is required for the sandbox server.

## Download

```powershell
git clone https://github.com/soundemote/soemdsp-sandbox.git
cd soemdsp-sandbox
```

## Run

Start the local server:

```powershell
python server.py
```

Open:

```text
http://127.0.0.1:8765
```

Stop the server with `Ctrl+C`.

## Optional Artifact Packet

The sandbox can inspect generated `soemdsp` artifact packets. If you also have
the sibling `soemdsp` repo built locally, generate the current packet first:

```powershell
C:\Users\argit\Documents\_PROGRAMMING\soemdsp\build-moved\examples\Debug\runtime_dsp_object_bound_wav_resync_demo.exe
```

Then run the sandbox normally:

```powershell
python server.py
```

## Smoke Test

Run:

```powershell
python scripts\smoke_test.py
```

The smoke test starts temporary local servers and checks the shell, static files,
manifest handling, node graph contract, audio artifacts, and server error paths.

## Guides

- [Adding a Hardcoded Sandbox Module to the Current WebUI](docs/ADDING_HARDCODED_SANDBOX_MODULE.md)
- [OSC Module Non-UI Reference](docs/OSC_MODULE_NON_UI_REFERENCE.md)

## Boundaries

- The server is read-only.
- The browser patch graph is demo-scoped state.
- The browser compiler is not the production `soemdsp` scheduler.
- The WebUI does not instantiate real C++ DSP objects yet.
- Patch files can save current module instances and settings, but cannot define
  new module types by themselves.
