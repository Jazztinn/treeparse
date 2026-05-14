# Syntax Tree Visualizer — Complete Project Specification

## 1. Project Overview

**Purpose:** Interactive syntax tree builder and visualizer for students, professors, and linguists to understand and manipulate grammatical structure.

**Target Users:**
- Linguistics students learning syntax
- Professors teaching grammar/syntax
- Linguists analyzing sentence structure
- Anyone studying language structure

**Core Value Proposition:**
- Visualize sentences as hierarchical syntax trees (phrase structure & dependency)
- Manually build trees node-by-node with interactive editor
- AI-powered automatic parsing (Claude API) for complex sentences
- Resolve ambiguous sentences by showing multiple tree interpretations
- Support recursive/infinitely-nested structures
- Educational examples library with famous linguistic examples

---

## 2. Tech Stack

### Frontend
- **React 18+** (Vite bundler for fast development)
- **SVG** for tree visualization (no heavy charting library)
- **React Query** (optional, for API caching)
- **CSS Modules** or **Tailwind CSS** for styling
- **React DnD** (optional, for drag-drop if we want it)

### Backend
- **Node.js + Express** (simple, lightweight)
- **Anthropic SDK** for Claude API integration
- **CORS** for frontend communication
- **dotenv** for environment variables

### Deployment (Future)
- Frontend: Vercel or Netlify
- Backend: Render, Railway, or AWS Lambda

---

## 3. Project Structure

```
syntax-tree-visualizer/
├── client/                          # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── TreeVisualizer.jsx          # Main SVG tree display
│   │   │   ├── TreeEditor.jsx              # Interactive node editor
│   │   │   ├── InputPanel.jsx              # Sentence input & AI toggle
│   │   │   ├── ControlBar.jsx              # Tree type, zoom, export
│   │   │   ├── ExamplesLibrary.jsx         # Pre-loaded examples
│   │   │   └── NodeContextMenu.jsx         # Right-click menu
│   │   ├── hooks/
│   │   │   ├── useTreeState.js             # Tree state management
│   │   │   ├── useAPICall.js               # API communication
│   │   │   └── useSVGDimensions.js         # Responsive SVG sizing
│   │   ├── utils/
│   │   │   ├── treeUtils.js                # Tree manipulation
│   │   │   ├── treeToSVG.js                # Render tree to SVG
│   │   │   ├── exportUtils.js              # JSON/PNG export
│   │   │   └── examples.js                 # Example sentences
│   │   ├── styles/
│   │   │   └── tree.css                    # Tree styling
│   │   ├── App.jsx
│   │   └── index.jsx
│   ├── package.json
│   └── vite.config.js
│
├── server/                          # Express backend
│   ├── routes/
│   │   ├── parse.js                 # POST /api/parse
│   │   ├── validate.js              # POST /api/validate
│   │   └── aiParse.js               # POST /api/ai-parse
│   ├── utils/
│   │   ├── treeBuilder.js           # Basic parsing logic
│   │   ├── claudeIntegration.js     # Claude API calls
│   │   ├── treeValidator.js         # Validate tree structures
│   │   └── prompt.js                # System prompts for Claude
│   ├── middleware/
│   │   └── errorHandler.js
│   ├── index.js                     # Express server setup
│   ├── .env.example
│   └── package.json
│
├── docs/
│   ├── API.md                       # API documentation
│   └── LINGUISTIC_REFERENCE.md      # Linguistic terminology guide
│
└── README.md
```

---

## 4. Core Data Structures

### Phrase Structure Tree (Constituency)

```json
{
  "id": "node-1",
  "type": "S",
  "label": "Sentence",
  "word": null,
  "gloss": "Complete sentence",
  "children": [
    {
      "id": "node-2",
      "type": "NP",
      "label": "Noun Phrase",
      "word": null,
      "gloss": "Noun phrase: the subject",
      "children": [
        {
          "id": "node-3",
          "type": "PRP",
          "label": "Pronoun",
          "word": "I",
          "gloss": "First person pronoun",
          "children": []
        }
      ]
    },
    {
      "id": "node-4",
      "type": "VP",
      "label": "Verb Phrase",
      "word": null,
      "gloss": "Verb phrase: the predicate",
      "children": [
        {
          "id": "node-5",
          "type": "V",
          "label": "Verb",
          "word": "kick",
          "gloss": "Action verb",
          "children": []
        },
        {
          "id": "node-6",
          "type": "NP",
          "label": "Noun Phrase",
          "word": null,
          "gloss": "Direct object",
          "children": [
            {
              "id": "node-7",
              "type": "Det",
              "label": "Determiner",
              "word": "the",
              "gloss": "Definite article",
              "children": []
            },
            {
              "id": "node-8",
              "type": "N",
              "label": "Noun",
              "word": "ball",
              "gloss": "Common noun",
              "children": []
            }
          ]
        }
      ]
    }
  ]
}
```

