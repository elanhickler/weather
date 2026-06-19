function closeNodeSceneContextMenu(options = {}) {
  const explicit =
    options === true ||
    options?.explicit === true ||
    options?.currentTarget?.id === "nodeSceneCloseMenu";
  if (!explicit) {
    return false;
  }
  const menu = document.getElementById("nodeSceneContextMenu");
  menu.hidden = true;
  if (nodeGraphMvp.sceneContextDragging?.handle) {
    nodeGraphMvp.sceneContextDragging.handle.classList.remove("dragging");
  }
  if (nodeGraphMvp.sceneContextResizing?.handle) {
    nodeGraphMvp.sceneContextResizing.handle.classList.remove("dragging");
  }
  nodeGraphMvp.sceneContextDragging = null;
  nodeGraphMvp.sceneContextResizing = null;
  nodeGraphMvp.sceneContextPoint = null;
  if (typeof rememberNodeGraphWorkspaceWindowState === "function") {
    rememberNodeGraphWorkspaceWindowState("commandCenter", menu, { open: false }, { status: false });
  }
  return true;
}

const nodeSceneContextWindowDefaultSize = Object.freeze({
  width: 215,
});

const nodeModuleActionsWindowDefaultSize = Object.freeze({
  width: 180,
});

function normalizeNodeGraphFloatingWindowSize(size = {}, defaults = {}) {
  const viewportWidth = window.innerWidth || document.documentElement.clientWidth || 720;
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 760;
  const minWidth = 160;
  const maxWidth = Math.max(minWidth, Math.min(720, viewportWidth - 28));
  const minHeight = 120;
  const maxHeight = Math.max(minHeight, Math.min(760, viewportHeight - 28));
  const source = size && typeof size === "object" ? size : {};
  const width = Math.max(
    minWidth,
    Math.min(maxWidth, Number(source.width) || Number(defaults.width) || minWidth),
  );
  const height = Number.isFinite(Number(source.height))
    ? Math.max(minHeight, Math.min(maxHeight, Number(source.height)))
    : null;
  return {
    width: Math.round(width),
    ...(height ? { height: Math.round(height) } : {}),
  };
}

function normalizeNodeSceneContextWindowSize(size = {}) {
  const normalized = normalizeNodeGraphFloatingWindowSize(size, nodeSceneContextWindowDefaultSize);
  return { width: normalized.width };
}

function normalizeNodeModuleActionsWindowSize(size = {}) {
  return normalizeNodeGraphFloatingWindowSize(size, nodeModuleActionsWindowDefaultSize);
}

function applyNodeSceneContextWindowSize(size = nodeGraphMvp.sceneContextWindowSize) {
  const menu = document.getElementById("nodeSceneContextMenu");
  const normalized = normalizeNodeSceneContextWindowSize(size || nodeSceneContextWindowDefaultSize);
  nodeGraphMvp.sceneContextWindowSize = normalized;
  if (!menu) {
    return normalized;
  }
  menu.style.setProperty("--node-scene-context-width", `${normalized.width}px`);
  menu.style.removeProperty("--node-scene-context-height");
  return normalized;
}

function applyNodeModuleActionsWindowSize(size = nodeGraphMvp.moduleActionWindowSize) {
  const menu = document.getElementById("nodeModuleActionsWindow");
  const normalized = normalizeNodeModuleActionsWindowSize(size || nodeModuleActionsWindowDefaultSize);
  nodeGraphMvp.moduleActionWindowSize = normalized;
  if (!menu) {
    return normalized;
  }
  menu.style.setProperty("--node-module-actions-width", `${normalized.width}px`);
  if (Number.isFinite(Number(normalized.height))) {
    menu.style.setProperty("--node-module-actions-height", `${normalized.height}px`);
  } else {
    menu.style.removeProperty("--node-module-actions-height");
  }
  return normalized;
}

function saveNodeSceneContextWindowSizeToUserSettings() {
  if (typeof saveNodeGraphWorkspaceWindowStatesToUserSettings === "function") {
    saveNodeGraphWorkspaceWindowStatesToUserSettings();
  }
}

function closeNodeModuleActionsWindow() {
  const menu = document.getElementById("nodeModuleActionsWindow");
  if (menu) {
    menu.hidden = true;
  }
  if (nodeGraphMvp.moduleActionDragging?.handle) {
    nodeGraphMvp.moduleActionDragging.handle.classList.remove("dragging");
  }
  if (nodeGraphMvp.moduleActionResizing?.handle) {
    nodeGraphMvp.moduleActionResizing.handle.classList.remove("dragging");
  }
  nodeGraphMvp.moduleActionDragging = null;
  nodeGraphMvp.moduleActionResizing = null;
  nodeGraphMvp.sceneContextTargetNode = null;
  nodeGraphMvp.sceneContextTargetWire = null;
  if (typeof rememberNodeGraphWorkspaceWindowState === "function") {
    rememberNodeGraphWorkspaceWindowState("moduleActions", menu, { open: false }, { status: false });
  }
}

function closeNodeScopeContextMenu() {
  const menu = document.getElementById("nodeScopeContextMenu");
  if (menu) {
    menu.hidden = true;
  }
  if (nodeGraphMvp.scopeContextDragging?.handle) {
    nodeGraphMvp.scopeContextDragging.handle.classList.remove("dragging");
  }
  nodeGraphMvp.scopeContextDragging = null;
  nodeGraphMvp.scopeContextTargetNode = null;
  renderNodeGraphSceneScopeControls();
}

function closeNodeGlobalScopeMenu() {
  const menu = document.getElementById("nodeGlobalScopeMenu");
  if (menu) {
    menu.hidden = true;
  }
  if (nodeGraphMvp.globalScopeDragging?.handle) {
    nodeGraphMvp.globalScopeDragging.handle.classList.remove("dragging");
  }
  nodeGraphMvp.globalScopeDragging = null;
  closeNodeScopeContextMenu();
  renderNodeGraphModuleScopeBrightnessControl();
  if (typeof rememberNodeGraphWorkspaceWindowState === "function") {
    rememberNodeGraphWorkspaceWindowState("oscilloscopeSettings", menu, { open: false }, { status: false });
  }
}

