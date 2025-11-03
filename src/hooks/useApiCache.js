import { useState, useEffect } from 'react';

// Simple in-memory cache with TTL
const cache = new Map();

const useApiCache = (key, fetchFunction, ttl = 5 * 60 * 1000) => { // 5 minutes default TTL
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check if data exists in cache and hasn't expired
        const cached = cache.get(key);
        if (cached && Date.now() - cached.timestamp < ttl) {
          setData(cached.data);
          setLoading(false);
          return;
        }

        // Fetch new data
        const result = await fetchFunction();
        cache.set(key, {
          data: result,
          timestamp: Date.now()
        });
        setData(result);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [key, fetchFunction, ttl]);

  const invalidate = () => {
    cache.delete(key);
  };

  return { data, loading, error, invalidate };
};

export default useApiCache;