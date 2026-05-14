function validateNode(node, errors, path = 'root') {
  if (!node.id) errors.push(`Missing id at ${path}`);
  if (!node.type) errors.push(`Missing type at ${path}`);
  if (!node.label) errors.push(`Missing label at ${path}`);
  if (!Array.isArray(node.children)) errors.push(`Missing children array at ${path}`);

  const isLeaf = node.word !== null && node.word !== undefined && node.word !== '';
  if (isLeaf && node.children && node.children.length > 0) {
    errors.push(`Leaf node at ${path} should have empty children`);
  }
  if (!isLeaf && node.children && node.children.length === 0 && !node.word) {
    // Allow — editors can create empty non-terminal nodes
  }

  if (Array.isArray(node.children)) {
    node.children.forEach((child, i) => validateNode(child, errors, `${path}.children[${i}]`));
  }
}

function validateTree(tree) {
  const errors = [];
  if (!tree) {
    errors.push('Tree is null or undefined');
    return { valid: false, errors };
  }
  validateNode(tree, errors);
  return { valid: errors.length === 0, errors };
}

module.exports = { validateTree };