### Dependency Tree

```json
{
  "nodes": [
    { "id": 0, "word": "I", "pos": "PRP", "lemma": "I" },
    { "id": 1, "word": "kick", "pos": "VB", "lemma": "kick" },
    { "id": 2, "word": "the", "pos": "DET", "lemma": "the" },
    { "id": 3, "word": "ball", "pos": "NN", "lemma": "ball" }
  ],
  "edges": [
    { "from": 1, "to": 0, "relation": "nsubj" },
    { "from": 1, "to": 3, "relation": "obj" },
    { "from": 3, "to": 2, "relation": "det" }
  ]
}
```

---

## 5. API Endpoints

### 1. POST `/api/parse`
Parse a sentence using basic rule-based logic.

**Request:**
```json
{
  "sentence": "I kick the ball",
  "treeType": "phrase"
}
```

**Response:**
```json
{
  "success": true,
  "tree": { /* phrase structure tree JSON */ },
  "source": "rule-based",
  "confidence": 0.8
}
```

---

### 2. POST `/api/ai-parse`
Parse using Claude API (handles complex/ambiguous sentences).

**Request:**
```json
{
  "sentence": "I saw the man with a telescope",
  "treeType": "phrase",
  "context": "Show both possible interpretations"
}
```

**Response:**
```json
{
  "success": true,
  "trees": [
    {
      "interpretation": "I used a telescope to see the man",
      "tree": { /* tree JSON */ },
      "confidence": 0.7
    },
    {
      "interpretation": "I saw a man who was holding a telescope",
      "tree": { /* tree JSON */ },
      "confidence": 0.7
    }
  ],
  "source": "claude-api",
  "explanation": "This sentence is ambiguous based on PP attachment..."
}
```

---

### 3. POST `/api/validate`
Validate user-built tree structure.

**Request:**
```json
{
  "tree": { /* tree JSON */ }
}
```

**Response:**
```json
{
  "valid": true,
  "errors": [],
  "warnings": ["Consider labeling this node as 'Adjective Phrase'"]
}
```

---

### 4. GET `/api/examples`
Fetch pre-loaded example sentences.

**Response:**
```json
{
  "examples": [
    {
      "id": "chomsky-1",
      "sentence": "Colorless green ideas sleep furiously",
      "description": "Grammatically correct but semantically nonsensical",
      "author": "Noam Chomsky (1957)",
      "treeType": "phrase",
      "tree": { /* pre-built tree */ }
    },
    {
      "id": "telescope",
      "sentence": "I saw the man with a telescope",
      "description": "Ambiguous PP attachment - two valid interpretations",
      "interpretations": [
        { "tree": {...}, "meaning": "..." },
        { "tree": {...}, "meaning": "..." }
      ]
    }
  ]
}
```

---

## 6. Frontend Components

### TreeVisualizer Component
```jsx
<TreeVisualizer 
  tree={treeData}
  onNodeClick={handleNodeClick}
  onNodeHover={handleNodeHover}
  showLabels={true}
  zoomLevel={1}
  highlightedNode={selectedNodeId}
/>
```

**Features:**
- Render tree as SVG with hierarchical layout
- Click nodes to select/highlight
- Hover to show full label + gloss
- Support zoom/pan
- Color-code by node type (optional)
- Responsive to window size

### TreeEditor Component
```jsx
<TreeEditor 
  tree={treeData}
  onChange={handleTreeChange}
  selectedNodeId={selectedNodeId}
/>
```

**Features:**
- Add child node to selected node
- Delete node (with confirmation)
- Edit node label/word/type
- Drag to reorder children
- Form interface for node details
- Undo/redo (optional)

### InputPanel Component
```jsx
<InputPanel
  onParse={handleParse}
  onAIParse={handleAIParse}
  aiEnabled={aiEnabled}
  loading={isLoading}
  treeType={treeType}
/>
```

**Features:**
- Text input for sentence
- Submit button
- AI toggle (checkbox)
- Tree type selector (radio: Phrase / Dependency)
- Loading spinner during parsing

### ControlBar Component
```jsx
<ControlBar
  treeType={treeType}
  onTreeTypeChange={setTreeType}
  onZoomIn={zoomIn}
  onZoomOut={zoomOut}
  onExport={exportTree}
  onShowLabels={toggleLabels}
/>
```

**Features:**
- Tree type toggle
- Zoom in/out buttons
- Export buttons (JSON, PNG)
- Show/hide labels toggle

