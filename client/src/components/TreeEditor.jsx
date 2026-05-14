import { findNode } from '../utils/treeUtils';
import styles from './TreeEditor.module.css';

const TYPE_OPTIONS = [
  "S","S'","Q","NP","VP","PP","AP","AdvP","CP","TP","DP",
  "SUBJ","PRED","AUX","SM",
  "Perf","Prog","Pass",
  "N","V","Det","Adj","Adv","P","PRP","Conj","Aux","Comp","T","Neg",
  "Other"
];

export default function TreeEditor({ tree, selectedNodeId, onAddChild, onDelete, onUpdate }) {
  const selectedNode = tree ? findNode(tree, selectedNodeId) : null;

  const type = selectedNode?.type || '';
  const label = selectedNode?.label || '';
  const word = selectedNode?.word || '';
  const triangle = !!selectedNode?.triangle;

  function update(patch) {
    if (!selectedNodeId) return;
    onUpdate(selectedNodeId, patch);
  }

  function handleDelete() {
    if (!selectedNodeId) return;
    if (window.confirm('Delete this node and all its children?')) {
      onDelete(selectedNodeId);
    }
  }

  const isCustomType = type && !TYPE_OPTIONS.includes(type);

  return (
    <div className={styles.panel}>
      <p className={styles.title}>Node Editor</p>

      {!selectedNode ? (
        <p className={styles.empty}>Click a node in the tree to edit it.</p>
      ) : (
        <>
          <p className={styles.nodeInfo}>Editing: {selectedNode.id}</p>
          <hr className={styles.divider} />

          <div className={styles.field}>
            <label className={styles.label}>Type (label)</label>
            <select
              className={styles.input}
              value={isCustomType ? 'Other' : (type || 'S')}
              onChange={e => {
                const v = e.target.value;
                if (v === 'Other') update({ type: '' });
                else update({ type: v });
              }}
            >
              {TYPE_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            {isCustomType || type === '' ? (
              <input
                className={styles.input}
                placeholder="Custom type"
                value={type}
                onChange={e => update({ type: e.target.value })}
              />
            ) : null}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Full name</label>
            <input
              className={styles.input}
              value={label}
              onChange={e => update({ label: e.target.value })}
              placeholder="e.g. Noun Phrase"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Word (leave blank for phrase nodes)</label>
            <input
              className={styles.input}
              value={word}
              onChange={e => update({ word: e.target.value || null })}
              placeholder="e.g. ball"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={triangle}
                onChange={e => update({ triangle: e.target.checked })}
                style={{ margin: 0 }}
              />
              Triangle leaf (compressed phrase)
            </label>
          </div>

          <div className={styles.actions}>
            <button
              className={`${styles.btn} ${styles.btnSecondary}`}
              onClick={() => onAddChild(selectedNodeId)}
            >
              + Add Child
            </button>
            <button className={`${styles.btn} ${styles.btnDanger}`} onClick={handleDelete}>
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}
