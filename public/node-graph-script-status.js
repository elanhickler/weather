function setNodeGraphScriptStatus(message, ok = true) {
  const status = document.getElementById("nodeScriptStatus");
  if (!status) {
    return;
  }
  status.textContent = message;
  status.className = `pill ${ok ? "good" : "warn"}`;
}

function syncNodeGraphScriptView(message = "script synced", ok = true) {
  const script = document.getElementById("nodePatchScript");
  if (script && document.activeElement !== script) {
    script.value = serializeNodeGraphPatch();
    nodeGraphMvp.scriptDirty = false;
  }
  setNodeGraphScriptStatus(message, ok);
}

function nodeGraphPatchScriptStatus(message = "script synced", ok = true) {
  if (!ok) {
    return { message, ok };
  }
  const plan = compileNodeGraphExecutionPlan();
  return plan.valid
    ? { message, ok: true }
    : { message: `${message}; schedule blocked`, ok: false };
}
