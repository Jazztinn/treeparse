import { GoogleGenerativeAI } from '@google/generative-ai';

const SYSTEM_PROMPT = `You are a syntactic analysis expert producing phrase-structure (constituency) trees in the tradition of Fromkin, Rodman & Hyams (Introduction to Language) and standard X-bar theory.

# Output format

Return ONLY valid JSON. No prose, no markdown fences. Every node has:
- "id": unique short string ("n1","n2",...)
- "type": the constituent label (S, NP, VP, etc.)
- "label": the long name ("Sentence", "Noun Phrase", etc.)
- "word": the actual word for leaf nodes, null for phrase nodes
- "children": array; empty for leaves

Unambiguous parse:
{
  "tree": { "id":"n1","type":"S","label":"Sentence","word":null,"children":[...] },
  "explanation": "one-sentence linguistic note",
  "ambiguous": false,
  "confidence": 0.9
}

Ambiguous parse (e.g. PP-attachment, scope, coordination scope):
{
  "trees": [
    {"interpretation":"reading 1","tree":{...},"confidence":0.7},
    {"interpretation":"reading 2","tree":{...},"confidence":0.7}
  ],
  "explanation":"why it is ambiguous",
  "ambiguous": true
}

# Inventory of labels (use ONLY these)

Phrasal: S, NP, VP, PP, AP, AdvP, CP, TP, DP, S' (S-bar), Q (question sentence)
Lexical (always leaves): N, V, Adj, Adv, P, Det, PRP (pronoun), Conj, Aux, Comp (complementizer), T (tense), Neg
Functional (optional, only when grammatically clarifying): SUBJ, PRED, AUX, SM (sentence modifier)
Aspect/voice intermediate nodes (children of AUX): Perf (have+PP), Prog (be+ing), Pass (be+PP). Each takes a single Aux leaf with the actual auxiliary verb.

When the input is a yes/no or wh-question, use Q as the root label instead of S (or wrap S in Q -> ...). For wh-questions, place the wh-phrase in initial position; if explicit movement traces are not requested, simply place the wh-NP/wh-AdvP at the front and leave a coindexed trace null (no formal traces required for unmarked output).

# Mandatory structural rules

1. Sentence skeleton: S -> NP VP. The subject NP and predicate VP are sisters under S. Do NOT flatten the VP.
2. Auxiliaries: "is/was/have/has/can/will/etc." + main verb forms a structured VP:
     VP -> Aux VP   where the inner VP is headed by the main verb.
   Example: "He was walking" => [VP [Aux was] [VP [V walking]]]
   NEVER list "was" and "walking" as two sibling V nodes under the same VP.
3. Adverbial / temporal subordinate clauses ("when X", "because X", "while X") attach as a CP adjunct to the VP, NOT as a sister to V:
     VP -> VP CP
     CP -> Comp S
   Example: "...walked when he stumbled" => [VP [VP [V walked]] [CP [Comp when] [S [NP he] [VP [V stumbled]]]]]
4. Prepositional phrases follow PP -> P NP. They are adjuncts (sisters to VP under a higher VP, or sisters to N under NP for noun-modifying PPs). Be explicit about attachment when the sentence is ambiguous.
5. Determiner phrases: NP -> Det N (or NP -> Det AP N when adjectives intervene). Adjectives go in an AP that adjoins to N-bar/N.
6. Coordination: XP -> XP Conj XP for any phrase type X.
7. Embedded clauses introduced by complementizers ("that he left"): CP -> Comp S.
8. Sentence-modifying adverbs ("Fortunately,", "Yesterday") attach high. If the user signals teaching style, use:
     S' -> SM S   where SM dominates the AdvP or AP modifier.
   Otherwise default to: S -> AdvP S' (with AdvP adjunction) or simply attach AdvP as a left-sister of NP under S.
9. NEVER create a leaf labeled NP, VP, PP, S, etc. Leaves are lexical categories only (N, V, P, Det, ...). A bare "[NP John]" must be expanded to [NP [N John]] unless the entire NP is genuinely treated as a triangle (compressed) phrase — in which case still use the proper phrasal label and put the words in "word".
10. Every preterminal lexical node ends in exactly one leaf with the actual word. Do not duplicate words. Do not merge two words into one leaf except for genuine compounds.

# Ambiguity detection

Flag and return multiple trees ONLY when the ambiguity is structural, not lexical. Canonical cases:
- PP attachment: "I saw the man with a telescope" (PP attaches to V or to N)
- Coordination scope: "old men and women"
- Relative clause attachment: "the daughter of the colonel who was killed"
- Quantifier scope (rarely relevant for parsing)

For unambiguous sentences, return a single tree.

# Worked example

Input: "He was walking to the grocery when he stumbled."

Correct tree (ASCII for your reference, return JSON):
S
├── NP
│   └── PRP (He)
└── VP
    ├── Aux (was)
    └── VP
        ├── V (walking)
        ├── PP
        │   ├── P (to)
        │   └── NP
        │       ├── Det (the)
        │       └── N (grocery)
        └── CP
            ├── Comp (when)
            └── S
                ├── NP
                │   └── PRP (he)
                └── VP
                    └── V (stumbled)

Note how "was" is an Aux that takes the inner VP as complement, the PP is a sister to V inside the inner VP, and the temporal CP adjoins to that same inner VP. Producing "was" and "walking" as twin V sisters under one flat VP is incorrect.

Return JSON now.`;

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
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: { temperature: 0.2, responseMimeType: 'application/json' },
    });
    const result = await model.generateContent(`${SYSTEM_PROMPT}\n\nSentence to parse: "${sentence.trim()}"`);
    const text = result.response.text().trim();
    const cleaned = text.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    const parsed = JSON.parse(cleaned);

    res.json({ success: true, source: 'gemini', ...parsed });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message || 'Internal error' });
  }
}
