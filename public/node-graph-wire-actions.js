function disconnectNodeGraphConnection(index, kind = "signal") {
  const patch = cloneNodeGraphPatch(nodeGraphMvp.patch);
  if (kind === "modulation") {
    patch.modulations = patch.modulations.filter(
      (_modulation, modulationIndex) => modulationIndex !== index,
    );
  } else {
    patch.connections = patch.connections.filter(
      (_connection, connectionIndex) => connectionIndex !== index,
    );
  }
  const selection = nodeGraphMvp.selected;
  if (sameNodeGraphSelection(selection, { type: "wire", kind, index })) {
    setNodeGraphSelection(null);
  } else if (selection?.type === "wire" && (selection.kind || "signal") === kind && selection.index > index) {
    setNodeGraphSelection({ ...selection, index: selection.index - 1 });
  }
  commitNodeGraphPatch(patch, { status: "wire disconnected" });
}

function connectNodeGraphPorts(sourceNode, sourcePort, destinationNode, destinationPort) {
  if (
    !nodeGraphInputKey(destinationNode, destinationPort) ||
    !nodeGraphMvp.activeNodes.has(sourceNode) ||
    !nodeGraphMvp.activeNodes.has(destinationNode)
  ) {
    return false;
  }

  const duplicate = nodeGraphMvp.patch.connections.some(
    (connection) =>
      connection.sourceNode === sourceNode &&
      connection.sourcePort === sourcePort &&
      connection.destinationNode === destinationNode &&
      connection.destinationPort === destinationPort,
  );
  if (duplicate) {
    return false;
  }

  const patch = cloneNodeGraphPatch(nodeGraphMvp.patch);
  patch.connections.push({
    sourceNode,
    sourcePort,
    destinationNode,
    destinationPort,
  });
  commitNodeGraphPatch(patch, { status: "wire connected" });
  return true;
}

function connectNodeGraphModulation(sourceNode, sourcePort, destinationNode, destinationParam) {
  if (
    !nodeGraphMvp.activeNodes.has(sourceNode) ||
    !nodeGraphMvp.activeNodes.has(destinationNode)
  ) {
    return false;
  }

  const duplicate = nodeGraphMvp.patch.modulations.some(
    (modulation) =>
      modulation.sourceNode === sourceNode &&
      modulation.sourcePort === sourcePort &&
      modulation.destinationNode === destinationNode &&
      modulation.destinationParam === destinationParam,
  );
  if (duplicate) {
    return false;
  }

  const patch = cloneNodeGraphPatch(nodeGraphMvp.patch);
  patch.modulations.push({
    sourceNode,
    sourcePort,
    destinationNode,
    destinationParam,
  });
  commitNodeGraphPatch(patch, { status: "modulation connected" });
  return true;
}

function burstNodeGraphZap(point) {
  const surface = nodeGraphZoomSurface();
  if (!surface || !point) {
    return;
  }
  const colors = [
    ["#7fc7d9", "rgba(127, 199, 217, 0.7)"],
    ["#e2a86d", "rgba(226, 168, 109, 0.72)"],
    ["#ff6b6b", "rgba(255, 107, 107, 0.72)"],
  ];
  for (let index = 0; index < 8; index += 1) {
    const [color, glow] = colors[index % colors.length];
    const particle = document.createElement("span");
    particle.className = "node-zap-particle";
    particle.textContent = "\u2301";
    particle.style.left = `${point.x}px`;
    particle.style.top = `${point.y}px`;
    particle.style.setProperty("--zap-color", color);
    particle.style.setProperty("--zap-glow", glow);
    particle.style.setProperty("--zap-x", `${(index % 4 - 1.5) * 30}px`);
    particle.style.setProperty("--zap-y", `${-30 - Math.floor(index / 4) * 24}px`);
    particle.style.setProperty("--zap-rotate", `${index * 43 - 96}deg`);
    particle.style.setProperty("--zap-scale", `${1 + (index % 5) * 0.24}`);
    particle.style.animationDelay = `${index * 14}ms`;
    particle.addEventListener("animationend", () => particle.remove(), { once: true });
    surface.append(particle);
  }
}
