function syncNodeSliderPortalHandle(readout, slider, position, enabled) {
  readout.classList.toggle("wraparound-slider", enabled);
  if (!enabled) {
    readout.style.removeProperty("--portal-left-width");
    readout.style.removeProperty("--portal-right-width");
    return;
  }

  const width = readout.getBoundingClientRect().width;
  if (!Number.isFinite(width) || width <= 0) {
    readout.style.setProperty("--portal-left-width", "0px");
    readout.style.setProperty("--portal-right-width", "0px");
    return;
  }

  const boundedPosition = Math.max(0, Math.min(100, position));
  const center = (boundedPosition / 100) * width;
  const handleHalfWidth = nodeSliderHandleHalfWidthPx;
  const leftOverflow = Math.max(0, handleHalfWidth - center);
  const rightOverflow = Math.max(0, center + handleHalfWidth - width);
  readout.style.setProperty("--portal-left-width", `${rightOverflow}px`);
  readout.style.setProperty("--portal-right-width", `${leftOverflow}px`);
}

function syncNodeSliderReadout(slider) {
  const readout = slider.closest("label")?.querySelector(".node-slider-readout");
  if (!readout) {
    return;
  }

  if (!readout.querySelector(".node-slider-readout-value")) {
    readout.textContent = "";
    populateNodeSliderReadoutShell(readout);
  }
  const labelText = readout.querySelector(".node-slider-readout-label");
  const valueText = readout.querySelector(".node-slider-readout-value");
  const unitText = readout.querySelector(".node-slider-readout-unit");
  const position = nodeSliderTravelFromValue(slider, Number(slider.value)) * 100;
  const unit = (slider.dataset.unit || "").trim();
  const choiceLabel = nodeSliderChoiceLabel(slider);
  const choices = parseNodeMetadataChoices(slider.dataset.choices || "");
  const usesChoices = nodeSliderShouldDisplayChoices(slider) && choices.length > 0;
  const dividesChoices = usesChoices && nodeSliderShouldDivideChoicesVisibly(slider);
  const usesNumericReadout = !choiceLabel;
  const usesPortalWrap = nodeSliderShouldWraparound(slider) && !usesChoices;
  if (labelText) {
    labelText.textContent = readout.dataset.paramLabel || nodeSliderLabelText(slider);
  }
  valueText.textContent = choiceLabel ? ` ${choiceLabel}` : formatNodeSliderNumber(slider.value, {
    reserveSignSpace: true,
    showSign: nodeSliderShouldShowSign(slider),
  });
  unitText.textContent = unit;
  unitText.classList.toggle("is-empty", !unit);
  unitText.setAttribute("aria-hidden", unit ? "false" : "true");
  readout.dataset.value = slider.value;
  readout.dataset.unit = unit;
  readout.dataset.choiceCount = usesChoices ? String(choices.length) : "0";
  readout.classList.toggle("choices-divided", dividesChoices);
  readout.classList.toggle("reserves-sign-column", usesNumericReadout || usesChoices);
  readout.removeAttribute("title");
  if (dividesChoices) {
    const choiceIndex = Math.max(0, Math.min(choices.length - 1, Math.round(Number(slider.value))));
    const dividerColor = "rgba(243, 241, 236, 0.2)";
    const dividerLayers = Array.from({ length: Math.max(0, choices.length - 1) }, (_, index) => {
      const position = ((index + 1) / choices.length) * 100;
      return `linear-gradient(90deg, transparent 0 calc(${position}% - 0.5px), ${dividerColor} calc(${position}% - 0.5px) calc(${position}% + 0.5px), transparent calc(${position}% + 0.5px) 100%)`;
    });
    readout.style.setProperty("--value-start", `${(choiceIndex / choices.length) * 100}%`);
    readout.style.setProperty("--value-end", `${((choiceIndex + 1) / choices.length) * 100}%`);
    readout.style.setProperty("--choice-divider-background", dividerLayers.join(", ") || "none");
    syncNodeSliderPortalHandle(readout, slider, position, false);
  } else {
    const boundedPosition = Math.max(0, Math.min(100, position));
    readout.style.setProperty(
      "--value-start",
      `calc(${boundedPosition}% - ${nodeSliderHandleHalfWidthPx}px)`,
    );
    readout.style.setProperty(
      "--value-end",
      `calc(${boundedPosition}% + ${nodeSliderHandleHalfWidthPx}px)`,
    );
    readout.style.setProperty("--choice-divider-background", "none");
    syncNodeSliderPortalHandle(readout, slider, boundedPosition, usesPortalWrap);
  }
  syncNodeSliderMetadataTooltip(slider);
}

function nodeSliderLabelText(slider) {
  const controlLabel = slider.closest(".node-parameter-control")?.dataset.paramLabel?.trim();
  if (controlLabel) {
    return controlLabel;
  }
  const label = slider.closest("label");
  if (!label) {
    return slider.id;
  }
  for (const node of label.childNodes) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent.trim();
      if (text) {
        return text;
      }
    }
  }
  return slider.id;
}

function nodeSliderDebugPath(slider) {
  const node = slider.closest(".dsp-node");
  const nodeName = node ? nodeGraphNodeDisplayName(node.dataset.node) : "Node";
  return `${nodeName} : ${nodeSliderLabelText(slider)} : Metadata`;
}
