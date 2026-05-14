import styles from './ExamplesLibrary.module.css';

export default function ExamplesLibrary({ examples, onLoadExample, onAIParse }) {
  function handleClick(ex) {
    if (ex.tree) {
      onLoadExample(ex.tree);
    } else {
      onAIParse(ex.sentence);
    }
  }

  return (
    <div className={styles.panel}>
      <p className={styles.title}>Examples</p>
      <div className={styles.list}>
        {examples.map(ex => (
          <div key={ex.id} className={styles.item} onClick={() => handleClick(ex)}>
            <span className={styles.sentence}>"{ex.sentence}"</span>
            <span className={styles.description}>{ex.description}</span>
            {ex.ambiguities && (
              <span className={styles.badge}>{ex.ambiguities} interpretations</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
