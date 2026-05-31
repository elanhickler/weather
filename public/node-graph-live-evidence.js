function setNodeGraphLiveEvidence(kind = "idle", details = {}) {
  const planEvidence = nodeGraphMvp.live.planEvidence || {};
  const patchFingerprint = String(details.patchFingerprint || "");
  const currentPatchFingerprint = nodeGraphPatchFingerprint();
  nodeGraphMvp.live.lastEvidence = {
    active: Boolean(nodeGraphMvp.live.node || nodeGraphMvp.live.context),
    connectionCount: Number(details.connectionCount ?? planEvidence.connectionCount) || 0,
    currentPatchFingerprint,
    engine: nodeGraphMvp.live.usesWorklet ? "worklet" : nodeGraphMvp.live.runtime ? "fallback" : "idle",
    feedbackConnectionCount: Number(details.feedbackConnectionCount ?? planEvidence.feedbackConnectionCount) || 0,
    feedbackModulationCount: Number(details.feedbackModulationCount ?? planEvidence.feedbackModulationCount) || 0,
    feedbackModulations: [
      ...(details.feedbackModulations || planEvidence.feedbackModulations || []),
    ],
    feedbackSignals: [
      ...(details.feedbackSignals || planEvidence.feedbackSignals || []),
    ],
    kind,
    matchesCurrentPatch: patchFingerprint ? patchFingerprint === currentPatchFingerprint : false,
    message: String(details.message || ""),
    modulationCount: Number(details.modulationCount ?? planEvidence.modulationCount) || 0,
    nodeCount: Number(details.nodeCount ?? planEvidence.nodeCount) || 0,
    parameterCount: Number(details.parameterCount) || 0,
    patchFingerprint,
    planSerial: Number(details.planSerial) || nodeGraphMvp.live.planSerial || 0,
    sessionId: nodeGraphMvp.live.sessionId,
    stateReadCount: Number(details.stateReadCount ?? planEvidence.stateReadCount) || 0,
  };
}

function setNodeGraphLiveBlockedError(kind, error, options = {}) {
  const message = error?.message || "unknown issue";
  setNodeGraphLiveEvidence(`${kind}-blocked`, {
    message,
    patchFingerprint: nodeGraphPatchFingerprint(),
  });
  setNodeGraphLivePlanStatus(nodeGraphLiveBlockedStatusText(kind, error), "warn");
  setNodeGraphLivePlanTitle(message);
  setNodeGraphLiveInputMeter();
  setNodeGraphLiveMeter();
  if (options.schedule !== false) {
    setNodeGraphLiveScheduleStatus(`schedule blocked: ${message}`, "warn");
  }
  setNodeGraphLiveStatus("error", "warn");
  document.getElementById("nodeLiveStatus").title = message;
  renderNodeGraphLiveControls(Boolean(nodeGraphMvp.live.node));
}
