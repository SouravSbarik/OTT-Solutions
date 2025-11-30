import { useState, useEffect } from 'react';
import { parseCSV } from '../utils/parseCsv';

export function usePublicCsv(filename) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(Boolean(filename));
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!filename) {
      setData([]);
      setLoading(false);
      setError(null);
      return;
    }

    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        // Ensure spaces/special chars encoded
        const url = encodeURI(filename.startsWith('/') ? filename : `/${filename}`);
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
        const text = await res.text();
        const parsed = parseCSV(text);
        if (mounted) setData(parsed);
      } catch (err) {
        if (mounted) setError(err.message || 'Failed to load CSV');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => { mounted = false; };
  }, [filename]);

  return { data, loading, error };
}
