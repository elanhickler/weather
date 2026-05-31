function clampNodeGraphRenderSeconds(value) {
  const seconds = Number(value);
  return Number.isFinite(seconds)
    ? Math.max(0.05, Math.min(60, seconds))
    : 2;
}

function syncNodeGraphRenderSecondsFromInput(options = {}) {
  const input = document.getElementById("nodeRenderSecondsValue");
  if (!input) {
    return nodeGraphMvp.seconds;
  }
  const seconds = clampNodeGraphRenderSeconds(input.value);
  nodeGraphMvp.seconds = seconds;
  if (String(input.value).trim() === "" || options.normalize) {
    input.value = formatNodeSliderCompactNumber(seconds);
  }
  return seconds;
}

function handleNodeGraphRenderSecondsInput(event) {
  syncNodeGraphRenderSecondsFromInput();
  markNodeGraphRenderPending(`Render length set to ${formatNodeSliderCompactNumber(nodeGraphMvp.seconds)} seconds.`);
  scheduleNodeGraphLiveParameterSync();
  event.stopPropagation();
}
