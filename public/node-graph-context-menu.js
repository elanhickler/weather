function closeNodeSceneContextMenu() {
  const menu = document.getElementById("nodeSceneContextMenu");
  menu.hidden = true;
  if (nodeGraphMvp.moduleActionDragging?.handle) {
    nodeGraphMvp.moduleActionDragging.handle.classList.remove("dragging");
  }
  nodeGraphMvp.moduleActionDragging = null;
  nodeGraphMvp.sceneContextPoint = null;
  nodeGraphMvp.sceneContextTargetNode = null;
  nodeGraphMvp.sceneContextTargetWire = null;
}

function positionNodeSceneContextMenu(menu, x, y, remember = false) {
  const margin = 12;
  menu.hidden = false;
  const rect = menu.getBoundingClientRect();
  const left = Math.max(margin, Math.min(window.innerWidth - rect.width - margin, x));
  const top = Math.max(margin, Math.min(window.innerHeight - rect.height - margin, y));
  menu.style.left = `${left}px`;
  menu.style.top = `${top}px`;
  if (remember) {
    nodeGraphMvp.moduleActionWindowPosition = { left, top };
    syncNodeGraphPatchWindowPosition("moduleActions", { left, top });
  }
}

function positionNodeSceneContextMenuAtSavedOr(menu, x, y) {
  const savedPosition = nodeGraphMvp.moduleActionWindowPosition;
  const hasSavedPosition =
    Number.isFinite(Number(savedPosition?.left)) &&
    Number.isFinite(Number(savedPosition?.top));
  positionNodeSceneContextMenu(
    menu,
    hasSavedPosition ? savedPosition.left : x,
    hasSavedPosition ? savedPosition.top : y,
    !hasSavedPosition,
  );
}

function beginNodeSceneContextMenuDrag(event) {
  if (event.button > 0) {
    return;
  }

  const menu = document.getElementById("nodeSceneContextMenu");
  if (menu.hidden) {
    return;
  }

  const rect = menu.getBoundingClientRect();
  nodeGraphMvp.moduleActionDragging = {
    handle: event.currentTarget,
    offsetX: event.clientX - rect.left,
    offsetY: event.clientY - rect.top,
    pointerId: event.pointerId ?? null,
  };
  event.currentTarget.classList.add("dragging");
  if (event.pointerId !== undefined) {
    event.currentTarget.setPointerCapture(event.pointerId);
  }
  event.preventDefault();
}

function dragNodeSceneContextMenu(event) {
  const drag = nodeGraphMvp.moduleActionDragging;
  if (
    !drag ||
    (drag.pointerId !== null && event.pointerId !== undefined && drag.pointerId !== event.pointerId)
  ) {
    return;
  }

  positionNodeSceneContextMenu(
    document.getElementById("nodeSceneContextMenu"),
    event.clientX - drag.offsetX,
    event.clientY - drag.offsetY,
    true,
  );
  event.preventDefault();
}

function endNodeSceneContextMenuDrag(event) {
  const drag = nodeGraphMvp.moduleActionDragging;
  if (
    !drag ||
    (drag.pointerId !== null && event.pointerId !== undefined && drag.pointerId !== event.pointerId)
  ) {
    return;
  }

  drag.handle.classList.remove("dragging");
  if (event.pointerId !== undefined && drag.handle.hasPointerCapture?.(event.pointerId)) {
    drag.handle.releasePointerCapture(event.pointerId);
  }
  nodeGraphMvp.moduleActionDragging = null;
}

