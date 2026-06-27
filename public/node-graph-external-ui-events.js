const nodeGraphExternalButtonEventNames = Object.freeze(["click", "hover", "down", "up", "enter", "leave"]);
const nodeGraphWireBreakGateSeconds = 0.52;
const nodeGraphWindowReopenGateSeconds = 1;
const nodeGraphGameTriggerDispatchDelayMs = 40;
const nodeGraphGameTriggerPulseSeconds = 0.02;

function normalizeNodeGraphExternalButtonEventName(name) {
  const key = String(name || "").trim().toLowerCase();
  if (key === "mousedown" || key === "pointerdown") return "down";
  if (key === "mouseup" || key === "pointerup") return "up";
  if (key === "mouseenter" || key === "pointerenter") return "enter";
  if (key === "mouseleave" || key === "pointerleave") return "leave";
  return nodeGraphExternalButtonEventNames.includes(key) ? key : "";
}

function nodeGraphExternalButtonEventPulseSamples(sampleRate = nodeGraphMvp?.sampleRate || 44100) {
  return Math.max(1, Math.round(Math.max(1, Number(sampleRate) || 44100) * 0.02));
}

function setNodeGraphExternalButtonEventPulse(target, name, sampleRate) {
  const key = normalizeNodeGraphExternalButtonEventName(name);
  if (!key) return false;
  const map = target.externalButtonEvents instanceof Map
    ? target.externalButtonEvents
    : new Map();
  target.externalButtonEvents = map;
  map.set(key, Math.max(Number(map.get(key)) || 0, nodeGraphExternalButtonEventPulseSamples(sampleRate)));
  return true;
}

function sendNodeGraphLiveExternalButtonEvent(name, payload = {}) {
  const key = normalizeNodeGraphExternalButtonEventName(name);
  if (!key) return false;
  if (nodeGraphMvp.live.runtime) {
    setNodeGraphExternalButtonEventPulse(
      nodeGraphMvp.live.runtime,
      key,
      nodeGraphMvp.live.context?.sampleRate || nodeGraphMvp.sampleRate,
    );
  }
  if (nodeGraphMvp.live.usesWorklet && nodeGraphMvp.live.node?.port) {
    nodeGraphMvp.live.node.port.postMessage({
      name: key,
      payload,
      type: "externalButtonEvent",
    });
  }
  window.dispatchEvent(new CustomEvent("nodeGraphExternalButtonEvent", {
    detail: { name: key, payload },
  }));
  return true;
}

function triggerNodeGraphExternalButtonEvent(name, payload = {}) {
  return sendNodeGraphLiveExternalButtonEvent(name, payload);
}

function scheduleNodeGraphLiveGameTriggerEvent(send, reason = "") {
  if (typeof send !== "function") {
    return false;
  }
  const normalizedReason = String(reason || "").slice(0, 120);
  window.setTimeout(() => {
    send(normalizedReason);
  }, nodeGraphGameTriggerDispatchDelayMs);
  return true;
}

function nodeGraphGameTriggerPulseSamples(sampleRate = nodeGraphMvp?.sampleRate || 44100) {
  return Math.max(1, Math.round(Math.max(1, Number(sampleRate) || 44100) * nodeGraphGameTriggerPulseSeconds));
}

function nodeGraphWireBreakGateSamples(sampleRate = nodeGraphMvp?.sampleRate || 44100) {
  return Math.max(1, Math.round(Math.max(1, Number(sampleRate) || 44100) * nodeGraphWireBreakGateSeconds));
}

function setNodeGraphWireBreakEventPulse(target, sampleRate) {
  if (!target || typeof target !== "object") {
    return false;
  }
  const event = target.wireBreakEvent && typeof target.wireBreakEvent === "object"
    ? target.wireBreakEvent
    : { pulseSamples: 0, gateSamples: 0 };
  event.pulseSamples = Math.max(Number(event.pulseSamples) || 0, nodeGraphGameTriggerPulseSamples(sampleRate));
  event.gateSamples = Math.max(Number(event.gateSamples) || 0, nodeGraphWireBreakGateSamples(sampleRate));
  target.wireBreakEvent = event;
  return true;
}

