import { useState } from 'react';

// In production (Vercel), API and frontend live on the same origin → use a relative path.
// In dev, fall back to the local Express server.
const BASE = import.meta.env.DEV ? 'http://localhost:3000/api' : '/api';

export function useAPICall() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function aiParse(sentence) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BASE}/ai-parse`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sentence })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Parse failed');
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }

  async function fetchExamples() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BASE}/examples`);
      const data = await res.json();
      return data.examples || [];
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }

  return { loading, error, aiParse, fetchExamples };
}
