const nodeGraphTooltipSourceUrl = "./public/tooltips.json?v=tooltip-master";

function nodeGraphTooltipTemplate(key) {
  if (!key) {
    return "";
  }
  const parts = String(key).split(".");
  let value = nodeGraphMvp.tooltips;
  for (const part of parts) {
    value = value?.[part];
  }
  return typeof value === "string" ? value : "";
}

function nodeGraphTooltipText(key, context = {}) {
  const template = nodeGraphTooltipTemplate(key);
  if (!template) {
    return "";
  }
  return template.replace(/\{([A-Za-z0-9_]+)\}/g, (match, name) =>
    Object.prototype.hasOwnProperty.call(context, name) ? String(context[name]) : match,
  );
}

function nodeGraphApplyTooltip(element, key, context = {}, options = {}) {
  if (!element || !key) {
    return "";
  }
  const text = nodeGraphTooltipText(key, context);
  if (!text) {
    return "";
  }
  if (options.title !== false) {
    element.title = text;
  }
  if (options.interaction !== false) {
    element.dataset.interactionHelp = text;
  }
  element.dataset.tooltipKey = key;
  return text;
}

function nodeGraphElementTooltipText(element) {
  if (!element) {
    return "";
  }
  const key = element.dataset.tooltipKey;
  return key ? nodeGraphTooltipText(key) : "";
}

function applyNodeGraphStaticTooltips(root = document) {
  for (const element of root.querySelectorAll("[data-tooltip-key]")) {
    const text = nodeGraphTooltipText(element.dataset.tooltipKey);
    if (!text) {
      continue;
    }
    if (element.dataset.tooltipTitle !== "false") {
      element.title = text;
    }
    if (element.dataset.tooltipInteraction !== "false") {
      element.dataset.interactionHelp = text;
    }
  }
}

async function loadNodeGraphTooltips() {
  try {
    const response = await fetch(nodeGraphTooltipSourceUrl, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`tooltip document HTTP ${response.status}`);
    }
    nodeGraphMvp.tooltips = await response.json();
  } catch (error) {
    console.warn("Unable to load tooltip document", error);
    nodeGraphMvp.tooltips = {};
  }
  applyNodeGraphStaticTooltips();
}
