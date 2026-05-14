import { exportSvgAsPng } from '../utils/exportPNG';
import styles from './ControlBar.module.css';

export default function ControlBar({ tree, onNewTree, onAddNode, onUndo, onRedo, canUndo, canRedo, onShowExamples }) {
  function handleExportPNG() {
    if (!tree) return;
    const svgEl = document.getElementById('tree-svg');
    if (svgEl) {
      exportSvgAsPng(svgEl, 'syntax-tree.png');
    }
  }

  return (
    <div className={styles.bar}>

      <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={onNewTree}>
        New Tree
      </button>
      <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={onAddNode} title="Add Placeholder Node">
        + Add Node
      </button>
      <div className={styles.separator} />
      <button className={styles.btn} onClick={onUndo} disabled={!canUndo} title="Undo (Ctrl+Z)">
        ↩ Undo
      </button>
      <button className={styles.btn} onClick={onRedo} disabled={!canRedo} title="Redo (Ctrl+Y)">
        ↪ Redo
      </button>

      <button className={styles.btn} onClick={handleExportPNG} disabled={!tree}>
        ↓ Export PNG
      </button>

      <div className={styles.separator} />
      <button className={styles.btn} onClick={onShowExamples}>
        Examples?
      </button>

    </div>
  );
}
