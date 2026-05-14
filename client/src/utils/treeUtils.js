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