### ExamplesLibrary Component
```jsx
<ExamplesLibrary
  examples={examples}
  onLoadExample={loadExample}
/>
```

**Features:**
- Searchable list of examples
- Click to load example
- Show description + source
- Filter by topic/type

---

## 7. Linguistic Reference Data

### Standard Labels (Constituency)

| Label | Meaning | Example |
|-------|---------|---------|
| S | Sentence | Complete clause |
| NP | Noun Phrase | "the big dog" |
| VP | Verb Phrase | "quickly ran away" |
| PP | Prepositional Phrase | "on the table" |
| AP | Adjective Phrase | "very happy" |
| AdvP | Adverb Phrase | "quite slowly" |
| Det | Determiner | "the", "a", "this" |
| N | Noun | "dog", "table" |
| V | Verb | "run", "jump" |
| Adj | Adjective | "big", "red" |
| Adv | Adverb | "quickly", "very" |
| P | Preposition | "on", "in", "at" |
| PRP | Pronoun | "I", "he", "she" |
| Conj | Conjunction | "and", "or" |

### Dependency Relations

| Relation | Meaning |
|----------|---------|
| nsubj | Nominal subject |
| obj | Direct object |
| iobj | Indirect object |
| det | Determiner |
| amod | Adjectival modifier |
| advmod | Adverbial modifier |
| case | Case marking (preposition) |
| nmod | Nominal modifier |
| root | Root of sentence |
| cc | Coordinating conjunction |
| conj | Conjunct |

---

## 8. Example Sentences (Pre-loaded Library)

```javascript
const EXAMPLES = [
  {
    id: "simple-1",
    category: "Simple Sentences",
    sentence: "I kick the ball",
    complexity: "easy",
    description: "Basic SVO structure",
  },
  {
    id: "chomsky-1",
    category: "Semantic Anomaly",
    sentence: "Colorless green ideas sleep furiously",
    complexity: "medium",
    description: "Grammatically correct but semantically nonsensical (Chomsky 1957)",
    source: "Syntactic Structures",
  },
  {
    id: "ambiguity-1",
    category: "Ambiguous Sentences",
    sentence: "I saw the man with a telescope",
    complexity: "medium",
    description: "PP attachment ambiguity - two valid interpretations",
    ambiguities: 2,
  },
  {
    id: "recursion-1",
    category: "Recursion",
    sentence: "This is the house that Jack built",
    complexity: "hard",
    description: "Relative clause embedding",
  },
  {
    id: "recursion-2",
    category: "Recursion",
    sentence: "The rat the cat the dog chased ate cheese",
    complexity: "hard",
    description: "Center-embedded relative clauses (garden path sentence)",
  },
];
```

---

## 9. Backend Claude Prompt

```javascript
const CLAUDE_SYSTEM_PROMPT = `You are a syntax tree expert specializing in linguistic analysis.

When given a sentence, produce a detailed phrase structure or dependency tree that accurately represents the grammatical structure of the sentence.

Requirements:
1. Use standard linguistic labels (S, NP, VP, PP, Det, N, V, Adj, Adv, etc.)
2. Show hierarchical relationships clearly
3. For ambiguous sentences, identify all valid interpretations and explain the differences
4. Always return valid JSON that matches the tree schema provided
5. Include a brief linguistic explanation of the structure
6. Handle complex, nested, and recursive structures accurately
7. Point out interesting linguistic phenomena (center embedding, coordination, etc.)

For phrases and clause attachment, show how they modify other constituents and why you chose that attachment point.

Return your response as JSON with this structure:
{
  "tree": { /* the tree object */ },
  "explanation": "Brief explanation of the structure and any interesting linguistic features",
  "ambiguities": ["list of alternative interpretations if applicable"],
  "confidence": 0.9
}`;
```

---

## 10. State Management (React)

**Global state (useContext or simple useState):**

```javascript
const initialState = {
  tree: null,                      // Current tree structure
  treeType: 'phrase',             // 'phrase' or 'dependency'
  selectedNodeId: null,           // Currently selected node
  aiEnabled: false,               // Toggle AI parsing
  examples: [],                   // Pre-loaded examples
  history: [],                    // Undo/redo stack
  loading: false,                 // API call in progress
  error: null,                    // Error message if any
};

// Actions
const actions = {
  SET_TREE,
  UPDATE_TREE,
  SET_TREE_TYPE,
  SELECT_NODE,
  DELETE_NODE,
  ADD_NODE,
  TOGGLE_AI,
  LOAD_EXAMPLE,
  RESET_TREE,
  UNDO,
  REDO,
  SET_LOADING,
  SET_ERROR,
};
```

