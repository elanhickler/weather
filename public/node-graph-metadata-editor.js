function readNodeMetadataEditorValues(slider) {
  const current = nodeSliderMetadata(slider);
  let min = parseNodeMetadataNumber(document.getElementById("metadataMinValue").value, current.min);
  let max = parseNodeMetadataNumber(document.getElementById("metadataMaxValue").value, current.max);
  if (min > max) {
    [min, max] = [max, min];
  }
  const stepInput = document.getElementById("metadataStepValue").value.trim();
  return {
    def: parseNodeMetadataNumber(document.getElementById("metadataDefaultValue").value, current.def),
    kind: normalizeNodeMetadataKind(document.getElementById("metadataKindValue").value),
    max,
    mid: parseNodeMetadataNumber(document.getElementById("metadataMidValue").value, current.mid),
    min,
    choices: parseNodeMetadataChoices(document.getElementById("metadataChoicesValue").value),
    displayChoices: document.getElementById("metadataDisplayChoicesValue").checked,
    divideChoicesVisibly: document.getElementById("metadataDivideChoicesValue").checked,
    linearSmoothing: document.getElementById("metadataLinearSmoothingValue").checked,
    nonlinearSlider: document.getElementById("metadataNonlinearSliderValue").checked,
    step: stepInput.toLowerCase() === "any"
      ? 0
      : Math.max(0, parseNodeMetadataNumber(stepInput, current.step)),
    showSign: document.getElementById("metadataShowSignValue").checked,
    wraparound: document.getElementById("metadataWraparoundValue").checked,
    unit: document.getElementById("metadataUnitValue").value.trim(),
  };
}

function applyNodeMetadataEditor() {
  const slider = document.getElementById(nodeGraphMvp.metadataEditorTarget);
  if (!slider) {
    return;
  }

  setNodeSliderMetadata(slider, readNodeMetadataEditorValues(slider));
  syncNodeGraphPatchMetadataFromSlider(slider, {
    status: "metadata synced",
  });
  markNodeGraphRenderPending();
}

function setNodeMetadataDefaultsFromKind() {
  const slider = document.getElementById(nodeGraphMvp.metadataEditorTarget);
  if (!slider) {
    return;
  }
  const kind = normalizeNodeMetadataKind(document.getElementById("metadataKindValue").value);
  const template = nodeMetadataKindTemplates[kind] || nodeMetadataKindTemplates.decimal;
  const choices = template.choices || [];
  if (Number.isFinite(Number(template.min))) {
    document.getElementById("metadataMinValue").value = String(template.min);
  }
  if (Number.isFinite(Number(template.mid))) {
    document.getElementById("metadataMidValue").value = String(template.mid);
  }
  if (Number.isFinite(Number(template.max))) {
    document.getElementById("metadataMaxValue").value = String(template.max);
  }
  document.getElementById("metadataUnitValue").value = template.unit;
  document.getElementById("metadataChoicesValue").value = formatNodeMetadataChoices(choices);
  document.getElementById("metadataDisplayChoicesValue").checked = Boolean(template.displayChoices);
  document.getElementById("metadataDivideChoicesValue").checked = Boolean(template.divideChoicesVisibly);
  document.getElementById("metadataLinearSmoothingValue").checked = template.linearSmoothing !== false;
  document.getElementById("metadataNonlinearSliderValue").checked = Boolean(template.nonlinearSlider);
  document.getElementById("metadataShowSignValue").checked = Boolean(template.showPlusMinus);
  document.getElementById("metadataWraparoundValue").checked = Boolean(template.wraparound);
  syncNodeMetadataMidVisibility();
  applyNodeMetadataEditor();
  document.getElementById("metadataSetDefaultButton").classList.remove("armed");
}

function handleNodeMetadataKindChange() {
  applyNodeMetadataEditor();
  document.getElementById("metadataSetDefaultButton").classList.add("armed");
}

function handleNodeMetadataEditorInput() {
  if (!nodeGraphMvp.metadataEditorTarget) {
    return;
  }
  syncNodeMetadataMidVisibility();
  applyNodeMetadataEditor();
}
