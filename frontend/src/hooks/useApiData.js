import { useState, useEffect, useRef } from 'react';
import { API_URL } from '../config/api';

/**
 * Reusable hook for fetching CMS data from the backend API.
 * Caches results in a module-level map to avoid redundant network requests.
 * 
 * @param {string} endpoint — API path (e.g. '/states', '/hidden-gems')
 * @param {object} options — { skip: boolean, noCache: boolean }
 * @returns {{ data: any, loading: boolean, error: string|null, refetch: Function }}
 */

const cache = {};
const fetchPromises = {};

export default function useApiData(endpoint, options = {}) {
  const { skip = false, noCache = false } = options;
  const [data, setData] = useState(cache[endpoint]?.data || null);
  const [loading, setLoading] = useState(!cache[endpoint]);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  const fetchData = async () => {
    if (skip) return;
    
    // Return cached data immediately if available
    if (!noCache && cache[endpoint]) {
      setData(cache[endpoint].data);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let promise = fetchPromises[endpoint];
      if (!promise) {
        abortRef.current = new AbortController();
        promise = fetch(`${API_URL}${endpoint}`, { signal: abortRef.current.signal })
          .then(async res => {
            if (!res.ok) throw new Error(`API ${res.status}: ${res.statusText}`);
            const json = await res.json();
            if (json.success) {
              cache[endpoint] = { data: json.data, ts: Date.now() };
              return json.data;
            } else {
              throw new Error(json.message || 'API returned unsuccessful response');
            }
          })
          .finally(() => {
            delete fetchPromises[endpoint];
          });
        fetchPromises[endpoint] = promise;
      }
      
      const result = await promise;
      setData(result);
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error(`[useApiData] ${endpoint}:`, err.message);
        setError(err.message);
      }
    } finally {
      if (!abortRef.current?.signal.aborted) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchData();
    return () => abortRef.current?.abort();
  }, [endpoint, skip]);

  const refetch = () => {
    delete cache[endpoint];
    fetchData();
  };

  return { data, loading, error, refetch };
}

/** Clear all cached data (useful after admin edits) */
export function clearApiCache() {
  Object.keys(cache).forEach(k => delete cache[k]);
}