function positionNodeSceneContextMenu(menu, x, y, remember = false) {
  if (menu?.id === "nodeSceneContextMenu") {
    applyNodeSceneContextWindowSize();
  } else if (menu?.id === "nodeModuleActionsWindow") {
    applyNodeModuleActionsWindowSize();
  }
  const { left, top } = nodeGraphFloatingWindowPosition(menu, x, y);
  menu.style.left = `${left}px`;
  menu.style.top = `${top}px`;
  if (menu?.id === "nodeSceneContextMenu") {
    if (typeof rememberNodeGraphWorkspaceWindowState === "function") {
      rememberNodeGraphWorkspaceWindowState("commandCenter", menu, { open: !menu.hidden, position: { left, top } }, { persist: false });
    }
  } else if (menu?.id === "nodeModuleActionsWindow") {
    if (typeof rememberNodeGraphWorkspaceWindowState === "function") {
      rememberNodeGraphWorkspaceWindowState("moduleActions", menu, { open: !menu.hidden, position: { left, top } }, { persist: false });
    }
  } else if (menu?.id === "nodeGlobalScopeMenu") {
    if (typeof rememberNodeGraphWorkspaceWindowState === "function") {
      rememberNodeGraphWorkspaceWindowState("oscilloscopeSettings", menu, { open: !menu.hidden, position: { left, top } }, { persist: false });
    }
  }
  if (remember) {
    nodeGraphMvp.moduleActionWindowPosition = { left, top };
    syncNodeGraphPatchWindowPosition("moduleActions", { left, top });
  }
}

function positionNodeSceneContextMenuHeaderAtPoint(menu, x, y, remember = false) {
  if (!menu) {
    return;
  }
  menu.hidden = false;
  const menuRect = menu.getBoundingClientRect();
  const headingRect = menu.querySelector(".scene-context-heading")?.getBoundingClientRect();
  positionNodeSceneContextMenu(
    menu,
    (Number(x) || 0) - (menuRect.width * 0.5),
    (Number(y) || 0) - ((headingRect?.height || 42) * 0.5),
    remember,
  );
}

function positionNodeSceneContextMenuAtCurrentSavedOrInitial(menu, x, y) {
  if (!menu) {
    return;
  }
  applyNodeSceneContextWindowSize();
  if (!menu.hidden) {
    const rect = menu.getBoundingClientRect();
    positionNodeSceneContextMenu(menu, rect.left, rect.top, false);
    return;
  }
  const workspaceState = nodeGraphMvp.workspaceWindowStates?.commandCenter;
  const savedPosition = workspaceState?.position || nodeGraphMvp.moduleActionWindowPosition;
  const hasSavedPosition =
    Number.isFinite(Number(savedPosition?.left)) &&
    Number.isFinite(Number(savedPosition?.top));
  if (hasSavedPosition) {
    menu.hidden = false;
    positionNodeSceneContextMenu(menu, savedPosition.left, savedPosition.top, false);
    return;
  }
  positionNodeSceneContextMenuHeaderAtPoint(menu, x, y, true);
}

