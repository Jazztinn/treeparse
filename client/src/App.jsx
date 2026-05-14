import { useEffect, useState, useCallback } from 'react';
import { useTreeState } from './hooks/useTreeState';
import { useAPICall } from './hooks/useAPICall';
import TreeVisualizer from './components/TreeVisualizer';
import TreeEditor from './components/TreeEditor';
import InputPanel from './components/InputPanel';
import ControlBar from './components/ControlBar';
import ExamplesLibrary from './components/ExamplesLibrary';
import NodePalette from './components/NodePalette';
import AmbiguityPicker from './components/AmbiguityPicker';
import FloatingMenu from './components/FloatingMenu';
import { THEMES, getTheme } from './utils/themes';
import { findMainVerb } from './utils/treeUtils';
import { toPastParticiple, toIngForm } from './utils/verbForms';
import styles from './App.module.css';

export default function App() {
  const {
    tree, selectedNodeId, setSelectedNodeId,
    addChild, createRoot, transformTree, deleteNode, updateNode,
    undo, redo, canUndo, canRedo,
    loadTree, newTree,
  } = useTreeState();

  const { loading, error, aiParse, fetchExamples } = useAPICall();
  const [examples, setExamples] = useState([]);
  const [ambiguityData, setAmbiguityData] = useState(null);
  const [showExamples, setShowExamples] = useState(true);
  const [isPaletteOpen, setIsPaletteOpen] = useState(true);

  // Tool state
  const [activeTools, setActiveTools] = useState({
    unlock: false, pen: false, theme: false, annotate: false,
  });
  const [themeIndex, setThemeIndex] = useState(0);
  const [customPositions, setCustomPositions] = useState({});
  const [penPaths, setPenPaths] = useState([]);

  useEffect(() => {
    fetchExamples().then(setExamples);
  }, []);

  useEffect(() => {
    function handleKey(e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) { e.preventDefault(); undo(); }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) { e.preventDefault(); redo(); }
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [undo, redo]);

  const handleAIParse = useCallback(async (sentence) => {
    const result = await aiParse(sentence);
    if (!result) return;

    if (result.ambiguous && result.trees) {
      setAmbiguityData({ trees: result.trees, explanation: result.explanation });
    } else if (result.tree) {
      loadTree(result.tree);
      setCustomPositions({});
      setPenPaths([]);
    }
  }, [aiParse, loadTree]);

  function handleDropNode(parentId, payload) {
    if (parentId === null) {
      createRoot(payload);
      return;
    }

    // Aspect/voice chips: atomically (1) add the aspect node with its auxiliary
    // leaf, (2) conjugate the related main verb in the same tree pass.
    if (payload.special) {
      const auxWord = payload.special === 'perf' ? 'have' : 'be';
      const conjugate = payload.special === 'prog' ? toIngForm : toPastParticiple;

      transformTree((prev, { generateId }) => {
        const aspectLeafId = generateId();
        const aspectNodeId = generateId();
        const aspectNode = {
          id: aspectNodeId,
          type: payload.type,
          label: payload.label,
          word: null,
          children: [
            { id: aspectLeafId, type: 'Aux', label: 'Auxiliary', word: auxWord, children: [] },
          ],
        };

        // Walk the tree once: add aspectNode under parentId, then conjugate the
        // main V relative to parentId.
        function walk(node) {
          if (!node) return node;
          let children = node.children || [];
          if (node.id === parentId) {
            children = [...children, aspectNode];
          }
          return { ...node, children: children.map(walk) };
        }
        const withAspect = walk(prev);
        const mainV = findMainVerb(withAspect, parentId);
        if (!mainV || !mainV.word) return withAspect;
        function conjugateWalk(node) {
          if (!node) return node;
          if (node.id === mainV.id) {
            return { ...node, word: conjugate(node.word) };
          }
          return { ...node, children: (node.children || []).map(conjugateWalk) };
        }
        return conjugateWalk(withAspect);
      });
      return;
    }

    addChild(parentId, payload);
  }

  function handleAmbiguitySelect(selectedTree) {
    loadTree(selectedTree);
    setCustomPositions({});
    setPenPaths([]);
    setAmbiguityData(null);
  }

  function handleToggleTool(toolId) {
    if (toolId === 'theme') {
      setThemeIndex(i => (i + 1) % THEMES.length);
      return;
    }
    setActiveTools(prev => {
      // pen and annotate are mutually exclusive
      const next = { ...prev };
      if (toolId === 'pen') {
        next.pen = !prev.pen;
        if (next.pen) next.annotate = false;
      } else if (toolId === 'annotate') {
        next.annotate = !prev.annotate;
        if (next.annotate) next.pen = false;
      } else {
        next[toolId] = !prev[toolId];
      }
      return next;
    });
  }

  function handlePositionChange(nodeId, pos) {
    setCustomPositions(prev => ({ ...prev, [nodeId]: pos }));
  }

  function handleAnnotate(nodeId) {
    const current = (function find(n) {
      if (!n) return null;
      if (n.id === nodeId) return n;
      for (const c of n.children || []) { const f = find(c); if (f) return f; }
      return null;
    })(tree);
    const existing = current?.annotation || '';
    const text = window.prompt('Annotation for this node:', existing);
    if (text === null) return;
    updateNode(nodeId, { annotation: text.trim() || null });
  }

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <span className={styles.logo}>
          tree<span className={styles.logoAccent}>parse</span>
        </span>
      </header>

      <main className={styles.main}>
        <div className={styles.topRow}>
          <InputPanel
            onAIParse={handleAIParse}
            onBracketParse={(t) => { loadTree(t); setCustomPositions({}); setPenPaths([]); }}
            loading={loading}
            error={error}
          />
          <ControlBar
            tree={tree}
            onNewTree={() => { newTree(); setCustomPositions({}); setPenPaths([]); }}
            onUndo={undo}
            onRedo={redo}
            canUndo={canUndo}
            canRedo={canRedo}
            onShowExamples={() => setShowExamples(true)}
          />
        </div>

        <div className={styles.treeArea}>
          <div className={`${styles.paletteContainer} ${isPaletteOpen ? styles.open : styles.closed}`}>
            <button 
              className={styles.paletteToggle} 
              onClick={() => setIsPaletteOpen(!isPaletteOpen)}
              title={isPaletteOpen ? "Collapse Palette" : "Expand Palette"}
            >
              {isPaletteOpen ? '◀' : '▶'}
            </button>
            <div className={styles.paletteContent}>
              <NodePalette />
            </div>
          </div>

          <div className={styles.visualizerWrapper}>
            {showExamples && (
              <div className={styles.examplesOverlay}>
                <ExamplesLibrary
                  examples={examples}
                  onLoadExample={(t) => { loadTree(t); setCustomPositions({}); setPenPaths([]); }}
                  onAIParse={handleAIParse}
                  onClose={() => setShowExamples(false)}
                />
              </div>
            )}
            <TreeVisualizer
              tree={tree}
              selectedNodeId={selectedNodeId}
              onNodeClick={setSelectedNodeId}
              onDropNode={handleDropNode}
              unlocked={activeTools.unlock}
              penMode={activeTools.pen}
              annotateMode={activeTools.annotate}
              theme={getTheme(THEMES[themeIndex].id)}
              customPositions={customPositions}
              onPositionChange={handlePositionChange}
              penPaths={penPaths}
              onPenPathsChange={setPenPaths}
              onAnnotate={handleAnnotate}
              floatingMenu={<FloatingMenu activeTools={activeTools} onToggle={handleToggleTool} />}
            />
          </div>
        </div>

        <div className={styles.sidebar}>
          <TreeEditor
            tree={tree}
            selectedNodeId={selectedNodeId}
            onAddChild={addChild}
            onDelete={deleteNode}
            onUpdate={updateNode}
          />
        </div>
      </main>

      {ambiguityData && (
        <AmbiguityPicker
          trees={ambiguityData.trees}
          explanation={ambiguityData.explanation}
          onSelect={handleAmbiguitySelect}
          onClose={() => setAmbiguityData(null)}
        />
      )}
    </div>
  );
}
