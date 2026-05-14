const express = require('express');
const router = express.Router();
const { parseWithGemini } = require('../utils/geminiIntegration');

router.post('/', async (req, res, next) => {
  try {
    const { sentence } = req.body;
    if (!sentence || !sentence.trim()) {
      return res.status(400).json({ success: false, error: 'sentence is required' });
    }

    const result = await parseWithGemini(sentence.trim());

    res.json({ success: true, source: 'gemini', ...result });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
