# TreeParse

A React application for visualizing hierarchical tree structures with interactive node management.

## Features

- **Interactive Tree Building**: Add nodes hierarchically to create custom tree structures
- **Multiple Visualization Modes**:
  - **Bubble Mode**: Visual representation with connected bubbles
  - **Bracket Mode**: Compact bracket notation display
- **Keyboard Navigation**: Use Enter to add nodes and Backspace to navigate up
- **Path Tracking**: Real-time display of your current position in the tree
- **Responsive Design**: Works seamlessly on desktop browsers

## Project Structure

```
treeparse/
├── components/
│   ├── BracketView.jsx      # Bracket mode visualization component
│   ├── BubbleView.jsx       # Bubble mode visualization component
│   └── ErrorBoundary.jsx    # Error boundary for graceful error handling
├── pages/
│   └── TreeParse.jsx        # Main page component with state management
├── styles/
│   └── treeStyles.js        # Centralized style definitions
├── utils/
│   └── treeUtils.js         # Tree manipulation utility functions
├── mainpage.jsx             # Entry point component
├── main.jsx                 # React DOM root
├── index.html               # HTML template
├── vite.config.js           # Vite configuration
└── package.json             # Dependencies and scripts
```

## Getting Started

### Prerequisites
- Node.js 16+ and npm

### Installation

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5174/` (or the port displayed in terminal if 5174 is in use).

### Building for Production

```bash
npm run build
```

## Usage

1. **Start Typing**: Enter a node label in the input field and press Enter
2. **Navigate Down**: Click Enter to add child nodes
3. **Navigate Up**: Press Backspace without any input to go back to the parent node
4. **Switch Views**: Toggle between Bubble and Bracket visualization modes
5. **Clear Tree**: Click "Clear tree" button to reset everything

## Architecture

### State Management

The app uses React hooks (`useState`) for state management:
- `tree`: The hierarchical tree structure
- `currentPath`: Array tracking position in the tree
- `input`: Current input value
- `mode`: Active visualization mode

### Tree Utilities

The `treeUtils.js` file provides pure functions for tree operations:
- `getNodeAtPath()`: Safely retrieve a node at any path
- `addNodeAtPath()`: Immutably add nodes to the tree
- `getParentPath()`: Calculate parent path navigation
- `isValidTree()`: Validate tree structure

### Styling

All styles are extracted to `treeStyles.js` using CSS-in-JS, making the app themeable through CSS variables:
- `--color-text-primary`
- `--color-background-secondary`
- `--border-radius-md`
- And more...

## Error Handling

The app includes an `ErrorBoundary` component that catches rendering errors and provides users with recovery options.

## Future Enhancements

- [ ] Export/import tree data as JSON
- [ ] Undo/redo functionality
- [ ] Edit existing nodes
- [ ] Delete individual nodes
- [ ] Persistence (localStorage)
- [ ] Dark mode support
- [ ] Tree search functionality
