function normalizeNodeGraphSampleId(value = "") {
  return String(value || "")
    .trim()
    .replace(/[^A-Za-z0-9_.:-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
}

function normalizeNodeGraphSampleReference(sample = {}) {
  const source = sample && typeof sample === "object" ? sample : {};
  const id = normalizeNodeGraphSampleId(source.id);
  const name = String(source.name || id || "Sample").trim().slice(0, 128);
  const dataUrl = String(source.dataUrl || "").trim();
  const sampleRate = Math.max(0, Math.round(Number(source.sampleRate) || 0));
  const channels = Math.max(0, Math.min(64, Math.round(Number(source.channels) || 0)));
  const frames = Math.max(0, Math.round(Number(source.frames) || 0));
  return {
    ...(channels ? { channels } : {}),
    ...(dataUrl ? { dataUrl } : {}),
    ...(frames ? { frames } : {}),
    id,
    name,
    ...(sampleRate ? { sampleRate } : {}),
  };
}

function normalizeNodeGraphPatchSamples(samples = []) {
  if (!Array.isArray(samples)) {
    return [];
  }
  const seen = new Set();
  const normalized = [];
  for (const sample of samples) {
    const reference = normalizeNodeGraphSampleReference(sample);
    if (!reference.id || seen.has(reference.id)) {
      continue;
    }
    seen.add(reference.id);
    normalized.push(reference);
  }
  return normalized.slice(0, 128);
}

function nodeGraphPatchSampleById(sampleId, patch = nodeGraphMvp.patch) {
  const id = normalizeNodeGraphSampleId(sampleId);
  return normalizeNodeGraphPatchSamples(patch?.samples).find((sample) => sample.id === id) || null;
}

function nodeGraphSampleNameForNode(nodeId) {
  const node = nodeGraphPatchNode(nodeId);
  const sample = nodeGraphPatchSampleById(node?.sample?.id);
  return sample?.name || "No sample";
}

function nodeGraphSampleFileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error || new Error("Sample file read failed"));
    reader.onload = () => resolve(String(reader.result || ""));
    reader.readAsDataURL(file);
  });
}

async function decodeNodeGraphSampleDataUrl(dataUrl, fallbackName = "Sample") {
  const response = await fetch(dataUrl);
  const arrayBuffer = await response.arrayBuffer();
  const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextConstructor) {
    throw new Error("Web Audio API unavailable");
  }
  const context = new AudioContextConstructor();
  const audioBuffer = await context.decodeAudioData(arrayBuffer.slice(0));
  await context.close?.();
  const frames = audioBuffer.length;
  const channels = audioBuffer.numberOfChannels;
  const channelData = Array.from({ length: channels }, (_, channel) =>
    new Float32Array(audioBuffer.getChannelData(channel)),
  );
  const mono = new Float32Array(frames);
  for (let channel = 0; channel < channels; channel += 1) {
    const data = channelData[channel];
    for (let frame = 0; frame < frames; frame += 1) {
      mono[frame] += data[frame] / Math.max(1, channels);
    }
  }
  return {
    channelData,
    channels,
    frames,
    name: fallbackName,
    sampleRate: audioBuffer.sampleRate,
    samples: mono,
  };
}

async function loadNodeGraphSampleForNode(nodeId, file) {
  if (!file || !nodeId) {
    return;
  }
  const dataUrl = await nodeGraphSampleFileToDataUrl(file);
  const decoded = await decodeNodeGraphSampleDataUrl(dataUrl, file.name || "Sample");
  const id = normalizeNodeGraphSampleId(`sample-${Date.now()}-${file.name || "clip"}`);
  const sample = normalizeNodeGraphSampleReference({
    channels: decoded.channels,
    dataUrl,
    frames: decoded.frames,
    id,
    name: file.name || "Sample",
    sampleRate: decoded.sampleRate,
  });
  const patch = cloneNodeGraphPatch(nodeGraphMvp.patch);
  const samples = normalizeNodeGraphPatchSamples(patch.samples);
  samples.push(sample);
  patch.samples = samples;
  const node = patch.nodes.find((candidate) => candidate.id === nodeId);
  if (node) {
    node.sample = { id };
    node.params = { ...(node.params || {}), sample: samples.length };
  }
  commitNodeGraphPatch(patch, { status: `${sample.name} loaded` });
  nodeGraphMvp.sampleBuffers?.set?.(id, {
    channelData: decoded.channelData,
    channels: decoded.channels,
    frames: decoded.frames,
    id,
    name: sample.name,
    sampleRate: decoded.sampleRate,
    samples: decoded.samples,
  });
  scheduleNodeGraphLivePlanSync("plan");
}

