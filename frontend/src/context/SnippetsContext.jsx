import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { listSnippets, listMyFavorites } from '../api/snippets';

const SnippetsContext = createContext(null);

export const SORT_OPTIONS = [
  { value: '-updated_at', label: 'Last modified' },
  { value: '-created_at', label: 'Newest first' },
  { value: 'created_at', label: 'Oldest first' },
  { value: 'title', label: 'Title A–Z' },
];

// The sidebar list and the editor pane are separate components that must stay
// in sync: saving in the editor has to update the list, deleting has to remove
// the row. Holding the list here — above the router — lets the editor just call
// refresh() instead of the two panes trying to reconcile their own copies.
export function SnippetsProvider({ children }) {
  const [items, setItems] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);

  const [search, setSearch] = useState('');
  const [ordering, setOrdering] = useState('-updated_at');
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  const refresh = useCallback(() => setReloadKey((k) => k + 1), []);

  const fetchPage = useCallback(
    (targetPage) => {
      const params = { page: targetPage, ordering };
      if (search) params.search = search;
      return favoritesOnly ? listMyFavorites(params) : listSnippets(params);
    },
    [ordering, search, favoritesOnly],
  );

  // Reload page 1 whenever the query changes. `cancelled` matters as much as
  // the debounce: without it a slow earlier request can resolve after a newer
  // one and overwrite the list with stale results.
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const timeout = setTimeout(() => {
      fetchPage(1)
        .then((data) => {
          if (cancelled) return;
          setItems(data.results);
          setCount(data.count);
          setHasNext(Boolean(data.next));
          setPage(1);
        })
        .catch(() => {
          if (!cancelled) setError('Failed to load snippets');
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [fetchPage, reloadKey]);

  // The list lives in a scrolling sidebar, so paging appends instead of
  // replacing the way a numbered pager would.
  const loadMore = useCallback(async () => {
    setLoadingMore(true);
    try {
      const data = await fetchPage(page + 1);
      setItems((prev) => [...prev, ...data.results]);
      setHasNext(Boolean(data.next));
      setPage((p) => p + 1);
    } catch {
      setError('Failed to load more');
    } finally {
      setLoadingMore(false);
    }
  }, [fetchPage, page]);

  const value = {
    items, count, hasNext, loading, loadingMore, error,
    search, setSearch,
    ordering, setOrdering,
    favoritesOnly, setFavoritesOnly,
    loadMore, refresh,
  };

  return <SnippetsContext.Provider value={value}>{children}</SnippetsContext.Provider>;
}

export function useSnippets() {
  const ctx = useContext(SnippetsContext);
  if (!ctx) throw new Error('useSnippets must be used within SnippetsProvider');
  return ctx;
}
