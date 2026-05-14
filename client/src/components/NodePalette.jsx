import styles from './NodePalette.module.css';

const PHRASE_NODES = [
  { type: 'S', label: 'Sentence' },
  { type: 'NP', label: 'Noun Phrase' },
  { type: 'VP', label: 'Verb Phrase' },
  { type: 'PP', label: 'Prepositional Phrase' },
  { type: 'AP', label: 'Adjective Phrase' },
  { type: 'AdvP', label: 'Adverb Phrase' },
  { type: 'CP', label: 'Complementizer Phrase' },
];

const LEXICAL_NODES = [
  { type: 'N', label: 'Noun' },
  { type: 'V', label: 'Verb' },
  { type: 'Det', label: 'Determiner' },
  { type: 'Adj', label: 'Adjective' },
  { type: 'Adv', label: 'Adverb' },
  { type: 'P', label: 'Preposition' },
  { type: 'PRP', label: 'Pronoun' },
  { type: 'Conj', label: 'Conjunction' },
  { type: 'Aux', label: 'Auxiliary' },
];

function Chip({ node, leaf }) {
  function handleDragStart(e) {
    const payload = { type: node.type, label: node.label, leaf: !!leaf };
    e.dataTransfer.setData('application/x-tree-node', JSON.stringify(payload));
    e.dataTransfer.effectAllowed = 'copy';
  }

  return (
    <div
      className={`${styles.chip} ${leaf ? styles.chipLeaf : ''}`}
      draggable
      onDragStart={handleDragStart}
      title={node.label}
    >
      {node.type}
    </div>
  );
}

export default function NodePalette() {
  return (
    <div className={styles.panel}>
      <p className={styles.title}>Node Palette</p>
      <p className={styles.hint}>Drag onto the tree to add as a child.</p>

      <div className={styles.group}>
        <span className={styles.groupLabel}>Phrase Nodes</span>
        <div className={styles.chips}>
          {PHRASE_NODES.map(n => <Chip key={n.type} node={n} />)}
        </div>
      </div>

      <div className={styles.group}>
        <span className={styles.groupLabel}>Lexical (Leaf) Nodes</span>
        <div className={styles.chips}>
          {LEXICAL_NODES.map(n => <Chip key={n.type} node={n} leaf />)}
        </div>
      </div>
    </div>
  );
}
