const EXAMPLES = [
  {
    id: 'simple-1',
    category: 'Simple Sentences',
    sentence: 'I kick the ball',
    complexity: 'easy',
    description: 'Basic SVO structure',
    tree: {
      id: 'n1', type: 'S', label: 'Sentence', word: null, children: [
        { id: 'n2', type: 'NP', label: 'Noun Phrase', word: null, children: [
          { id: 'n3', type: 'PRP', label: 'Pronoun', word: 'I', children: [] }
        ]},
        { id: 'n4', type: 'VP', label: 'Verb Phrase', word: null, children: [
          { id: 'n5', type: 'V', label: 'Verb', word: 'kick', children: [] },
          { id: 'n6', type: 'NP', label: 'Noun Phrase', word: null, children: [
            { id: 'n7', type: 'Det', label: 'Determiner', word: 'the', children: [] },
            { id: 'n8', type: 'N', label: 'Noun', word: 'ball', children: [] }
          ]}
        ]}
      ]
    }
  },
  {
    id: 'chomsky-1',
    category: 'Semantic Anomaly',
    sentence: 'Colorless green ideas sleep furiously',
    complexity: 'medium',
    description: 'Grammatically correct but semantically nonsensical (Chomsky 1957)',
    source: 'Syntactic Structures',
    tree: null,
  },
  {
    id: 'ambiguity-1',
    category: 'Ambiguous Sentences',
    sentence: 'I saw the man with a telescope',
    complexity: 'medium',
    description: 'PP attachment ambiguity (two valid interpretations)',
    ambiguities: 2,
    tree: null,
  },
  {
    id: 'recursion-1',
    category: 'Recursion',
    sentence: 'This is the house that Jack built',
    complexity: 'hard',
    description: 'Relative clause embedding',
    tree: null,
  },
];

export default function handler(req, res) {
  res.json({ examples: EXAMPLES });
}
