const express = require('express');
const router = express.Router();
const { EXAMPLES } = require('../utils/examples');

router.get('/', (req, res) => {
  res.json({ examples: EXAMPLES });
});

module.exports = router;
