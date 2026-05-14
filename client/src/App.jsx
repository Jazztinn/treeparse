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
import styles from './App.module.css';

export default function App() {
  const {
    tree, selectedNodeId, setSelectedNodeId,
    addChild, createRoot, deleteNode, updateNode,
    undo, redo, canUndo, canRedo,
    loadTree, newTree,
  } = useTreeState();

  const { loading, error, aiParse, fetchExamples } = useAPICall();
  const [examples, setExamples] = useState([]);
  const [ambiguityData, setAmbiguityData] = useState(null);

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
    }
  }, [aiParse, loadTree]);

  function handleDropNode(parentId, payload) {
    if (parentId === null) {
      createRoot(payload);
    } else {
      addChild(parentId, payload);
    }
  }

  function handleAmbiguitySelect(selectedTree) {
    loadTree(selectedTree);
    setAmbiguityData(null);
  }

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <span className={styles.logo}>
          Tree<span className={styles.logoAccent}>Parse</span>
        </span>
        <span className={styles.subtitle}>Interactive Syntax Tree Visualizer</span>
      </header>

      <main className={styles.main}>
        <div className={styles.topRow}>
          <InputPanel onAIParse={handleAIParse} loading={loading} error={error} />
          <ControlBar
            tree={tree}
            onNewTree={newTree}
            onUndo={undo}
            onRedo={redo}
            canUndo={canUndo}
            canRedo={canRedo}
          />
        </div>

        <div className={styles.treeArea}>
          <TreeVisualizer
            tree={tree}
            selectedNodeId={selectedNodeId}
            onNodeClick={setSelectedNodeId}
            onDropNode={handleDropNode}
          />
        </div>

        <div className={styles.sidebar}>
          <TreeEditor
            tree={tree}
            selectedNodeId={selectedNodeId}
            onAddChild={addChild}
            onDelete={deleteNode}
            onUpdate={updateNode}
          />
          <NodePalette />
          <ExamplesLibrary
            examples={examples}
            onLoadExample={loadTree}
            onAIParse={handleAIParse}
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
