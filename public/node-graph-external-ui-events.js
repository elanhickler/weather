const nodeGraphExternalButtonEventNames = Object.freeze(["click", "hover", "down", "up", "enter", "leave"]);

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

window.soemdspSandboxTriggerButtonEvent = triggerNodeGraphExternalButtonEvent;

window.addEventListener("message", (event) => {
  const message = event.data && typeof event.data === "object" ? event.data : null;
  if (!message || message.type !== "soemdsp-sandbox-button-event") {
    return;
  }
  triggerNodeGraphExternalButtonEvent(message.name || message.event, {
    buttonId: message.buttonId || "",
    label: message.label || "",
    source: message.source || "external-page",
  });
});
