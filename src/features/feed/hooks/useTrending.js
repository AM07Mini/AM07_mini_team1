import { useCallback, useEffect, useRef, useState } from 'react';
import { getTrendingRecipes } from '../../../api/feedApi';
import { toTrendingCard } from '../feedMapper';

const useTrending = () => {
  const [trending, setTrending] = useState([]);
  const [status, setStatus] = useState('loading');
  const requestRef = useRef(0);
  const timerRef = useRef(null);
  const loadTrending = useCallback((silent = false) => {
    const requestId = ++requestRef.current;
    getTrendingRecipes()
      .then((result) => {
        if (requestId !== requestRef.current) return;
        setTrending(result.content.map(toTrendingCard));
        setStatus('done');
      })
      .catch(() => {
        if (!silent && requestId === requestRef.current) setStatus('error');
      });
  }, []);

  const refreshTrendingSoon = useCallback(() => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => loadTrending(true), 300);
  }, [loadTrending]);

  useEffect(() => {
    loadTrending();
    return () => {
      clearTimeout(timerRef.current);
      requestRef.current += 1;
    };
  }, [loadTrending]);

  return { trending, setTrending, status, refreshTrendingSoon };
};

export default useTrending;
