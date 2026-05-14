import { useState } from 'react';
import styles from './InputPanel.module.css';

export default function InputPanel({ onAIParse, loading, error }) {
  const [sentence, setSentence] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (sentence.trim()) onAIParse(sentence.trim());
  }

  return (
    <div className={styles.panel}>
      <form className={styles.row} onSubmit={handleSubmit}>
        <input
          className={styles.input}
          value={sentence}
          onChange={e => setSentence(e.target.value)}
          placeholder="Enter a sentence to parse…"
          disabled={loading}
        />
        <button
          type="submit"
          className={`${styles.btn} ${styles.btnAI}`}
          disabled={loading || !sentence.trim()}
        >
          {loading && <span className={styles.spinner} />}
          {loading ? 'Parsing…' : 'Parse with AI'}
        </button>
      </form>
      {error && <div className={styles.error}>{error}</div>}
      <p className={styles.hint}>Powered by Gemini · Press Enter or click Parse</p>
    </div>
  );
}
