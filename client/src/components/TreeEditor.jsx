import { useState, useEffect } from 'react';
import { findNode } from '../utils/treeUtils';
import styles from './TreeEditor.module.css';

const TYPE_OPTIONS = [
  'S','NP','VP','PP','AP','AdvP','CP','TP','DP',
  'N','V','Det','Adj','Adv','P','PRP','Conj','Aux','Other'
];

export default function TreeEditor({ tree, selectedNodeId, onAddChild, onDelete, onUpdate }) {
  const selectedNode = tree ? findNode(tree, selectedNodeId) : null;

  const [type, setType] = useState('');
  const [label, setLabel] = useState('');
  const [word, setWord] = useState('');

  useEffect(() => {
    if (selectedNode) {
      setType(selectedNode.type || '');
      setLabel(selectedNode.label || '');
      setWord(selectedNode.word || '');
    }
  }, [selectedNodeId, selectedNode?.type, selectedNode?.label, selectedNode?.word]);

  function handleSave() {
    if (!selectedNodeId) return;
    onUpdate(selectedNodeId, {
      type,
      label,
      word: word.trim() || null
    });
  }

  function handleDelete() {
    if (!selectedNodeId) return;
    if (window.confirm('Delete this node and all its children?')) {
      onDelete(selectedNodeId);
    }
  }

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
              value={TYPE_OPTIONS.includes(type) ? type : 'Other'}
              onChange={e => {
                const v = e.target.value;
                if (v !== 'Other') setType(v);
              }}
            >
              {TYPE_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            {(!TYPE_OPTIONS.includes(type) || type === 'Other') && (
              <input
                className={styles.input}
                placeholder="Custom type"
                value={type}
                onChange={e => setType(e.target.value)}
              />
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Full name</label>
            <input
              className={styles.input}
              value={label}
              onChange={e => setLabel(e.target.value)}
              placeholder="e.g. Noun Phrase"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Word (leave blank for phrase nodes)</label>
            <input
              className={styles.input}
              value={word}
              onChange={e => setWord(e.target.value)}
              placeholder="e.g. ball"
            />
          </div>

          <div className={styles.actions}>
            <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleSave}>
              Save
            </button>
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