function configureNodeSceneContextMenu(mode) {
  const menu = document.getElementById("nodeSceneContextMenu");
  const title = menu.querySelector(".scene-context-title");
  const addGroup = menu.querySelector(".scene-context-add-group");
  const copyButton = document.getElementById("nodeSceneCopyModule");
  const deleteButton = document.getElementById("nodeSceneDeleteModule");
  const closeButton = document.getElementById("nodeSceneCloseMenu");
  const selectedModule = document.getElementById("nodeSceneSelectedModule");
  const wireTypeControl = document.getElementById("nodeSceneWireTypeControl");
  const wireTypeButtons = [...wireTypeControl.querySelectorAll("[data-wire-type]")];
  const aliasControl = document.getElementById("nodeSceneAliasControl");
  const aliasInput = document.getElementById("nodeSceneAliasInput");
  const widthControls = document.getElementById("nodeSceneWidthControls");
  const widthDecrease = document.getElementById("nodeSceneWidthDecrease");
  const widthIncrease = document.getElementById("nodeSceneWidthIncrease");
  const widthValue = document.getElementById("nodeSceneWidthValue");
  const textBoxHeightControls = document.getElementById("nodeSceneTextBoxHeightControls");
  const textBoxHeightDecrease = document.getElementById("nodeSceneTextBoxHeightDecrease");
  const textBoxHeightIncrease = document.getElementById("nodeSceneTextBoxHeightIncrease");
  const textBoxHeightValue = document.getElementById("nodeSceneTextBoxHeightValue");
  const textBoxTextSizeControls = document.getElementById("nodeSceneTextBoxTextSizeControls");
  const textBoxTextSizeDecrease = document.getElementById("nodeSceneTextBoxTextSizeDecrease");
  const textBoxTextSizeIncrease = document.getElementById("nodeSceneTextBoxTextSizeIncrease");
  const textBoxTextSizeValue = document.getElementById("nodeSceneTextBoxTextSizeValue");
  const textBoxTextControls = document.getElementById("nodeSceneTextBoxTextControls");
  const textBoxTextInput = document.getElementById("nodeSceneTextBoxTextInput");
  const toggleButtonsButton = document.getElementById("nodeSceneToggleButtons");
  const toggleTitleButton = document.getElementById("nodeSceneToggleTitle");
  const textBoxControls = document.getElementById("nodeSceneTextBoxControls");
  const textBoxSingleLine = document.getElementById("nodeSceneTextBoxSingleLine");
  const textBoxMultiline = document.getElementById("nodeSceneTextBoxMultiline");
  const textBoxHorizontalAlignControls = document.getElementById("nodeSceneTextBoxHorizontalAlignControls");
  const textBoxAlignLeft = document.getElementById("nodeSceneTextBoxAlignLeft");
  const textBoxAlignCenter = document.getElementById("nodeSceneTextBoxAlignCenter");
  const textBoxAlignRight = document.getElementById("nodeSceneTextBoxAlignRight");
  const textBoxVerticalAlignControls = document.getElementById("nodeSceneTextBoxVerticalAlignControls");
  const textBoxVerticalAlign = document.getElementById("nodeSceneTextBoxVerticalAlign");
  const textBoxVerticalAlignValue = document.getElementById("nodeSceneTextBoxVerticalAlignValue");
  const moduleMode = mode === "module";
  const wireMode = mode === "wire";
  menu.dataset.mode = mode;
  const targetNodeId = moduleMode ? nodeGraphModuleActionTargetNodeId() : null;
  if (targetNodeId) {
    nodeGraphMvp.sceneContextTargetNode = targetNodeId;
  }
  const targetNode = targetNodeId ? nodeGraphPatchNode(targetNodeId) : null;
  const selectedNodeIds = nodeGraphSelectedNodeIds();
  const selectedWire = wireMode ? nodeGraphWireFromSelection(nodeGraphMvp.selected) : null;
  const canDelete = wireMode
    ? Boolean(selectedWire)
    : moduleMode && (
      targetNode
        ? nodeGraphNodeCanBeDeleted(targetNode)
        : [...selectedNodeIds].some((id) => {
          const node = nodeGraphPatchNode(id);
          return nodeGraphMvp.activeNodes.has(id) && nodeGraphNodeCanBeDeleted(node);
        })
    );
  const canCopy = moduleMode && targetNode?.type !== "output";
  const widthGu = targetNode ? nodeGraphPatchNodeGridWidthUnits(targetNode) : 0;
  const heightGu = targetNode ? nodeGraphPatchNodeGridHeightUnits(targetNode) : 0;
  const targetNodeUi = normalizeNodeGraphPatchNodeUi(targetNode?.ui);
  const buttonsHidden = targetNodeUi.buttonsHidden;
  const titleHidden = targetNodeUi.titleHidden;
  const textBoxLayout = normalizeNodeGraphTextBoxLayout(targetNode?.layout);
  const textBoxMode = textBoxLayout.textMode;
  title.textContent = wireMode ? "WIRE ACTIONS" : moduleMode ? "ACTIONS" : "circuits:";
  menu.setAttribute("aria-label", wireMode ? "Wire actions" : moduleMode ? "Module actions" : "Add module");
  addGroup.hidden = moduleMode || wireMode;
  copyButton.hidden = !moduleMode;
  deleteButton.hidden = !(moduleMode || wireMode);
  selectedModule.hidden = !(moduleMode || wireMode);
  wireTypeControl.hidden = !wireMode;
  aliasControl.hidden = !moduleMode;
  widthControls.hidden = !moduleMode;
  textBoxHeightControls.hidden = !(moduleMode && targetNode?.type === "textBox");
  textBoxTextSizeControls.hidden = !(moduleMode && targetNode?.type === "textBox");
  textBoxTextControls.hidden = !(moduleMode && targetNode?.type === "textBox");
  toggleButtonsButton.hidden = !moduleMode;
  toggleTitleButton.hidden = !moduleMode;
  textBoxControls.hidden = !(moduleMode && targetNode?.type === "textBox");
  textBoxHorizontalAlignControls.hidden = !(moduleMode && targetNode?.type === "textBox");
  textBoxVerticalAlignControls.hidden = !(moduleMode && targetNode?.type === "textBox");
  closeButton.hidden = false;
  if (moduleMode) {
    selectedModule.querySelector("span").textContent = selectedNodeIds.size > 1 ? "selected modules" : "selected module";
    selectedModule.querySelector("strong").textContent = targetNode
      ? `${nodeGraphNodeDisplayName(targetNode.id)} (${targetNode.id})`
      : selectedNodeIds.size > 1
        ? `${selectedNodeIds.size} modules`
        : "none";
    aliasInput.disabled = !targetNode;
    aliasInput.value = targetNode ? normalizeNodeGraphPatchNodeAlias(targetNode.alias) : "";
    aliasInput.placeholder = targetNode ? nodeGraphDefaultNodeTitle(targetNode.type, targetNode.id) : "module title alias";
    aliasInput.title = nodeGraphTooltipText("actions.moduleAlias");
    copyButton.disabled = !canCopy;
    copyButton.title = canCopy
      ? nodeGraphTooltipText("actions.copyModule")
      : targetNode
        ? nodeGraphTooltipText("actions.copyUnavailableOutput")
        : nodeGraphTooltipText("actions.copyUnavailableOneModule");
    deleteButton.disabled = !canDelete;
    deleteButton.title = canDelete
      ? nodeGraphTooltipText("actions.deleteModule")
      : targetNode
        ? nodeGraphTooltipText("actions.deleteUnavailableOutput")
        : nodeGraphTooltipText("actions.deleteUnavailableOneModule");
    widthValue.textContent = `${widthGu} gu`;
    widthDecrease.disabled = !targetNode || widthGu <= nodeGraphModuleWidthLimits.minGu;
    widthDecrease.title = nodeGraphTooltipText("actions.widthDecrease");
    widthIncrease.disabled = !targetNode || widthGu >= nodeGraphModuleWidthLimits.maxGu;
    widthIncrease.title = nodeGraphTooltipText("actions.widthIncrease");
    textBoxHeightValue.textContent = `${heightGu} gu high`;
    textBoxHeightDecrease.disabled = !targetNode || targetNode.type !== "textBox" || heightGu <= nodeGraphTextBoxHeightLimits.minGu;
    textBoxHeightDecrease.title = nodeGraphTooltipText("actions.textBoxHeightDecrease");
    textBoxHeightIncrease.disabled = !targetNode || targetNode.type !== "textBox" || heightGu >= nodeGraphTextBoxHeightLimits.maxGu;
    textBoxHeightIncrease.title = nodeGraphTooltipText("actions.textBoxHeightIncrease");
    textBoxTextSizeValue.textContent = `${textBoxLayout.textSizePercent}% text`;
    textBoxTextSizeDecrease.disabled =
      !targetNode ||
      targetNode.type !== "textBox" ||
      textBoxLayout.textSizePercent <= nodeGraphTextBoxTextSizeLimits.minPercent;
    textBoxTextSizeDecrease.title = nodeGraphTooltipText("actions.textBoxTextSizeDecrease");
    textBoxTextSizeIncrease.disabled =
      !targetNode ||
      targetNode.type !== "textBox" ||
      textBoxLayout.textSizePercent >= nodeGraphTextBoxTextSizeLimits.maxPercent;
    textBoxTextSizeIncrease.title = nodeGraphTooltipText("actions.textBoxTextSizeIncrease");
    toggleButtonsButton.disabled = !targetNode;
    toggleButtonsButton.querySelector("span").textContent = buttonsHidden ? "Show buttons" : "Hide buttons";
    toggleButtonsButton.setAttribute("aria-pressed", buttonsHidden ? "true" : "false");
    toggleButtonsButton.title = nodeGraphTooltipText(buttonsHidden ? "actions.showModuleButtons" : "actions.hideModuleButtons");
    toggleTitleButton.disabled = !targetNode;
    toggleTitleButton.querySelector("span").textContent = titleHidden ? "Show title" : "Hide title";
    toggleTitleButton.setAttribute("aria-pressed", titleHidden ? "true" : "false");
    toggleTitleButton.title = nodeGraphTooltipText(titleHidden ? "actions.showModuleTitle" : "actions.hideModuleTitle");
    textBoxSingleLine.setAttribute("aria-pressed", textBoxMode === "singleLine" ? "true" : "false");
    textBoxMultiline.setAttribute("aria-pressed", textBoxMode === "multiline" ? "true" : "false");
    textBoxSingleLine.title = nodeGraphTooltipText("actions.textBoxSingleLine");
    textBoxMultiline.title = nodeGraphTooltipText("actions.textBoxMultiline");
    textBoxTextInput.disabled = !targetNode || targetNode.type !== "textBox";
    textBoxTextInput.value = targetNode?.type === "textBox" ? textBoxLayout.text : "";
    textBoxTextInput.title = nodeGraphTooltipText("actions.textBoxContent");
    textBoxAlignLeft.setAttribute("aria-pressed", textBoxLayout.horizontalAlign === "left" ? "true" : "false");
    textBoxAlignCenter.setAttribute("aria-pressed", textBoxLayout.horizontalAlign === "center" ? "true" : "false");
    textBoxAlignRight.setAttribute("aria-pressed", textBoxLayout.horizontalAlign === "right" ? "true" : "false");
    textBoxVerticalAlign.disabled = !targetNode || targetNode.type !== "textBox";
    textBoxVerticalAlign.value = String(textBoxLayout.verticalAlignPercent);
    textBoxVerticalAlignValue.textContent = `${textBoxLayout.verticalAlignPercent}%`;
    textBoxVerticalAlign.title = nodeGraphTooltipText("actions.textBoxVerticalPosition");
    textBoxAlignLeft.title = nodeGraphTooltipText("actions.textBoxAlignLeft");
    textBoxAlignCenter.title = nodeGraphTooltipText("actions.textBoxAlignCenter");
    textBoxAlignRight.title = nodeGraphTooltipText("actions.textBoxAlignRight");
  } else if (wireMode) {
    selectedModule.querySelector("span").textContent = selectedWire?.kind === "modulation"
      ? "selected modulation"
      : "selected wire";
    selectedModule.querySelector("strong").textContent = nodeGraphWireSelectionLabel(nodeGraphMvp.selected);
    const selectedWireType = normalizeNodeGraphWireType(selectedWire?.wire?.wireType);
    for (const button of wireTypeButtons) {
      button.disabled = !selectedWire;
      button.setAttribute("aria-pressed", button.dataset.wireType === selectedWireType ? "true" : "false");
      button.title = nodeGraphTooltipText(`actions.wireType.${button.dataset.wireType}`);
    }
    deleteButton.disabled = !canDelete;
    deleteButton.title = canDelete
      ? nodeGraphTooltipText("actions.deleteWire")
      : nodeGraphTooltipText("actions.deleteWireMissing");
    copyButton.disabled = true;
    copyButton.title = nodeGraphTooltipText("actions.copyUnavailableWire");
    widthValue.textContent = "";
    widthDecrease.disabled = true;
    widthIncrease.disabled = true;
    textBoxHeightValue.textContent = "";
    textBoxHeightDecrease.disabled = true;
    textBoxHeightIncrease.disabled = true;
    textBoxTextSizeValue.textContent = "";
    textBoxTextSizeDecrease.disabled = true;
    textBoxTextSizeIncrease.disabled = true;
    textBoxTextInput.value = "";
    textBoxTextInput.disabled = true;
    textBoxVerticalAlign.value = "50";
    textBoxVerticalAlignValue.textContent = "";
    textBoxVerticalAlign.disabled = true;
    toggleButtonsButton.disabled = true;
    toggleTitleButton.disabled = true;
  } else {
    selectedModule.querySelector("span").textContent = "selected";
    selectedModule.querySelector("strong").textContent = "none";
    for (const button of wireTypeButtons) {
      button.disabled = true;
      button.setAttribute("aria-pressed", "false");
    }
    copyButton.disabled = true;
    copyButton.title = nodeGraphTooltipText("actions.copyUnavailableModule");
    deleteButton.disabled = true;
    deleteButton.title = nodeGraphTooltipText("actions.deleteTitle");
    widthValue.textContent = "";
    widthDecrease.disabled = true;
    widthIncrease.disabled = true;
    textBoxHeightValue.textContent = "";
    textBoxHeightDecrease.disabled = true;
    textBoxHeightIncrease.disabled = true;
    textBoxTextSizeValue.textContent = "";
    textBoxTextSizeDecrease.disabled = true;
    textBoxTextSizeIncrease.disabled = true;
    textBoxTextInput.value = "";
    textBoxTextInput.disabled = true;
    textBoxVerticalAlign.value = "50";
    textBoxVerticalAlignValue.textContent = "";
    textBoxVerticalAlign.disabled = true;
    toggleButtonsButton.disabled = true;
    toggleTitleButton.disabled = true;
  }
}

