import { useCallback, useEffect, useRef, useState } from 'react';

const usePagedList = (fetchPage, { enabled = true } = {}) => {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadMoreFailed, setLoadMoreFailed] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const requestIdRef = useRef(0);
  const loadingMoreRef = useRef(false);
  const sentinelRef = useRef(null);

  useEffect(() => {
    const requestId = ++requestIdRef.current;
    setItems([]);
    setPage(0);
    setHasNext(false);
    setError(null);
    loadingMoreRef.current = false;
    setLoadingMore(false);
    setLoadMoreFailed(false);

    if (!enabled) {
      setStatus('done');
      return;
    }

    setStatus('loading');
    fetchPage(0)
      .then((result) => {
        if (requestId !== requestIdRef.current) return;
        setItems(result.content);
        setHasNext(result.page + 1 < result.totalPages);
        setStatus('done');
      })
      .catch((err) => {
        if (requestId !== requestIdRef.current) return;
        setError(err);
        setStatus('error');
      });
  }, [fetchPage, enabled, reloadKey]);

  const loadMore = useCallback(() => {
    if (!hasNext || loadingMoreRef.current || loadMoreFailed || status !== 'done') return;
    const requestId = requestIdRef.current;
    const next = page + 1;
    loadingMoreRef.current = true;
    setLoadingMore(true);
    fetchPage(next)
      .then((result) => {
        if (requestId !== requestIdRef.current) return;
        setItems((prev) => {
          const seen = new Set(prev.map((item) => item.id));
          return [...prev, ...result.content.filter((item) => !seen.has(item.id))];
        });
        setPage(next);
        setHasNext(next + 1 < result.totalPages);
      })
      .catch(() => {
        if (requestId === requestIdRef.current) setLoadMoreFailed(true);
      })
      .finally(() => {
        if (requestId !== requestIdRef.current) return;
        loadingMoreRef.current = false;
        setLoadingMore(false);
      });
  }, [fetchPage, page, hasNext, loadMoreFailed, status]);

  useEffect(() => {
    const target = sentinelRef.current;
    if (!target || !hasNext) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { rootMargin: '200px' },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [hasNext, loadMore]);


  const reload = useCallback(() => setReloadKey((key) => key + 1), []);
  const retryMore = useCallback(() => setLoadMoreFailed(false), []);

  return {
    items,
    setItems,
    status,
    error,
    hasNext,
    loadingMore,
    loadMoreFailed,
    sentinelRef,
    reload,
    retryMore,
  };
};

export default usePagedList;
