function normalizeNodeGraphFloatingWindowSize(size = {}, defaults = {}) {
  const viewportWidth = window.innerWidth || document.documentElement.clientWidth || 720;
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 760;
  const minWidth = Math.max(1, Number(defaults.minWidth) || 160);
  const configuredMaxWidth = Number(defaults.maxWidth);
  const maxWidth = Math.max(
    minWidth,
    Math.min(
      Number.isFinite(configuredMaxWidth) ? configuredMaxWidth : 720,
      viewportWidth - 28,
    ),
  );
  const minHeight = Math.max(1, Number(defaults.minHeight) || 120);
  const configuredMaxHeight = Number(defaults.maxHeight);
  const maxHeight = Math.max(
    minHeight,
    Math.min(
      Number.isFinite(configuredMaxHeight) ? configuredMaxHeight : 760,
      viewportHeight - 28,
    ),
  );
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

function applyNodeGraphFloatingWindowSizeVars(element, cssPrefix, defaults = {}, normalized = {}) {
  if (!element || !cssPrefix) {
    return;
  }
  const pairs = [
    ["min-width", defaults.minWidth],
    ["max-width", defaults.maxWidth],
    ["min-height", defaults.minHeight],
    ["max-height", defaults.maxHeight],
    ["width", normalized.width],
    ["height", normalized.height],
  ];
  for (const [name, value] of pairs) {
    const propertyName = `--${cssPrefix}-${name}`;
    if (Number.isFinite(Number(value))) {
      element.style.setProperty(propertyName, `${Math.round(Number(value))}px`);
    } else if (name === "height") {
      element.style.removeProperty(propertyName);
    }
  }
}

function beginNodeGraphFloatingWindowResize(event, element, stateKey) {
  if (event.button > 0 || !element || element.hidden || !stateKey) {
    return null;
  }
  const rect = element.getBoundingClientRect();
  const drag = {
    handle: event.currentTarget,
    pointerId: event.pointerId ?? null,
    startClientX: event.clientX,
    startClientY: event.clientY,
    startWidth: rect.width,
    startHeight: rect.height,
  };
  nodeGraphMvp[stateKey] = drag;
  event.currentTarget.classList.add("dragging");
  event.currentTarget.setPointerCapture?.(event.pointerId);
  event.preventDefault();
  event.stopPropagation();
  return drag;
}

function dragNodeGraphFloatingWindowResize(event, stateKey, applySize, axes = {}) {
  const drag = nodeGraphMvp[stateKey];
  if (
    !drag ||
    (drag.pointerId !== null && event.pointerId !== undefined && drag.pointerId !== event.pointerId) ||
    typeof applySize !== "function"
  ) {
    return false;
  }
  const nextSize = {};
  if (axes.width !== false) {
    nextSize.width = drag.startWidth + event.clientX - drag.startClientX;
  }
  if (axes.height !== false) {
    nextSize.height = drag.startHeight + event.clientY - drag.startClientY;
  }
  applySize(nextSize);
  event.preventDefault();
  return true;
}

function endNodeGraphFloatingWindowResize(event, stateKey, onEnd = null) {
  const drag = nodeGraphMvp[stateKey];
  if (
    !drag ||
    (drag.pointerId !== null && event.pointerId !== undefined && drag.pointerId !== event.pointerId)
  ) {
    return false;
  }
  drag.handle.classList.remove("dragging");
  if (event.pointerId !== undefined && drag.handle.hasPointerCapture?.(event.pointerId)) {
    drag.handle.releasePointerCapture(event.pointerId);
  }
  nodeGraphMvp[stateKey] = null;
  if (typeof onEnd === "function") {
    onEnd();
  }
  return true;
}
