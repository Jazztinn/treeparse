import styles from './AmbiguityPicker.module.css';

export default function AmbiguityPicker({ trees, explanation, onSelect, onClose }) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <h2 className={styles.title}>Ambiguous Sentence — Choose an Interpretation</h2>
        {explanation && <p className={styles.explanation}>{explanation}</p>}
        <div className={styles.options}>
          {trees.map((t, i) => (
            <div key={i} className={styles.option} onClick={() => onSelect(t.tree)}>
              <div className={styles.interpretation}>{t.interpretation || `Interpretation ${i + 1}`}</div>
              {t.confidence !== undefined && (
                <div className={styles.confidence}>Confidence: {Math.round(t.confidence * 100)}%</div>
              )}
            </div>
          ))}
        </div>
        <button className={styles.cancel} onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}
