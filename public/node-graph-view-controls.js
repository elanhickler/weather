function renderNodeGraphHistoryControls() {
  const undo = document.getElementById("nodeUndoButton");
  const redo = document.getElementById("nodeRedoButton");
  if (!undo || !redo) {
    return;
  }
  const canUndo = nodeGraphMvp.historyIndex > 0;
  const canRedo = nodeGraphMvp.historyIndex < nodeGraphMvp.historySnapshots.length - 1;
  undo.disabled = !canUndo;
  redo.disabled = !canRedo;
  undo.title = nodeGraphTooltipText(canUndo ? "history.undo" : "history.undoUnavailable");
  redo.title = nodeGraphTooltipText(canRedo ? "history.redo" : "history.redoUnavailable");
}

function renderNodeGraphGridToggle() {
  const workspace = document.getElementById("nodeGraphWorkspace");
  const button = document.getElementById("nodeGridToggleButton");
  const visible = Boolean(nodeGraphMvp.gridVisible);
  workspace?.classList.toggle("grid-visible", visible);
  if (button) {
    button.textContent = visible ? "Hide Grid" : "Show Grid";
    button.setAttribute("aria-pressed", visible ? "true" : "false");
    button.title = nodeGraphTooltipText(visible ? "view.gridHide" : "view.gridShow");
  }
  syncNodeUserUiSettingsViewControls();
}

function renderNodeGraphSliderTextToggles() {
  const workspace = document.getElementById("nodeGraphWorkspace");
  const labelsButton = document.getElementById("nodeSliderLabelsToggleButton");
  const valuesButton = document.getElementById("nodeSliderValuesToggleButton");
  const handlesButton = document.getElementById("nodeSliderHandlesToggleButton");
  const labelsVisible = Boolean(nodeGraphMvp.sliderLabelsVisible);
  const valuesVisible = Boolean(nodeGraphMvp.sliderValuesVisible);
  const handlesVisible = Boolean(nodeGraphMvp.sliderHandlesVisible);
  workspace?.classList.toggle("hide-slider-labels", !labelsVisible);
  workspace?.classList.toggle("hide-slider-values", !valuesVisible);
  workspace?.classList.toggle("hide-slider-handles", !handlesVisible);
  if (labelsButton) {
    labelsButton.textContent = labelsVisible ? "Hide Labels" : "Show Labels";
    labelsButton.setAttribute("aria-pressed", labelsVisible ? "true" : "false");
    labelsButton.title = nodeGraphTooltipText(labelsVisible ? "view.sliderLabelsHide" : "view.sliderLabelsShow");
  }
  if (valuesButton) {
    valuesButton.textContent = valuesVisible ? "Hide Values" : "Show Values";
    valuesButton.setAttribute("aria-pressed", valuesVisible ? "true" : "false");
    valuesButton.title = nodeGraphTooltipText(valuesVisible ? "view.sliderValuesHide" : "view.sliderValuesShow");
  }
  if (handlesButton) {
    handlesButton.textContent = handlesVisible ? "Hide Slider" : "Show Slider";
    handlesButton.setAttribute("aria-pressed", handlesVisible ? "true" : "false");
    handlesButton.title = nodeGraphTooltipText(handlesVisible ? "view.sliderHandlesHide" : "view.sliderHandlesShow");
  }
}

function renderNodeGraphTooltipToggle() {
  const helpStack = document.querySelector(".node-help-stack");
  const help = document.getElementById("nodeInteractionHelp");
  const button = document.getElementById("nodeTooltipToggleButton");
  const visible = Boolean(nodeGraphMvp.tooltipVisible);
  helpStack?.classList.toggle("tips-hidden", !visible);
  if (!visible && help) {
    help.textContent = "";
  }
  if (button) {
    button.textContent = visible ? "Hide Tips" : "Show Tips";
    button.setAttribute("aria-pressed", visible ? "true" : "false");
    button.title = nodeGraphTooltipText(visible ? "view.tipsHide" : "view.tipsShow");
  }
}

function toggleNodeGraphGridVisibility() {
  nodeGraphMvp.gridVisible = !nodeGraphMvp.gridVisible;
  renderNodeGraphGridToggle();
}

function toggleNodeGraphTooltipVisibility() {
  nodeGraphMvp.tooltipVisible = !nodeGraphMvp.tooltipVisible;
  renderNodeGraphTooltipToggle();
}

function toggleNodeGraphSliderLabels() {
  nodeGraphMvp.sliderLabelsVisible = !nodeGraphMvp.sliderLabelsVisible;
  renderNodeGraphSliderTextToggles();
}

function toggleNodeGraphSliderValues() {
  nodeGraphMvp.sliderValuesVisible = !nodeGraphMvp.sliderValuesVisible;
  renderNodeGraphSliderTextToggles();
}

function toggleNodeGraphSliderHandles() {
  nodeGraphMvp.sliderHandlesVisible = !nodeGraphMvp.sliderHandlesVisible;
  renderNodeGraphSliderTextToggles();
}
