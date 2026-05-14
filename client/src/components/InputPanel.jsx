import { useState } from 'react';
import { isBracketNotation, parseBrackets } from '../utils/bracketParser';
import styles from './InputPanel.module.css';

export default function InputPanel({ onAIParse, onBracketParse, loading, error }) {
  const [input, setInput] = useState('');
  const [localError, setLocalError] = useState(null);

  const looksLikeBrackets = isBracketNotation(input.trim());

  function handleParseBrackets() {
    setLocalError(null);
    try {
      const tree = parseBrackets(input);
      onBracketParse(tree);
    } catch (err) {
      setLocalError(err.message);
    }
  }

  function handleAI() {
    setLocalError(null);
    if (input.trim()) onAIParse(input.trim());
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!input.trim()) return;
    if (looksLikeBrackets) handleParseBrackets();
    else handleAI();
  }

  return (
    <div className={styles.panel}>
      <form className={styles.row} onSubmit={handleSubmit}>
        <input
          className={styles.input}
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Start parsing..."
          disabled={loading}
        />
        <button
          type="button"
          className={`${styles.btn} ${styles.btnBracket}`}
          onClick={handleParseBrackets}
          disabled={loading || !input.trim() || !looksLikeBrackets}
          title="Parse labelled bracket notation locally (instant, no AI)"
        >
          Parse Brackets
        </button>
        <button
          type="button"
          className={`${styles.btn} ${styles.btnAI}`}
          onClick={handleAI}
          disabled={loading || !input.trim()}
          title="Send to Gemini for AI parsing"
        >
          {loading && <span className={styles.spinner} />}
          {loading ? 'Parsing…' : 'Parse with AI'}
        </button>
      </form>
      {(localError || error) && (
        <div className={styles.error}>{localError || error}</div>
      )}
      <p className={styles.hint}>
        {looksLikeBrackets
          ? 'Bracket notation detected — parses instantly, no AI needed.'
          : 'Type manually or let AI parse it for you.'}
      </p>
    </div>
  );
}
