import { treeToJSON } from '../utils/treeUtils';
import styles from './ControlBar.module.css';

export default function ControlBar({ tree, onNewTree, onUndo, onRedo, canUndo, canRedo }) {
  function handleExportJSON() {
    if (!tree) return;
    const json = treeToJSON(tree);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'syntax-tree.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className={styles.bar}>
      <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={onNewTree}>
        New Tree
      </button>
      <div className={styles.separator} />
      <button className={styles.btn} onClick={onUndo} disabled={!canUndo} title="Undo (Ctrl+Z)">
        ↩ Undo
      </button>
      <button className={styles.btn} onClick={onRedo} disabled={!canRedo} title="Redo (Ctrl+Y)">
        ↪ Redo
      </button>
      <div className={styles.separator} />
      <button className={styles.btn} onClick={handleExportJSON} disabled={!tree}>
        ↓ Export JSON
      </button>
    </div>
  );
}
