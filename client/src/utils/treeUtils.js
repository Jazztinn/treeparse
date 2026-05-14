let counter = 1;

export function generateId() {
  return `n${counter++}`;
}

export function findNode(tree, id) {
  if (!tree) return null;
  if (tree.id === id) return tree;
  for (const child of tree.children || []) {
    const found = findNode(child, id);
    if (found) return found;
  }
  return null;
}

export function addChildNode(tree, parentId, newNode) {
  if (!tree) return tree;
  if (tree.id === parentId) {
    return { ...tree, children: [...(tree.children || []), newNode] };
  }
  return {
    ...tree,
    children: (tree.children || []).map(child => addChildNode(child, parentId, newNode))
  };
}

export function deleteNode(tree, targetId) {
  if (!tree) return tree;
  return {
    ...tree,
    children: (tree.children || [])
      .filter(child => child.id !== targetId)
      .map(child => deleteNode(child, targetId))
  };
}

export function updateNode(tree, targetId, updates) {
  if (!tree) return tree;
  if (tree.id === targetId) return { ...tree, ...updates };
  return {
    ...tree,
    children: (tree.children || []).map(child => updateNode(child, targetId, updates))
  };
}

export function findParent(tree, targetId, parent = null) {
  if (!tree) return null;
  if (tree.id === targetId) return parent;
  for (const child of tree.children || []) {
    const found = findParent(child, targetId, tree);
    if (found !== null) return found;
  }
  return null;
}

export function findFirstByType(node, type) {
  if (!node) return null;
  if (node.type === type) return node;
  for (const child of node.children || []) {
    const found = findFirstByType(child, type);
    if (found) return found;
  }
  return null;
}

// Find the main V leaf related to the given AUX/Aux/PRED node.
// Strategy: walk up to closest ancestor that contains a VP, then dive into that VP for a V.
export function findMainVerb(tree, contextNodeId) {
  if (!tree) return null;
  // Walk up from the context node looking for a sibling VP
  let current = contextNodeId;
  while (current) {
    const parent = findParent(tree, current);
    if (!parent) break;
    for (const sibling of parent.children || []) {
      if (sibling.id === current) continue;
      const v = findFirstByType(sibling, 'V');
      if (v) return v;
    }
    current = parent.id;
  }
  // Last resort: any V anywhere
  return findFirstByType(tree, 'V');
}

export function treeToJSON(tree) {
  return JSON.stringify(tree, null, 2);
}

export function makeEmptyTree() {
  return {
    id: generateId(),
    type: 'S',
    label: 'Sentence',
    word: null,
    children: []
  };
}
