import { useCallback, useContext, useEffect, useRef, useState } from "react";
import logger from "../../../logger.config.mjs"

interface CursorResponse<T> {
  items: T[];
  nextCursor: string | null;
  totalCount?: number;
}

interface UseInfiniteScrollOptions<T> {
  fetcher: (cursor?: string, signal?: AbortSignal) => Promise<CursorResponse<T>>;
  enabled?: boolean;
  isMissingRequired?: boolean;
  deps?: any[];
}

export function useInfiniteCursorScroll<T>({
  fetcher,
  enabled = true,
  isMissingRequired=false,
  deps = []
}: UseInfiniteScrollOptions<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const lastItemRef = useRef<HTMLDivElement | null>(null);

  const loadMore = useCallback(async () => {
    if (isMissingRequired || !enabled || loading || !hasMore) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);

    try {
      const res = await fetcher(cursor ?? undefined, controller.signal);

      setItems(prev => [...prev, ...res.items]);
      setCursor(res.nextCursor);
      setHasMore(Boolean(res.nextCursor));
    } catch (err: any) {
      if (err.name !== "AbortError") {
        logger.error("Infinite scroll fetch failed", err);
      }
    } finally {
      setLoading(false);
    }
  }, [cursor, fetcher, hasMore, loading, enabled, isMissingRequired]);

  /** Observe last item */
  const setObserverTarget = useCallback((node: HTMLDivElement | null) => {
    if (!enabled) return;

    observerRef.current?.disconnect();

    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        loadMore();
      }
    });

    if (node) observerRef.current.observe(node);
    lastItemRef.current = node;
  }, [loadMore, enabled]);

  /** Auto reset when filters/search/sort change */
  useEffect(() => {
    abortRef.current?.abort();
    // observerRef.current?.disconnect(); // ✅ ADD THIS

    setItems([]);
    setCursor(null);
    setHasMore(true);

    loadMore();
  }, deps);

  /** Initial load */
  useEffect(() => {
    loadMore();
    return () => abortRef.current?.abort();
  }, [isMissingRequired]);

  return {
    items,
    loading,
    hasMore,
    setObserverTarget,
    reset: () => {
      setItems([]);
      setCursor(null);
      setHasMore(true);
    }
  };
}
