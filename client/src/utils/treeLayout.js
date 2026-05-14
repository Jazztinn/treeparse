const NODE_WIDTH = 80;
const NODE_HEIGHT = 40;
const LEVEL_HEIGHT = 90;

function computeSubtreeWidth(node) {
  if (!node.children || node.children.length === 0) return NODE_WIDTH;
  const childrenWidth = node.children.reduce((sum, c) => sum + computeSubtreeWidth(c), 0);
  const gap = (node.children.length - 1) * 20;
  return Math.max(NODE_WIDTH, childrenWidth + gap);
}

function assignPositions(node, x, y, positions) {
  const subtreeWidth = computeSubtreeWidth(node);
  const cx = x + subtreeWidth / 2;
  positions[node.id] = { x: cx, y };

  if (node.children && node.children.length > 0) {
    let childX = x;
    for (const child of node.children) {
      const childWidth = computeSubtreeWidth(child);
      assignPositions(child, childX, y + LEVEL_HEIGHT, positions);
      childX += childWidth + 20;
    }
  }

  return subtreeWidth;
}

export function layoutTree(root) {
  if (!root) return { positions: {}, width: 0, height: 0 };
  const positions = {};
  const totalWidth = computeSubtreeWidth(root);
  assignPositions(root, 0, NODE_HEIGHT, positions);

  let maxY = 0;
  for (const pos of Object.values(positions)) {
    if (pos.y > maxY) maxY = pos.y;
  }

  return { positions, width: totalWidth, height: maxY + NODE_HEIGHT + 20 };
}

export { NODE_WIDTH, NODE_HEIGHT };
