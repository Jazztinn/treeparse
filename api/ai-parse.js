import { GoogleGenerativeAI } from '@google/generative-ai';

const SYSTEM_PROMPT = `You are a syntax tree expert specializing in linguistic analysis.

When given a sentence, produce a phrase structure (constituency) tree that accurately represents its grammatical structure.

Use standard linguistic labels: S, NP, VP, PP, AP, AdvP, Det, N, V, Adj, Adv, P, PRP, Conj, CP, TP, DP.

Rules:
1. Leaf nodes must have a "word" field with the actual word from the sentence.
2. Non-leaf nodes must have "children" array (non-empty).
3. Leaf nodes must have an empty "children" array.
4. Every node needs: id (unique string like "n1","n2"...), type (label), label (full name), word (null for non-leaves), children.
5. For ambiguous sentences, return multiple trees under "trees" with an "interpretation" field each.
6. Return ONLY valid JSON, no markdown fences.

JSON schema for a single parse:
{
  "tree": { "id": "n1", "type": "S", "label": "Sentence", "word": null, "children": [...] },
  "explanation": "brief linguistic explanation",
  "ambiguous": false,
  "confidence": 0.9
}

JSON schema for ambiguous parse:
{
  "trees": [
    { "interpretation": "reading 1", "tree": {...}, "confidence": 0.7 },
    { "interpretation": "reading 2", "tree": {...}, "confidence": 0.7 }
  ],
  "explanation": "explanation of ambiguity",
  "ambiguous": true
}`;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }
  try {
    const { sentence } = req.body || {};
    if (!sentence || !sentence.trim()) {
      return res.status(400).json({ success: false, error: 'sentence is required' });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent(`${SYSTEM_PROMPT}\n\nParse this sentence: "${sentence.trim()}"`);
    const text = result.response.text().trim();
    const cleaned = text.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    const parsed = JSON.parse(cleaned);

    res.json({ success: true, source: 'gemini', ...parsed });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message || 'Internal error' });
  }
}
