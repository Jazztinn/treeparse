const express = require('express');
const router = express.Router();
const { validateTree } = require('../utils/treeValidator');

router.post('/', (req, res) => {
  const { tree } = req.body;
  const result = validateTree(tree);
  res.json(result);
});

module.exports = router;
