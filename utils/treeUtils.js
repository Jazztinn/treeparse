/**
 * Get a node at the current path from the tree
 */
export const getNodeAtPath = (tree, path) => {
  if (!tree || !Array.isArray(path)) {
    return tree || { label: '', children: [] };
  }

  let node = tree;
  for (let idx of path) {
    if (!node || !Array.isArray(node.children) || !node.children[idx]) {
      return { label: '', children: [] };
    }
    node = node.children[idx];
  }

  if (!node.children || !Array.isArray(node.children)) {
    node.children = [];
  }
  return node;
};

/**
 * Add a new node at the current path
 */
export const addNodeAtPath = (tree, newLabel, path) => {
  if (!newLabel.trim()) return tree;

  const newNode = { label: newLabel.trim(), children: [] };

  // If tree is empty and path is root
  if (path.length === 0 && !tree.label) {
    return newNode;
  }

  // Deep copy to ensure immutability
  const deepCopy = JSON.parse(JSON.stringify(tree));
  let node = deepCopy;

  // Navigate to parent node
  for (let idx of path) {
    if (!node.children) node.children = [];
    if (!node.children[idx]) {
      node.children[idx] = { label: '', children: [] };
    }
    node = node.children[idx];
  }

  // Ensure children array exists
  if (!node.children) node.children = [];
  node.children.push(newNode);

  return deepCopy;
};

/**
 * Calculate new path when going up one level
 */
export const getParentPath = (currentPath, tree) => {
  if (currentPath.length === 0) return [];

  const newPath = currentPath.slice(0, -1);
  const parentNode = getNodeAtPath(tree, newPath);

  // If parent has children, point to the last child
  if (parentNode.children && parentNode.children.length > 0) {
    return [...newPath, parentNode.children.length];
  }

  return newPath;
};

/**
 * Validate tree structure
 */
export const isValidTree = (tree) => {
  if (!tree) return false;
  if (typeof tree.label !== 'string') return false;
  if (!Array.isArray(tree.children)) return false;
  return true;
};