function createNodeGraphSampleModuleBody(nodeId) {
  const patchNode = nodeGraphPatchNode(nodeId);
  const isMusicPlayer = patchNode?.type === "audioPlayer";
  const body = document.createElement("div");
  body.className = "node-sample-module-body";
  const name = document.createElement("div");
  name.className = "node-sample-name";
  name.dataset.sampleNameForNode = nodeId;
  name.textContent = nodeGraphSampleNameForNode(nodeId);
  const button = document.createElement("button");
  button.className = "node-sample-load-button";
  button.type = "button";
  button.textContent = isMusicPlayer ? "Load Music" : "Load Sample";
  button.addEventListener("click", () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "audio/*";
    input.addEventListener("change", () => {
      const file = input.files?.[0];
      if (file) {
        loadNodeGraphSampleForNode(nodeId, file).catch((error) => {
          setNodeInteractionHelp(`Sample load failed: ${error.message || error}`);
        });
      }
    }, { once: true });
    input.click();
  });
  body.append(name, button);
  return body;
}

async function nodeGraphDecodedSampleForReference(reference) {
  if (!reference?.dataUrl) {
    return null;
  }
  const decoded = await decodeNodeGraphSampleDataUrl(reference.dataUrl, reference.name);
  return {
    channelData: decoded.channelData,
    channels: decoded.channels,
    frames: decoded.frames,
    id: reference.id,
    name: reference.name,
    sampleRate: decoded.sampleRate,
    samples: decoded.samples,
  };
}

async function nodeGraphRuntimeSamplesForPlan(plan, patch = nodeGraphMvp.patch) {
  const needed = new Set(
    (plan?.nodes || [])
      .filter((node) => node.type === "samplePlayer" || node.type === "sampleLooper" || node.type === "audioPlayer")
      .map((node) => normalizeNodeGraphSampleId(node.sample?.id))
      .filter(Boolean),
  );
  if (!needed.size) {
    return [];
  }
  const samples = [];
  for (const reference of normalizeNodeGraphPatchSamples(patch.samples)) {
    if (!needed.has(reference.id)) {
      continue;
    }
    const decoded = await nodeGraphDecodedSampleForReference(reference);
    if (decoded?.samples?.length) {
      samples.push(decoded);
    }
  }
  return samples;
}

function nodeGraphLiveSampleForReference(reference) {
  const id = normalizeNodeGraphSampleId(reference?.id);
  const cached = id ? nodeGraphMvp.sampleBuffers?.get?.(id) : null;
  if (cached?.samples?.length || cached?.channelData?.length) {
    return {
      channelData: (cached.channelData || []).map((channel) => channel instanceof Float32Array ? channel : new Float32Array(channel || [])),
      channels: cached.channels || cached.channelData?.length || 1,
      frames: cached.frames || cached.samples?.length || cached.channelData?.[0]?.length || 0,
      id,
      name: cached.name || reference.name || id,
      sampleRate: cached.sampleRate || reference.sampleRate || 44100,
      samples: cached.samples instanceof Float32Array ? cached.samples : new Float32Array(cached.samples || []),
    };
  }
  return null;
}

function nodeGraphLiveSamplesForPlan(plan, patch = nodeGraphMvp.patch) {
  const needed = new Set(
    (plan?.nodes || [])
      .filter((node) => node.type === "samplePlayer" || node.type === "sampleLooper" || node.type === "audioPlayer")
      .map((node) => normalizeNodeGraphSampleId(node.sample?.id))
      .filter(Boolean),
  );
  return normalizeNodeGraphPatchSamples(patch.samples)
    .filter((reference) => needed.has(reference.id))
    .map((reference) => nodeGraphLiveSampleForReference(reference))
    .filter((sample) => sample?.id && (sample.samples?.length || sample.channelData?.length));
}
