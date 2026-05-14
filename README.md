# TreeParse

An interactive syntax tree visualizer for linguistics students, educators, and researchers. TreeParse renders phrase-structure trees from natural sentences or labelled bracket notation, supports manual editing and annotation, and exports finished diagrams as PNG.

Live demo: https://treeparse-ten.vercel.app

Dedicated to my girlfriend, Ace.

Watch it in action:
<div align="center">
  <a href="https://www.youtube.com/watch?v=gy6jnfXovTc">
    <img src="https://img.youtube.com/vi/gy6jnfXovTc/0.jpg" alt="TreeParse Demo" style="width:100%;">
  </a>
</div>

## Features

- Render phrase-structure trees as SVG with automatic hierarchical layout
- Two parsing modes:
  - **Labelled bracket notation** — instant client-side parsing for input like `[S [NP [PRP I]] [VP [V kick] [NP [Det the] [N ball]]]]`
  - **AI parsing** — sentence-level parsing via the Gemini API, with multi-interpretation support for ambiguous sentences
- Drag-and-drop node palette for building or augmenting trees by hand
- Live node editor with type, label, word, and triangle-leaf toggles
- Free-positioning mode — unlock nodes and drag them anywhere on the canvas
- Pen tool for annotating trees with freehand drawings (movement arrows, traces, etc.)
- Per-node text annotations
- Five built-in themes
- Undo/redo with keyboard shortcuts (Cmd/Ctrl+Z, Cmd/Ctrl+Y)
- PNG export
- Example library with classic linguistic sentences (Chomsky's *Colorless green ideas*, PP-attachment ambiguity, garden-path sentences, etc.)
- Responsive layout for mobile and tablet

## Tech stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Vite, CSS Modules |
| Backend (dev) | Node.js, Express |
| Backend (production) | Vercel serverless functions |
| AI parsing | Google Gemini API (`gemini-2.5-flash`) |
| Hosting | Vercel |

## Project structure

```
treeparse/
├── api/                          # Vercel serverless functions (production backend)
│   ├── ai-parse.js               # POST /api/ai-parse — Gemini-powered parsing
│   └── examples.js               # GET  /api/examples  — preloaded examples
├── client/                       # React frontend
│   ├── public/
│   │   ├── logo.png              # Favicon and app icon
│   │   └── sunflower.png         # Decorative background
│   └── src/
│       ├── components/           # React components (one folder per component + .module.css)
│       ├── hooks/                # useTreeState, useAPICall
│       ├── utils/                # bracketParser, treeLayout, treeUtils, themes, exportPNG
│       ├── assets/fonts/         # Borel-Regular.ttf for the brand mark
│       ├── App.jsx
│       └── index.css
├── server/                       # Local Express server (mirrors /api functions for dev)
│   ├── routes/
│   ├── utils/
│   └── index.js
├── vercel.json                   # Vercel build + routing config
└── package.json                  # Root manifest (concurrently for dev, Gemini SDK for functions)
```

## Local development

### Prerequisites

- Node.js 18 or higher
- npm
- A Google Gemini API key (free tier available at https://aistudio.google.com)

### Setup

```bash
git clone https://github.com/Jazztinn/treeparse.git
cd treeparse

# Install root dependencies (used by serverless functions)
npm install

# Install client and server dependencies
npm install --prefix client
npm install --prefix server

# Configure the Gemini API key for the local Express server
echo "GEMINI_API_KEY=your_key_here" > server/.env
echo "PORT=3000" >> server/.env
```

### Running

```bash
npm run dev
```

This starts both processes concurrently:

- Frontend (Vite) at http://localhost:5173
- Backend (Express) at http://localhost:3000

The frontend automatically uses `http://localhost:3000/api` in development and `/api` (relative) in production. No additional configuration is required.

To run them individually:

```bash
npm run dev:client
npm run dev:server
```

## Bracket notation reference

TreeParse parses standard labelled bracket notation. The format is `[LABEL children...]`, where children may be other bracketed nodes or terminal words. Examples:

```
[S [NP [PRP I]] [VP [V kick] [NP [Det the] [N ball]]]]

[TP [NP John] [T' [T did] [VP [V eat] [NP bread]]]]

[NP The big dog]
```

Whitespace inside brackets is ignored. Detection is automatic: if the input begins with `[`, the **Parse Brackets** button activates and parses locally without invoking the API.

## API endpoints

In production, both endpoints are served by Vercel serverless functions at the same origin as the frontend. In development, they are served by Express on port 3000.

### `POST /api/ai-parse`

Sends a sentence to Gemini for syntactic analysis.

Request body:
```json
{ "sentence": "I saw the man with a telescope" }
```

Response (unambiguous):
```json
{
  "success": true,
  "source": "gemini",
  "tree": { "id": "n1", "type": "S", "label": "Sentence", "word": null, "children": [...] },
  "explanation": "...",
  "ambiguous": false,
  "confidence": 0.9
}
```

Response (ambiguous):
```json
{
  "success": true,
  "source": "gemini",
  "trees": [
    { "interpretation": "...", "tree": {...}, "confidence": 0.7 },
    { "interpretation": "...", "tree": {...}, "confidence": 0.7 }
  ],
  "explanation": "...",
  "ambiguous": true
}
```

### `GET /api/examples`

Returns the preloaded example library.

## Deployment (Vercel)

1. Push the repository to GitHub.
2. Sign in to https://vercel.com and import the repository.
3. On the configuration screen, leave the framework preset as **Other**. The included `vercel.json` handles the build and routing.
4. Under **Environment Variables**, add:

   | Name | Value | Environments |
   |------|-------|--------------|
   | `GEMINI_API_KEY` | your Gemini API key | Production, Preview, Development |

5. Click **Deploy**. Vercel will:
   - Install root dependencies (for the serverless functions)
   - Build the client with Vite (`client/dist`)
   - Register `api/ai-parse.js` and `api/examples.js` as serverless endpoints
   - Serve the static frontend

Subsequent pushes to the `main` branch redeploy automatically. Pull requests receive their own preview deployments.

## Keyboard shortcuts

| Shortcut | Action |
|----------|--------|
| Cmd/Ctrl + Z | Undo |
| Cmd/Ctrl + Y | Redo |
| Cmd/Ctrl + Shift + Z | Redo (alternate) |
| Enter (in input field) | Parse |

## Browser support

Modern evergreen browsers (Chrome, Firefox, Safari, Edge). Backdrop-filter is used extensively for the glass UI; Safari 14+ and equivalent are required for the full visual effect.

## License

ISC

## References

- Fromkin, V., Rodman, R., & Hyams, N. (2003). *An Introduction to Language* (7th ed.). Thomson Wadsworth.
- Chomsky, N. (1957). *Syntactic Structures*. Mouton.
- Hauser, M. D., Chomsky, N., & Fitch, W. T. (2002). The faculty of language: What is it, who has it, and how did it evolve? *Science, 298*(5598), 1569–1579.
