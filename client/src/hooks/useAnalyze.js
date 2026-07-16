import { useState, useCallback } from 'react';
import { analyzeDeveloper } from '../services/analyzeService.js';

/**
 * Encapsulates the analyze request lifecycle: loading, error, and data.
 * Components consume this instead of calling the API directly.
 */
export function useAnalyze() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const run = useCallback(async (username, refresh = false) => {
    if (!username?.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const result = await analyzeDeveloper(username.trim(), refresh);
      setData(result);
    } catch (err) {
      setError(err.message);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
  }, []);

  return { data, loading, error, run, reset };
}

export default useAnalyze;
