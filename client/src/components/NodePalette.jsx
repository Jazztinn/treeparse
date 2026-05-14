import styles from './NodePalette.module.css';

const PHRASE_NODES = [
  { type: 'S', label: 'Sentence' },
  { type: "S'", label: 'S-bar (S Prime)' },
  { type: 'Q', label: 'Question Sentence' },
  { type: 'NP', label: 'Noun Phrase' },
  { type: 'VP', label: 'Verb Phrase' },
  { type: 'PP', label: 'Prepositional Phrase' },
  { type: 'AP', label: 'Adjective Phrase' },
  { type: 'AdvP', label: 'Adverb Phrase' },
  { type: 'CP', label: 'Complementizer Phrase' },
  { type: 'TP', label: 'Tense Phrase' },
];

const FUNCTIONAL_NODES = [
  { type: 'SUBJ', label: 'Subject' },
  { type: 'PRED', label: 'Predicate' },
  { type: 'AUX', label: 'Auxiliary (functional)' },
  { type: 'SM', label: 'Sentence Modifier' },
];

const ASPECT_NODES = [
  { type: 'Perf', label: 'Perfect (have + past participle)', special: 'perf' },
  { type: 'Prog', label: 'Progressive (be + -ing)', special: 'prog' },
  { type: 'Pass', label: 'Passive (be + past participle)', special: 'pass' },
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
  { type: 'Comp', label: 'Complementizer' },
  { type: 'T', label: 'Tense' },
  { type: 'Neg', label: 'Negation' },
];

function Chip({ node, leaf, aspect }) {
  function handleDragStart(e) {
    const payload = {
      type: node.type,
      label: node.label,
      leaf: !!leaf,
      ...(node.special ? { special: node.special } : {}),
    };
    e.dataTransfer.setData('application/x-tree-node', JSON.stringify(payload));
    e.dataTransfer.effectAllowed = 'copy';
  }

  return (
    <div
      className={`${styles.chip} ${leaf ? styles.chipLeaf : ''} ${aspect ? styles.chipAspect : ''}`}
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
        <span className={styles.groupLabel}>Functional Nodes</span>
        <div className={styles.chips}>
          {FUNCTIONAL_NODES.map(n => <Chip key={n.type} node={n} />)}
        </div>
      </div>

      <div className={styles.group}>
        <span className={styles.groupLabel}>Aspect / Voice (auto-conjugates)</span>
        <div className={styles.chips}>
          {ASPECT_NODES.map(n => <Chip key={n.type} node={n} aspect />)}
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