function positionNodeSceneContextMenuAtSavedOr(menu, x, y) {
  const workspaceState = nodeGraphMvp.workspaceWindowStates?.commandCenter;
  const savedPosition = workspaceState?.position || nodeGraphMvp.moduleActionWindowPosition;
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

function positionNodeModuleActionsWindowAtSavedOr(menu, x, y) {
  const workspaceState = nodeGraphMvp.workspaceWindowStates?.moduleActions;
  const savedPosition = workspaceState?.position || nodeGraphMvp.moduleActionWindowPosition;
  const hasSavedPosition =
    Number.isFinite(Number(savedPosition?.left)) &&
    Number.isFinite(Number(savedPosition?.top));
  positionNodeSceneContextMenu(
    menu,
    hasSavedPosition ? savedPosition.left : x,
    hasSavedPosition ? savedPosition.top : y,
    true,
  );
}

function positionNodeScopeContextMenuAtSavedOr(menu, x, y) {
  const savedPosition = nodeGraphMvp.scopeContextWindowPosition;
  const hasSavedPosition =
    Number.isFinite(Number(savedPosition?.left)) &&
    Number.isFinite(Number(savedPosition?.top));
  positionNodeSceneContextMenu(
    menu,
    hasSavedPosition ? savedPosition.left : x,
    hasSavedPosition ? savedPosition.top : y,
    false,
  );
  if (!hasSavedPosition) {
    nodeGraphMvp.scopeContextWindowPosition = {
      left: Number.parseFloat(menu.style.left) || menu.getBoundingClientRect().left,
      top: Number.parseFloat(menu.style.top) || menu.getBoundingClientRect().top,
    };
  }
}

function positionNodeGlobalScopeMenuAtSavedOr(menu, x, y) {
  const workspaceState = nodeGraphMvp.workspaceWindowStates?.oscilloscopeSettings;
  const savedPosition = workspaceState?.position || nodeGraphMvp.globalScopeWindowPosition;
  const hasSavedPosition =
    Number.isFinite(Number(savedPosition?.left)) &&
    Number.isFinite(Number(savedPosition?.top));
  positionNodeSceneContextMenu(
    menu,
    hasSavedPosition ? savedPosition.left : x,
    hasSavedPosition ? savedPosition.top : y,
    false,
  );
  if (!hasSavedPosition) {
    nodeGraphMvp.globalScopeWindowPosition = {
      left: Number.parseFloat(menu.style.left) || menu.getBoundingClientRect().left,
      top: Number.parseFloat(menu.style.top) || menu.getBoundingClientRect().top,
    };
  }
}

function openNodeGlobalScopeMenu() {
  const menu = document.getElementById("nodeGlobalScopeMenu");
  if (!menu) {
    return;
  }
  nodeGraphMvp.scopeContextTargetNode = null;
  const anchor = document.getElementById("nodeSceneOpenOscilloscopeSettings");
  const rect = anchor?.getBoundingClientRect?.() || {
    left: nodeGraphMvp.sceneContextPoint?.x ?? window.innerWidth * 0.5,
    bottom: nodeGraphMvp.sceneContextPoint?.y ?? window.innerHeight * 0.25,
  };
  positionNodeGlobalScopeMenuAtSavedOr(menu, rect.left, rect.bottom + 8);
  renderNodeGraphSceneScopeControls();
  renderNodeGraphModuleScopeBrightnessControl();
  if (typeof rememberNodeGraphWorkspaceWindowState === "function") {
    rememberNodeGraphWorkspaceWindowState("oscilloscopeSettings", menu, { open: true }, { status: false });
  }
}

function toggleNodeGlobalScopeMenu() {
  const menu = document.getElementById("nodeGlobalScopeMenu");
  if (!menu || menu.hidden) {
    openNodeGlobalScopeMenu();
  } else {
    closeNodeGlobalScopeMenu();
  }
}

function beginNodeSceneContextMenuDrag(event) {
  if (event.button > 0 || nodeGraphDialogDragTargetIsInteractive(event)) {
    return;
  }

  const menu = document.getElementById("nodeSceneContextMenu");
  if (menu.hidden) {
    return;
  }

  const rect = menu.getBoundingClientRect();
  nodeGraphMvp.sceneContextDragging = {
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
  const drag = nodeGraphMvp.sceneContextDragging;
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
    false,
  );
  event.preventDefault();
}

function endNodeSceneContextMenuDrag(event) {
  const drag = nodeGraphMvp.sceneContextDragging;
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
  nodeGraphMvp.sceneContextDragging = null;
  if (typeof rememberNodeGraphWorkspaceWindowState === "function") {
    rememberNodeGraphWorkspaceWindowState("commandCenter", document.getElementById("nodeSceneContextMenu"), { open: true }, { status: false });
  }
}

function beginNodeSceneContextMenuResize(event) {
  if (event.button > 0) {
    return;
  }
  const menu = document.getElementById("nodeSceneContextMenu");
  if (!menu || menu.hidden) {
    return;
  }
  const rect = menu.getBoundingClientRect();
  nodeGraphMvp.sceneContextResizing = {
    handle: event.currentTarget,
    pointerId: event.pointerId ?? null,
    startClientX: event.clientX,
    startWidth: rect.width,
  };
  event.currentTarget.classList.add("dragging");
  if (event.pointerId !== undefined) {
    event.currentTarget.setPointerCapture(event.pointerId);
  }
  event.preventDefault();
  event.stopPropagation();
}

function dragNodeSceneContextMenuResize(event) {
  const drag = nodeGraphMvp.sceneContextResizing;
  if (
    !drag ||
    (drag.pointerId !== null && event.pointerId !== undefined && drag.pointerId !== event.pointerId)
  ) {
    return;
  }
  applyNodeSceneContextWindowSize({
    width: drag.startWidth + event.clientX - drag.startClientX,
  });
  event.preventDefault();
}

function endNodeSceneContextMenuResize(event) {
  const drag = nodeGraphMvp.sceneContextResizing;
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
  nodeGraphMvp.sceneContextResizing = null;
  saveNodeSceneContextWindowSizeToUserSettings();
}

function beginNodeModuleActionsWindowDrag(event) {
  if (event.button > 0 || nodeGraphDialogDragTargetIsInteractive(event)) {
    return;
  }

  const menu = document.getElementById("nodeModuleActionsWindow");
  if (!menu || menu.hidden) {
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

function dragNodeModuleActionsWindow(event) {
  const drag = nodeGraphMvp.moduleActionDragging;
  if (
    !drag ||
    (drag.pointerId !== null && event.pointerId !== undefined && drag.pointerId !== event.pointerId)
  ) {
    return;
  }

  positionNodeSceneContextMenu(
    document.getElementById("nodeModuleActionsWindow"),
    event.clientX - drag.offsetX,
    event.clientY - drag.offsetY,
    true,
  );
  event.preventDefault();
}

function endNodeModuleActionsWindowDrag(event) {
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
  if (typeof rememberNodeGraphWorkspaceWindowState === "function") {
    rememberNodeGraphWorkspaceWindowState("moduleActions", document.getElementById("nodeModuleActionsWindow"), { open: true }, { status: false });
  }
}

function beginNodeModuleActionsWindowResize(event) {
  if (event.button > 0) {
    return;
  }
  const menu = document.getElementById("nodeModuleActionsWindow");
  if (!menu || menu.hidden) {
    return;
  }
  const rect = menu.getBoundingClientRect();
  nodeGraphMvp.moduleActionResizing = {
    handle: event.currentTarget,
    pointerId: event.pointerId ?? null,
    startClientX: event.clientX,
    startClientY: event.clientY,
    startWidth: rect.width,
    startHeight: rect.height,
  };
  event.currentTarget.classList.add("dragging");
  if (event.pointerId !== undefined) {
    event.currentTarget.setPointerCapture(event.pointerId);
  }
  event.preventDefault();
  event.stopPropagation();
}

function dragNodeModuleActionsWindowResize(event) {
  const drag = nodeGraphMvp.moduleActionResizing;
  if (
    !drag ||
    (drag.pointerId !== null && event.pointerId !== undefined && drag.pointerId !== event.pointerId)
  ) {
    return;
  }
  applyNodeModuleActionsWindowSize({
    width: drag.startWidth + event.clientX - drag.startClientX,
    height: drag.startHeight + event.clientY - drag.startClientY,
  });
  event.preventDefault();
}

function endNodeModuleActionsWindowResize(event) {
  const drag = nodeGraphMvp.moduleActionResizing;
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
  nodeGraphMvp.moduleActionResizing = null;
  saveNodeSceneContextWindowSizeToUserSettings();
}

function beginNodeScopeContextMenuDrag(event) {
  if (event.button > 0 || nodeGraphDialogDragTargetIsInteractive(event)) {
    return;
  }

  const menu = document.getElementById("nodeGlobalScopeMenu");
  if (!menu || menu.hidden) {
    return;
  }

  const rect = menu.getBoundingClientRect();
  nodeGraphMvp.scopeContextDragging = {
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
  event.stopPropagation();
}

function beginNodeGlobalScopeMenuDrag(event) {
  if (event.button > 0 || nodeGraphDialogDragTargetIsInteractive(event)) {
    return;
  }
  const menu = document.getElementById("nodeGlobalScopeMenu");
  if (!menu || menu.hidden) {
    return;
  }
  const rect = menu.getBoundingClientRect();
  nodeGraphMvp.globalScopeDragging = {
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
  event.stopPropagation();
}

function dragNodeGlobalScopeMenu(event) {
  const drag = nodeGraphMvp.globalScopeDragging;
  if (
    !drag ||
    (drag.pointerId !== null && event.pointerId !== undefined && drag.pointerId !== event.pointerId)
  ) {
    return;
  }
  const menu = document.getElementById("nodeGlobalScopeMenu");
  positionNodeSceneContextMenu(
    menu,
    event.clientX - drag.offsetX,
    event.clientY - drag.offsetY,
    false,
  );
  nodeGraphMvp.globalScopeWindowPosition = {
    left: Number.parseFloat(menu.style.left) || menu.getBoundingClientRect().left,
    top: Number.parseFloat(menu.style.top) || menu.getBoundingClientRect().top,
  };
  event.preventDefault();
}

function endNodeGlobalScopeMenuDrag(event) {
  const drag = nodeGraphMvp.globalScopeDragging;
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
  nodeGraphMvp.globalScopeDragging = null;
  if (typeof rememberNodeGraphWorkspaceWindowState === "function") {
    rememberNodeGraphWorkspaceWindowState("oscilloscopeSettings", document.getElementById("nodeGlobalScopeMenu"), { open: true }, { status: false });
  }
}

function dragNodeScopeContextMenu(event) {
  const drag = nodeGraphMvp.scopeContextDragging;
  if (
    !drag ||
    (drag.pointerId !== null && event.pointerId !== undefined && drag.pointerId !== event.pointerId)
  ) {
    return;
  }

  const menu = document.getElementById("nodeScopeContextMenu");
  positionNodeSceneContextMenu(
    menu,
    event.clientX - drag.offsetX,
    event.clientY - drag.offsetY,
    false,
  );
  nodeGraphMvp.scopeContextWindowPosition = {
    left: Number.parseFloat(menu.style.left) || menu.getBoundingClientRect().left,
    top: Number.parseFloat(menu.style.top) || menu.getBoundingClientRect().top,
  };
  event.preventDefault();
}

function endNodeScopeContextMenuDrag(event) {
  const drag = nodeGraphMvp.scopeContextDragging;
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
  nodeGraphMvp.scopeContextDragging = null;
}

function nodeGraphContextTargetModuleElement(nodeId = nodeGraphModuleActionTargetNodeId()) {
  if (!nodeId) {
    return null;
  }
  return document.querySelector(`.dsp-node[data-node="${CSS.escape(nodeId)}"]`);
}

function nodeGraphContextTargetSliderReadout(nodeId = nodeGraphModuleActionTargetNodeId()) {
  return nodeGraphContextTargetModuleElement(nodeId)?.querySelector(".node-slider-readout") || null;
}

const nodeGraphModuleActionControlIds = [
  "nodeSceneCopyModule",
  "nodeSceneSelectedModule",
  "nodeSceneAddToGroup",
  "nodeSceneAddToUi",
  "nodeSceneWireTypeControl",
  "nodeSceneAliasControl",
  "nodeSceneWidthControls",
  "nodeSceneTextBoxHeightControls",
  "nodeSceneTextBoxTextSizeControls",
  "nodeSceneTextBoxTextControls",
  "nodeSceneCodeblockControls",
  "nodeSceneGraphControls",
  "nodeSceneToggleButtons",
  "nodeSceneToggleTitle",
  "nodeSceneToggleOscilloscope",
  "nodeSceneImageControls",
  "nodeSceneImageFileInput",
  "nodeSceneCanvasControls",
  "nodeSceneLedControls",
  "nodeSceneTextBoxControls",
  "nodeSceneTextBoxHorizontalAlignControls",
  "nodeSceneTextBoxVerticalAlignControls",
  "nodeSceneDeleteModule",
];

function ensureNodeGraphModuleActionsWindowBody() {
  const body = document.getElementById("nodeModuleActionsWindowBody");
  if (!body) {
    return;
  }
  for (const id of nodeGraphModuleActionControlIds) {
    const element = document.getElementById(id);
    if (element && element.parentElement !== body) {
      body.append(element);
    }
  }
}

function openNodeGraphModuleActionsFromContextWindow() {
  ensureNodeGraphModuleActionsWindowBody();
  const targetNodeId = nodeGraphModuleActionTargetNodeId();
  nodeGraphMvp.sceneContextTargetNode = targetNodeId || null;
  nodeGraphMvp.sceneContextTargetWire = null;
  configureNodeSceneContextMenu("module");
  const menu = document.getElementById("nodeModuleActionsWindow");
  const anchor = document.getElementById("nodeSceneOpenModuleActions");
  const rect = anchor?.getBoundingClientRect?.() || {
    right: window.innerWidth * 0.5,
    top: window.innerHeight * 0.25,
  };
  positionNodeModuleActionsWindowAtSavedOr(menu, rect.right + 8, rect.top);
}

function openNodeGraphMetaparametersFromContextWindow() {
  const readout = nodeGraphContextTargetSliderReadout();
  const anchor = document.getElementById("nodeSceneOpenMetaparameters") || readout;
  const rect = anchor?.getBoundingClientRect?.() || {
    right: window.innerWidth * 0.5,
    top: window.innerHeight * 0.25,
  };
  if (!readout) {
    openBlankNodeMetadataPopover({
      clientX: rect.right + 8,
      clientY: rect.top,
      preventDefault() {},
      stopPropagation() {},
    });
    return;
  }
  openNodeMetadataPopover({
    clientX: rect.right + 8,
    clientY: rect.top,
    preventDefault() {},
    stopPropagation() {},
  }, readout);
}

function setNodeSceneContextHeader(label, detail = "") {
  const title = document.querySelector("#nodeSceneContextMenu .scene-context-title");
  if (!title) {
    return;
  }
  let labelElement = title.querySelector("span");
  let detailElement = title.querySelector("small");
  if (!labelElement) {
    labelElement = document.createElement("span");
    title.prepend(labelElement);
  }
  if (!detailElement) {
    detailElement = document.createElement("small");
    title.append(detailElement);
  }
  labelElement.textContent = label;
  detailElement.textContent = detail;
}

function setNodeModuleActionsWindowHeader(label, detail = "") {
  const title = document.querySelector("#nodeModuleActionsWindow .scene-context-title");
  if (!title) {
    return;
  }
  let labelElement = title.querySelector("span");
  let detailElement = title.querySelector("small");
  if (!labelElement) {
    labelElement = document.createElement("span");
    title.prepend(labelElement);
  }
  if (!detailElement) {
    detailElement = document.createElement("small");
    title.append(detailElement);
  }
  labelElement.textContent = label;
  detailElement.textContent = detail;
}

function configureNodeSceneContextMenu(mode) {
  ensureNodeGraphModuleActionsWindowBody();
  const actionMode = mode === "module" || mode === "wire";
  const menu = document.getElementById(actionMode ? "nodeModuleActionsWindow" : "nodeSceneContextMenu");
  const sceneMenu = document.getElementById("nodeSceneContextMenu");
  const moduleActionsWindow = document.getElementById("nodeModuleActionsWindow");
  const copyButton = document.getElementById("nodeSceneCopyModule");
  const moduleActionsWindowButton = document.getElementById("nodeSceneOpenModuleActions");
  const metaparametersWindowButton = document.getElementById("nodeSceneOpenMetaparameters");
  const addToGroupButton = document.getElementById("nodeSceneAddToGroup");
  const addToUiButton = document.getElementById("nodeSceneAddToUi");
  const deleteButton = document.getElementById("nodeSceneDeleteModule");
  const closeButton = document.getElementById(actionMode ? "nodeModuleActionsClose" : "nodeSceneCloseMenu");
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
  const codeblockControls = document.getElementById("nodeSceneCodeblockControls");
  const codeblockInputs = document.getElementById("nodeSceneCodeblockInputs");
  const codeblockOutputs = document.getElementById("nodeSceneCodeblockOutputs");
  const codeblockSource = document.getElementById("nodeSceneCodeblockSource");
  const codeblockStatus = document.getElementById("nodeSceneCodeblockStatus");
  const graphControls = document.getElementById("nodeSceneGraphControls");
  const graphCursorX = document.getElementById("nodeSceneGraphCursorX");
  const graphNodeIndex = document.getElementById("nodeSceneGraphNodeIndex");
  const graphPreviousNode = document.getElementById("nodeSceneGraphPreviousNode");
  const graphNextNode = document.getElementById("nodeSceneGraphNextNode");
  const graphNodeX = document.getElementById("nodeSceneGraphNodeX");
  const graphNodeY = document.getElementById("nodeSceneGraphNodeY");
  const graphNodeContour = document.getElementById("nodeSceneGraphNodeContour");
  const graphNodeShape = document.getElementById("nodeSceneGraphNodeShape");
  const graphNodeList = document.getElementById("nodeSceneGraphNodeList");
  const graphRemoveNode = document.getElementById("nodeSceneGraphRemoveNode");
  const toggleButtonsButton = document.getElementById("nodeSceneToggleButtons");
  const toggleOscilloscopeButton = document.getElementById("nodeSceneToggleOscilloscope");
  const toggleTitleButton = document.getElementById("nodeSceneToggleTitle");
  const imageControls = document.getElementById("nodeSceneImageControls");
  const imageLoad = document.getElementById("nodeSceneImageLoad");
  const imageSave = document.getElementById("nodeSceneImageSave");
  const imageRefresh = document.getElementById("nodeSceneImageRefresh");
  const canvasControls = document.getElementById("nodeSceneCanvasControls");
  const canvasScript = document.getElementById("nodeSceneCanvasScript");
  const ledControls = document.getElementById("nodeSceneLedControls");
  const ledColor = document.getElementById("nodeSceneLedColor");
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
  const homeModules = document.getElementById("nodeSceneHomeModules");
  const homeModuleList = document.getElementById("nodeSceneHomeModuleList");
  const moduleMode = mode === "module";
  const wireMode = mode === "wire";
  const homeMode = mode === "home";
  menu.dataset.mode = mode;
  if (sceneMenu && sceneMenu !== menu) {
    sceneMenu.dataset.mode = "home";
  }
  if (moduleActionsWindow && moduleActionsWindow !== menu) {
    moduleActionsWindow.dataset.mode = "";
  }
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
  const canGroup = moduleMode && nodeGraphModuleGroupSelection().length > 0;
  const widthGu = targetNode ? nodeGraphPatchNodeGridWidthUnits(targetNode) : 0;
  const heightGu = targetNode ? nodeGraphPatchNodeGridHeightUnits(targetNode) : 0;
  const widthLimits = targetNode
    ? nodeGraphModuleWidthLimitsForType(targetNode.type)
    : nodeGraphModuleWidthLimits;
  const heightLimits = targetNode
    ? nodeGraphModuleHeightLimitsForType(targetNode.type)
    : nodeGraphModuleHeightLimits;
  const targetNodeUi = normalizeNodeGraphPatchNodeUi(targetNode?.ui);
  const buttonsHidden = targetNodeUi.buttonsHidden || nodeGraphMvp.moduleButtonsVisible === false;
  const oscilloscopeHidden = targetNodeUi.oscilloscopeHidden;
  const titleHidden = targetNodeUi.titleHidden;
  const textBoxLayout = normalizeNodeGraphTextBoxLayout(targetNode?.layout);
  const textBoxMode = textBoxLayout.textMode;
  if (actionMode) {
    setNodeModuleActionsWindowHeader(moduleMode ? "MODULE ACTIONS" : "WIRE ACTIONS", targetNode
      ? nodeGraphNodeDisplayName(targetNode.id)
      : wireMode
        ? "selected wire"
        : "no module selected");
    menu.setAttribute("aria-label", moduleMode ? "Module actions" : "Wire actions");
  } else {
    setNodeSceneContextHeader("Command", "Center");
    menu.setAttribute("aria-label", "Command Center");
  }
  if (moduleActionsWindowButton) {
    moduleActionsWindowButton.disabled = false;
    moduleActionsWindowButton.title = targetNode
      ? "Open module actions for the current target module."
      : "Open module actions with no module selected.";
  }
  if (metaparametersWindowButton) {
    metaparametersWindowButton.disabled = false;
    metaparametersWindowButton.title = nodeGraphContextTargetSliderReadout(targetNode?.id)
      ? "Open the metaparameter editor for the first parameter on this module."
      : "Open blank metaparameter script settings.";
  }
  copyButton.hidden = !moduleMode;
  addToGroupButton.hidden = !moduleMode;
  const targetIsGraphType = nodeGraphModuleIsGraphType(targetNode?.type);
  if (addToUiButton) {
    addToUiButton.hidden = !(moduleMode && targetIsGraphType);
  }
  deleteButton.hidden = !(moduleMode || wireMode);
  selectedModule.hidden = !(moduleMode || wireMode);
  if (homeModules) {
    homeModules.hidden = !homeMode;
    if (homeMode) {
      homeModuleList?.replaceChildren();
    }
  }
  wireTypeControl.hidden = !wireMode;
  aliasControl.hidden = !moduleMode;
  widthControls.hidden = !moduleMode;
  const canResizeHeight = moduleMode && Boolean(targetNode);
  textBoxHeightControls.hidden = !canResizeHeight;
  textBoxTextSizeControls.hidden = !(moduleMode && targetNode?.type === "textBox");
  textBoxTextControls.hidden = !(moduleMode && targetNode?.type === "textBox");
  codeblockControls.hidden = !(moduleMode && targetNode?.type === "codeblock");
  graphControls.hidden = !(moduleMode && targetIsGraphType);
  toggleButtonsButton.hidden = !moduleMode;
  toggleOscilloscopeButton.hidden = !(moduleMode && nodeGraphPatchNodeHasHideableOscilloscope(targetNode));
  toggleTitleButton.hidden = !moduleMode;
  imageControls.hidden = !(moduleMode && targetNode?.type === "image");
  canvasControls.hidden = !(moduleMode && targetNode?.type === "canvas");
  ledControls.hidden = !(moduleMode && targetNode?.type === "led");
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
    addToGroupButton.disabled = !canGroup;
    addToGroupButton.title = canGroup
      ? "Save the selected circuit as a reusable group preset."
      : "Select one or more modules to save a group.";
    if (addToUiButton) {
      const canAddToUi = targetIsGraphType;
      const uiItems = normalizeNodeGraphPatchUiItems(nodeGraphMvp.patch.uiItems);
      const alreadyAddedToUi = canAddToUi && uiItems.some((item) => item.sourceNodeId === targetNode.id);
      addToUiButton.disabled = !canAddToUi;
      addToUiButton.querySelector("span").textContent = alreadyAddedToUi ? "Open UI Graph" : "Add Graph UI";
      addToUiButton.title = alreadyAddedToUi
        ? "Open this graph's UI editor."
        : "Add this graph as a large editor in the UI view.";
    }
    deleteButton.disabled = !canDelete;
    deleteButton.title = canDelete
      ? nodeGraphTooltipText("actions.deleteModule")
      : targetNode
        ? nodeGraphTooltipText("actions.deleteUnavailableOutput")
        : nodeGraphTooltipText("actions.deleteUnavailableOneModule");
    widthValue.textContent = `${widthGu} gu`;
    widthDecrease.disabled = !targetNode || widthGu <= widthLimits.minGu;
    widthDecrease.title = nodeGraphTooltipText("actions.widthDecrease");
    widthIncrease.disabled = !targetNode || widthGu >= widthLimits.maxGu;
    widthIncrease.title = nodeGraphTooltipText("actions.widthIncrease");
    textBoxHeightValue.textContent = `${heightGu} height gu`;
    textBoxHeightDecrease.disabled = !canResizeHeight || heightGu <= heightLimits.minGu;
    textBoxHeightDecrease.title = "Make this module one grid unit shorter.";
    textBoxHeightIncrease.disabled = !canResizeHeight || heightGu >= heightLimits.maxGu;
    textBoxHeightIncrease.title = "Make this module one grid unit taller.";
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
    toggleOscilloscopeButton.disabled = !targetNode || !nodeGraphPatchNodeHasHideableOscilloscope(targetNode);
    toggleOscilloscopeButton.querySelector("span").textContent = oscilloscopeHidden ? "Show oscilloscope" : "Hide oscilloscope";
    toggleOscilloscopeButton.setAttribute("aria-pressed", oscilloscopeHidden ? "true" : "false");
    toggleOscilloscopeButton.title = oscilloscopeHidden
      ? "Show this module's built-in oscilloscope strip."
      : "Hide this module's built-in oscilloscope strip.";
    toggleTitleButton.disabled = !targetNode;
    toggleTitleButton.querySelector("span").textContent = titleHidden ? "Show title" : "Hide title";
    toggleTitleButton.setAttribute("aria-pressed", titleHidden ? "true" : "false");
    toggleTitleButton.title = nodeGraphTooltipText(titleHidden ? "actions.showModuleTitle" : "actions.hideModuleTitle");
    if (targetNode?.type === "image") {
      const imageLayout = normalizeNodeGraphImageLayout(targetNode.layout);
      imageLoad.disabled = false;
      imageSave.disabled = !imageLayout.dataUrl;
      imageRefresh.disabled = false;
      imageLoad.title = "Load an image into this patch-local image node.";
      imageSave.title = imageLayout.dataUrl ? "Save this image node's current image." : "Load an image before saving.";
      imageRefresh.title = "Refresh image preview and trace texture.";
    }
    if (targetNode?.type === "canvas") {
      canvasScript.disabled = false;
      canvasScript.title = "Open this canvas module's layer and compositor script.";
    }
    if (targetNode?.type === "led") {
      const led = normalizeNodeGraphLedLayout(targetNode.led);
      ledColor.disabled = false;
      ledColor.value = led.color;
      ledColor.title = "Set this LED's outer rim color. The center uses the bright white dot layer.";
    } else {
      ledColor.disabled = true;
      ledColor.value = nodeGraphLedDefaultColor;
    }
    textBoxSingleLine.setAttribute("aria-pressed", textBoxMode === "singleLine" ? "true" : "false");
    textBoxMultiline.setAttribute("aria-pressed", textBoxMode === "multiline" ? "true" : "false");
    textBoxSingleLine.title = nodeGraphTooltipText("actions.textBoxSingleLine");
    textBoxMultiline.title = nodeGraphTooltipText("actions.textBoxMultiline");
    textBoxTextInput.disabled = !targetNode || targetNode.type !== "textBox";
    textBoxTextInput.value = targetNode?.type === "textBox" ? textBoxLayout.text : "";
    textBoxTextInput.title = nodeGraphTooltipText("actions.textBoxContent");
    if (targetNode?.type === "codeblock") {
      const codeblock = normalizeNodeGraphCodeblock(targetNode.codeblock);
      codeblockInputs.value = codeblock.inputs.join(", ");
      codeblockOutputs.value = codeblock.outputs.join(", ");
      codeblockSource.value = codeblock.code;
      const status = nodeGraphCodeblockCompileStatus(codeblock);
      codeblockStatus.textContent = status.ok ? "code ok" : `compile error: ${status.message}`;
    } else {
      codeblockInputs.value = "";
      codeblockOutputs.value = "";
      codeblockSource.value = "";
      codeblockStatus.textContent = "";
    }
    if (targetIsGraphType) {
      syncNodeGraphGraphControls(nodeGraphGraphForNode(targetNode));
      graphCursorX.disabled = false;
      graphNodeIndex.disabled = false;
      graphPreviousNode.disabled = false;
      graphNextNode.disabled = false;
      graphNodeX.disabled = false;
      graphNodeY.disabled = false;
      graphNodeContour.disabled = targetNode.type === "graph2";
      graphNodeShape.disabled = targetNode.type === "graph2";
      graphCursorX.title = "Move the vertical graph cursor.";
      graphNodeIndex.title = "Choose the graph node to edit.";
      graphPreviousNode.title = "Select the previous graph node.";
      graphNextNode.title = "Select the next graph node.";
      graphNodeX.title = "Set the selected node's x position.";
      graphNodeY.title = "Set the selected node's y value.";
      graphNodeContour.title = "Bend the selected node's outgoing segment.";
      graphNodeShape.title = "Choose the selected node's outgoing curve shape.";
    } else {
      graphCursorX.value = "";
      graphNodeIndex.replaceChildren();
      graphNodeList.replaceChildren();
      graphNodeX.value = "";
      graphNodeY.value = "";
      graphNodeContour.value = "";
      graphNodeShape.value = "rational";
      graphCursorX.disabled = true;
      graphNodeIndex.disabled = true;
      graphPreviousNode.disabled = true;
      graphNextNode.disabled = true;
      graphNodeX.disabled = true;
      graphNodeY.disabled = true;
      graphNodeContour.disabled = true;
      graphNodeShape.disabled = true;
      graphRemoveNode.disabled = true;
    }
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
    addToGroupButton.disabled = true;
    if (addToUiButton) {
      addToUiButton.disabled = true;
      addToUiButton.querySelector("span").textContent = "";
    }
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
    codeblockInputs.value = "";
    codeblockOutputs.value = "";
    codeblockSource.value = "";
    codeblockStatus.textContent = "";
    graphCursorX.value = "";
    graphNodeIndex.replaceChildren();
    graphNodeList.replaceChildren();
    graphNodeX.value = "";
    graphNodeY.value = "";
    graphNodeContour.value = "";
    graphNodeShape.value = "rational";
    graphCursorX.disabled = true;
    graphNodeIndex.disabled = true;
    graphNodeX.disabled = true;
    graphNodeY.disabled = true;
    graphNodeContour.disabled = true;
    graphNodeShape.disabled = true;
    graphRemoveNode.disabled = true;
    textBoxVerticalAlign.value = "50";
    textBoxVerticalAlignValue.textContent = "";
    textBoxVerticalAlign.disabled = true;
    toggleButtonsButton.disabled = true;
    toggleOscilloscopeButton.disabled = true;
    toggleTitleButton.disabled = true;
    imageLoad.disabled = true;
    imageSave.disabled = true;
    imageRefresh.disabled = true;
    canvasScript.disabled = true;
    ledColor.disabled = true;
    ledColor.value = nodeGraphLedDefaultColor;
  } else {
    selectedModule.querySelector("span").textContent = "selected";
    selectedModule.querySelector("strong").textContent = "none";
    for (const button of wireTypeButtons) {
      button.disabled = true;
      button.setAttribute("aria-pressed", "false");
    }
    copyButton.disabled = true;
    copyButton.title = nodeGraphTooltipText("actions.copyUnavailableModule");
    addToGroupButton.disabled = true;
    if (addToUiButton) {
      addToUiButton.disabled = true;
      addToUiButton.querySelector("span").textContent = "";
    }
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
    codeblockInputs.value = "";
    codeblockOutputs.value = "";
    codeblockSource.value = "";
    codeblockStatus.textContent = "";
    graphCursorX.value = "";
    graphNodeIndex.replaceChildren();
    graphNodeList.replaceChildren();
    graphNodeX.value = "";
    graphNodeY.value = "";
    graphNodeContour.value = "";
    graphNodeShape.value = "rational";
    graphCursorX.disabled = true;
    graphNodeIndex.disabled = true;
    graphNodeX.disabled = true;
    graphNodeY.disabled = true;
    graphNodeContour.disabled = true;
    graphNodeShape.disabled = true;
    graphRemoveNode.disabled = true;
    textBoxVerticalAlign.value = "50";
    textBoxVerticalAlignValue.textContent = "";
    textBoxVerticalAlign.disabled = true;
    toggleButtonsButton.disabled = true;
    toggleOscilloscopeButton.disabled = true;
    toggleTitleButton.disabled = true;
    imageLoad.disabled = true;
    imageSave.disabled = true;
    imageRefresh.disabled = true;
    canvasScript.disabled = true;
    ledColor.disabled = true;
    ledColor.value = nodeGraphLedDefaultColor;
  }
}

function openNodeModuleActionMenu(event) {
  ensureNodeGraphModuleActionsWindowBody();
  const button = event.currentTarget;
  const node = button.closest(".dsp-node");
  if (!node) {
    return;
  }

  nodeGraphMvp.sceneContextPoint = null;
  closeNodeScopeContextMenu();
  nodeGraphMvp.sceneContextTargetNode = node.dataset.node;
  nodeGraphMvp.sceneContextTargetWire = null;
  configureNodeSceneContextMenu("module");
  const rect = button.getBoundingClientRect();
  positionNodeModuleActionsWindowAtSavedOr(
    document.getElementById("nodeModuleActionsWindow"),
    rect.right,
    rect.bottom,
  );
  event.preventDefault();
  event.stopPropagation();
}

function openNodeScopeContextMenu(event) {
  const contextScope = event.target.closest?.(".node-module-scope-window, .node-led-face");
  const nodeId = contextScope?.dataset?.node || "";
  if (!nodeId || !nodeGraphPatchNode(nodeId)) {
    return false;
  }

  event.preventDefault();
  event.stopPropagation();
  closeNodeSceneContextMenu();
  nodeGraphMvp.sceneContextPoint = null;
  nodeGraphMvp.sceneContextTargetNode = null;
  nodeGraphMvp.sceneContextTargetWire = null;
  nodeGraphMvp.scopeContextTargetNode = nodeId;
  if (typeof openNodeGraphScopeShaderScript === "function" && openNodeGraphScopeShaderScript(nodeId)) {
    return true;
  }
  renderNodeGraphSceneScopeControls(nodeId);
  positionNodeGlobalScopeMenuAtSavedOr(
    document.getElementById("nodeGlobalScopeMenu"),
    event.clientX,
    event.clientY,
  );
  renderNodeGraphModuleScopeBrightnessControl();
  if (typeof rememberNodeGraphWorkspaceWindowState === "function") {
    rememberNodeGraphWorkspaceWindowState(
      "oscilloscopeSettings",
      document.getElementById("nodeGlobalScopeMenu"),
      { open: true },
      { status: false },
    );
  }
  return true;
}

function openNodeSceneContextMenu(event) {
  if (event.target.closest?.(".node-view-toolbar")) {
    event.preventDefault();
    event.stopPropagation();
    return;
  }
  if (event.target.closest?.(
    "input, textarea, select, option, [contenteditable='true'], " +
    "#nodeSceneContextMenu, #nodeParameterMetadataPopover, #nodeGlobalScopeMenu, " +
    "#nodeModuleActionsWindow, #nodeShaderScriptDialog, #nodeCanvasScriptDialog, #nodeSavedPatchesWindow",
  )) {
    return;
  }
  if (openNodeScopeContextMenu(event)) {
    return;
  }

  closeNodeScopeContextMenu();
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
      positionNodeSceneContextMenuHeaderAtPoint(
        document.getElementById("nodeModuleActionsWindow"),
        event.clientX,
        event.clientY,
      );
      if (typeof rememberNodeGraphWorkspaceWindowState === "function") {
        rememberNodeGraphWorkspaceWindowState(
          "moduleActions",
          document.getElementById("nodeModuleActionsWindow"),
          { open: true },
          { status: false },
        );
      }
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
    positionNodeSceneContextMenuHeaderAtPoint(
      document.getElementById("nodeModuleActionsWindow"),
      event.clientX,
      event.clientY,
    );
    if (typeof rememberNodeGraphWorkspaceWindowState === "function") {
      rememberNodeGraphWorkspaceWindowState(
        "moduleActions",
        document.getElementById("nodeModuleActionsWindow"),
        { open: true },
        { status: false },
      );
    }
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
  clearNodeGraphSelection();
  configureNodeSceneContextMenu("home");
  positionNodeSceneContextMenuAtCurrentSavedOrInitial(
    document.getElementById("nodeSceneContextMenu"),
    event.clientX,
    event.clientY,
  );
  if (typeof rememberNodeGraphWorkspaceWindowState === "function") {
    rememberNodeGraphWorkspaceWindowState(
      "commandCenter",
      document.getElementById("nodeSceneContextMenu"),
      { open: true },
      { status: false },
    );
  }
}