function openNodeModuleActionMenu(event) {
  const button = event.currentTarget;
  const node = button.closest(".dsp-node");
  if (!node) {
    return;
  }

  nodeGraphMvp.sceneContextPoint = null;
  nodeGraphMvp.sceneContextTargetNode = node.dataset.node;
  nodeGraphMvp.sceneContextTargetWire = null;
  configureNodeSceneContextMenu("module");
  const rect = button.getBoundingClientRect();
  positionNodeSceneContextMenuAtSavedOr(
    document.getElementById("nodeSceneContextMenu"),
    rect.right,
    rect.bottom,
  );
  event.preventDefault();
  event.stopPropagation();
}

function openNodeSceneContextMenu(event) {
  const contextWire = event.target.closest?.(".node-wire-hit-path, .node-wire-path");
  if (contextWire) {
    const index = Number(contextWire.dataset.connectionIndex);
    const kind = contextWire.dataset.connectionKind || "signal";
    if (Number.isFinite(index)) {
      event.preventDefault();
      event.stopPropagation();
      setNodeGraphSelection({ type: "wire", kind, index });
      nodeGraphMvp.sceneContextPoint = null;
      nodeGraphMvp.sceneContextTargetNode = null;
      nodeGraphMvp.sceneContextTargetWire = { index, kind };
      configureNodeSceneContextMenu("wire");
      positionNodeSceneContextMenuAtSavedOr(
        document.getElementById("nodeSceneContextMenu"),
        event.clientX,
        event.clientY,
      );
    }
    return;
  }

  const contextNode = event.target.closest(".dsp-node");
  if (contextNode) {
    event.preventDefault();
    event.stopPropagation();
    nodeGraphMvp.sceneContextPoint = null;
    nodeGraphMvp.sceneContextTargetNode = contextNode.dataset.node;
    nodeGraphMvp.sceneContextTargetWire = null;
    configureNodeSceneContextMenu("module");
    positionNodeSceneContextMenuAtSavedOr(
      document.getElementById("nodeSceneContextMenu"),
      event.clientX,
      event.clientY,
    );
    return;
  }
  if (event.target.closest(".node-port, .node-param-port, .node-slider-readout")) {
    return;
  }

  event.preventDefault();
  event.stopPropagation();
  nodeGraphMvp.sceneContextPoint = nodeGraphClientPoint(event);
  nodeGraphMvp.sceneContextTargetNode = null;
  nodeGraphMvp.sceneContextTargetWire = null;
  configureNodeSceneContextMenu("add");
  positionNodeSceneContextMenuAtSavedOr(
    document.getElementById("nodeSceneContextMenu"),
    event.clientX,
    event.clientY,
  );
}