function sendNodeGraphLiveWireBreakEvent(reason = "") {
  if (nodeGraphMvp.live.runtime) {
    setNodeGraphWireBreakEventPulse(
      nodeGraphMvp.live.runtime,
      nodeGraphMvp.live.context?.sampleRate || nodeGraphMvp.sampleRate,
    );
  }
  if (nodeGraphMvp.live.usesWorklet && nodeGraphMvp.live.node?.port) {
    nodeGraphMvp.live.node.port.postMessage({
      reason: String(reason || "").slice(0, 120),
      type: "wireBreakEvent",
    });
  }
  window.dispatchEvent(new CustomEvent("nodeGraphWireBreakEvent", {
    detail: { reason: String(reason || "") },
  }));
  return true;
}

function triggerNodeGraphWireBreakEvent(reason = "") {
  return scheduleNodeGraphLiveGameTriggerEvent(sendNodeGraphLiveWireBreakEvent, reason);
}

function setNodeGraphWireConnectEventPulse(target, sampleRate) {
  if (!target || typeof target !== "object") {
    return false;
  }
  const event = target.wireConnectEvent && typeof target.wireConnectEvent === "object"
    ? target.wireConnectEvent
    : { pulseSamples: 0 };
  event.pulseSamples = Math.max(Number(event.pulseSamples) || 0, nodeGraphGameTriggerPulseSamples(sampleRate));
  target.wireConnectEvent = event;
  return true;
}

function sendNodeGraphLiveWireConnectEvent(reason = "") {
  if (nodeGraphMvp.live.runtime) {
    setNodeGraphWireConnectEventPulse(
      nodeGraphMvp.live.runtime,
      nodeGraphMvp.live.context?.sampleRate || nodeGraphMvp.sampleRate,
    );
  }
  if (nodeGraphMvp.live.usesWorklet && nodeGraphMvp.live.node?.port) {
    nodeGraphMvp.live.node.port.postMessage({
      reason: String(reason || "").slice(0, 120),
      type: "wireConnectEvent",
    });
  }
  window.dispatchEvent(new CustomEvent("nodeGraphWireConnectEvent", {
    detail: { reason: String(reason || "") },
  }));
  return true;
}

function triggerNodeGraphWireConnectEvent(reason = "") {
  return scheduleNodeGraphLiveGameTriggerEvent(sendNodeGraphLiveWireConnectEvent, reason);
}

function setNodeGraphWireDisconnectEventPulse(target, sampleRate) {
  if (!target || typeof target !== "object") {
    return false;
  }
  const event = target.wireDisconnectEvent && typeof target.wireDisconnectEvent === "object"
    ? target.wireDisconnectEvent
    : { pulseSamples: 0 };
  event.pulseSamples = Math.max(Number(event.pulseSamples) || 0, nodeGraphGameTriggerPulseSamples(sampleRate));
  target.wireDisconnectEvent = event;
  return true;
}

function sendNodeGraphLiveWireDisconnectEvent(reason = "") {
  if (nodeGraphMvp.live.runtime) {
    setNodeGraphWireDisconnectEventPulse(
      nodeGraphMvp.live.runtime,
      nodeGraphMvp.live.context?.sampleRate || nodeGraphMvp.sampleRate,
    );
  }
  if (nodeGraphMvp.live.usesWorklet && nodeGraphMvp.live.node?.port) {
    nodeGraphMvp.live.node.port.postMessage({
      reason: String(reason || "").slice(0, 120),
      type: "wireDisconnectEvent",
    });
  }
  window.dispatchEvent(new CustomEvent("nodeGraphWireDisconnectEvent", {
    detail: { reason: String(reason || "") },
  }));
  return true;
}

function triggerNodeGraphWireDisconnectEvent(reason = "") {
  return scheduleNodeGraphLiveGameTriggerEvent(sendNodeGraphLiveWireDisconnectEvent, reason);
}

function nodeGraphWindowReopenGateSamples(sampleRate = nodeGraphMvp?.sampleRate || 44100) {
  return Math.max(1, Math.round(Math.max(1, Number(sampleRate) || 44100) * nodeGraphWindowReopenGateSeconds));
}

function setNodeGraphWindowReopenEventPulse(target, sampleRate) {
  if (!target || typeof target !== "object") {
    return false;
  }
  const samples = nodeGraphWindowReopenGateSamples(sampleRate);
  target.windowReopenEvent = {
    gateSamples: samples,
    pulseSamples: nodeGraphGameTriggerPulseSamples(sampleRate),
    totalSamples: samples,
  };
  return true;
}

