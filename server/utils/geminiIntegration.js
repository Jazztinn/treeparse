const { GoogleGenerativeAI } = require('@google/generative-ai');
const { SYSTEM_PROMPT } = require('./prompt');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function parseWithGemini(sentence) {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const prompt = `${SYSTEM_PROMPT}\n\nParse this sentence: "${sentence}"`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();

  // Strip markdown fences if present
  const cleaned = text.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');

  const parsed = JSON.parse(cleaned);
  return parsed;
}

module.exports = { parseWithGemini };