---

## 11. MVP Checklist

### Phase 1: Core Visualization
- [ ] TreeVisualizer SVG component renders basic tree
- [ ] Node layout algorithm (hierarchical spacing)
- [ ] Hover/click interactions
- [ ] Responsive sizing

### Phase 2: Interactive Editing
- [ ] Add child node
- [ ] Delete node
- [ ] Edit node label
- [ ] Reorder children (drag or form)
- [ ] Undo/redo basic operations

### Phase 3: Backend & API
- [ ] Express server setup
- [ ] Basic `/api/parse` endpoint with rule-based logic
- [ ] `/api/validate` endpoint
- [ ] CORS configured
- [ ] Error handling

### Phase 4: Claude Integration
- [ ] Claude API key setup
- [ ] `/api/ai-parse` endpoint
- [ ] Prompt engineering for syntax trees
- [ ] Response parsing and validation

### Phase 5: Frontend-Backend Connection
- [ ] API hooks in React
- [ ] Connect InputPanel to `/api/parse`
- [ ] Connect to `/api/ai-parse` with toggle
- [ ] Display parsed tree in TreeVisualizer
- [ ] Error handling and loading states

### Phase 6: Examples Library
- [ ] Load examples from backend/static
- [ ] ExamplesLibrary component
- [ ] Click to load example into visualizer
- [ ] Display descriptions and sources

### Phase 7: Export & Polish
- [ ] Export tree as JSON
- [ ] Export tree as PNG/SVG
- [ ] ControlBar fully functional
- [ ] Styling and UX polish
- [ ] Mobile responsiveness (if needed)

---

## 12. Setup Instructions

### Prerequisites
- Node.js 16+
- npm or yarn
- Anthropic API key (for Claude access)

### Installation

```bash
# Clone/create project
git clone <repo> && cd syntax-tree-visualizer

# Install root dependencies
npm install

# Setup client
cd client
npm install
# Create .env.local (not needed unless you want custom API URL)

# Setup server
cd ../server
npm install
cp .env.example .env
# Edit .env and add ANTHROPIC_API_KEY=sk-...

# Start development
cd ..
npm run dev
# Frontend runs on http://localhost:5173
# Backend runs on http://localhost:3000
```

---

## 13. Development Workflow

1. **Start with TreeVisualizer** — Get the visual rendering right first
2. **Add TreeEditor interactions** — Build interactivity on top
3. **Build backend endpoints** — Create API structure
4. **Wire frontend → backend** — Connect components to API
5. **Integrate Claude** — Add AI parsing
6. **Polish & optimize** — UX refinements, performance

---

## 14. Nice-to-Haves (Phase 2+)

- [ ] Save/load trees from localStorage
- [ ] Share trees as URL (JSON in query string)
- [ ] Side-by-side tree comparison (ambiguity visualization)
- [ ] Tree editing: drag-drop reordering
- [ ] Keyboard shortcuts (Ctrl+Enter to parse, Del to delete, etc.)
- [ ] Dark mode
- [ ] Explain tree button (Claude explains the structure)
- [ ] Convert between phrase and dependency on the fly
- [ ] Batch parsing (upload file of sentences)
- [ ] Statistics (average depth, branching factor, etc.)

---

## 15. Notes & Considerations

### Linguistic Accuracy
- Different linguists use different notations. Make it flexible.
- Dependency vs. constituency are fundamentally different (not just visual).
- Support both but keep them separate in code.

### AI Limitations
- Claude is great at syntax but may make occasional mistakes.
- Always validate output structure before rendering.
- Show confidence scores for AI-generated trees.

### SVG Rendering
- Use d3-hierarchy or hand-rolled layout algorithm for tree positioning
- Avoid heavy dependencies; keep it lightweight
- SVG scales well, no canvas needed

### Performance
- Memoize TreeVisualizer to avoid re-renders
- Lazy-load examples library
- Debounce input while typing

---

## 16. Testing (Future)

```javascript
// Example tests to write:
- TreeVisualizer renders without errors
- Adding a node updates tree structure correctly
- AI parse returns valid tree JSON
- Export to PNG works
- Example library loads correctly
- Tree validation catches errors
```

---

## References

- Fromkin, V., Rodman, R., & Hyams, N. (2003). *An introduction to language* (7th Ed). Thomson Wadsworth.
- Hauser, M. D., Chomsky, N., & Fitch, W. T. (2002). The faculty of language: What is it, who has it, and how did it evolve? *Science, 298*(5598), 1569–1579.
- Chomsky, N. (1957). *Syntactic Structures*. Mouton.

---

**Status:** Ready for Claude Code implementation
**Last Updated:** 2026-05-14