function sendNodeGraphLiveWindowReopenEvent(reason = "") {
  if (nodeGraphMvp.live.runtime) {
    setNodeGraphWindowReopenEventPulse(
      nodeGraphMvp.live.runtime,
      nodeGraphMvp.live.context?.sampleRate || nodeGraphMvp.sampleRate,
    );
  }
  if (nodeGraphMvp.live.usesWorklet && nodeGraphMvp.live.node?.port) {
    nodeGraphMvp.live.node.port.postMessage({
      reason: String(reason || "").slice(0, 120),
      type: "windowReopenEvent",
    });
  }
  window.dispatchEvent(new CustomEvent("nodeGraphWindowReopenEvent", {
    detail: { reason: String(reason || "") },
  }));
  return true;
}

function triggerNodeGraphWindowReopenEvent(reason = "") {
  return scheduleNodeGraphLiveGameTriggerEvent(sendNodeGraphLiveWindowReopenEvent, reason);
}

window.soemdspSandboxTriggerButtonEvent = triggerNodeGraphExternalButtonEvent;
window.soemdspSandboxTriggerWireBreakEvent = triggerNodeGraphWireBreakEvent;
window.soemdspSandboxTriggerWireConnectEvent = triggerNodeGraphWireConnectEvent;
window.soemdspSandboxTriggerWireDisconnectEvent = triggerNodeGraphWireDisconnectEvent;
window.soemdspSandboxTriggerWindowReopenEvent = triggerNodeGraphWindowReopenEvent;

function nodeGraphAcceptFileGridSelection(rows, options = {}) {
  const list = Array.isArray(rows) ? rows : [rows].filter(Boolean);
  const normalizedResources = list
    .map((row) => typeof normalizeNodeGraphFileGridResourceRow === "function"
      ? normalizeNodeGraphFileGridResourceRow(row)
      : null)
    .filter(Boolean);
  if (typeof registerNodeGraphResources === "function") {
    registerNodeGraphResources(normalizedResources);
  }
  nodeGraphMvp.pendingFileGridResources = normalizedResources;
  const audioResource = normalizedResources.find((resource) => resource.kind === "audio") || null;
  const targetNodeId = typeof nodeGraphAudioPlayerTargetNodeId === "function"
    ? nodeGraphAudioPlayerTargetNodeId(options)
    : "";
  if (audioResource && targetNodeId && typeof nodeGraphSetAudioPlayerResource === "function") {
    const result = nodeGraphSetAudioPlayerResource(targetNodeId, audioResource, {
      record: options.record !== false,
    });
    if (result.ok) {
      setNodeInteractionHelp(`File Grid audio assigned to ${targetNodeId}`);
    } else {
      setNodeInteractionHelp(result.reason || "File Grid audio could not be assigned");
    }
    return {
      ...result,
      resources: normalizedResources,
      targetNodeId,
    };
  }
  const message = audioResource
    ? "File Grid audio registered; select a Music Player to bind it"
    : `File Grid resources registered (${normalizedResources.length})`;
  setNodeInteractionHelp(message);
  return {
    ok: true,
    resources: normalizedResources,
    targetNodeId,
  };
}

window.nodeGraphAcceptFileGridSelection = nodeGraphAcceptFileGridSelection;
window.soemdspSandboxAcceptFileGridSelection = nodeGraphAcceptFileGridSelection;

window.addEventListener("message", (event) => {
  const message = event.data && typeof event.data === "object" ? event.data : null;
  if (!message) {
    return;
  }
  if (message.type === "soemdsp-sandbox-button-event") {
    triggerNodeGraphExternalButtonEvent(message.name || message.event, {
      buttonId: message.buttonId || "",
      label: message.label || "",
      source: message.source || "external-page",
    });
  } else if (message.type === "soemdsp-sandbox-file-grid-selection") {
    nodeGraphAcceptFileGridSelection(message.rows || message.resources || message.resource || message.row, {
      audioPlayerNodeId: message.audioPlayerNodeId || "",
      nodeId: message.nodeId || "",
      record: message.record !== false,
      source: message.source || "file-grid",
      targetNodeId: message.targetNodeId || "",
    });
  }
});
