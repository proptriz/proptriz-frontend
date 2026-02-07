import { useCallback, useContext, useEffect, useRef, useState } from "react";
import logger from "../../../logger.config.mjs"
import { AppContext } from "@/context/AppContextProvider";

interface CursorResponse<T> {
  items: T[];
  nextCursor: string | null;
  totalCount?: number;
}

interface UseInfiniteScrollOptions<T> {
  fetcher: (cursor?: string, signal?: AbortSignal) => Promise<CursorResponse<T>>;
  enabled?: boolean;
  isAuthRequired?: boolean;
}

export function useInfiniteCursorScroll<T>({
  fetcher,
  enabled = true,
  isAuthRequired=false
}: UseInfiniteScrollOptions<T>) {
  const { authUser } = useContext(AppContext);
  const [items, setItems] = useState<T[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const lastItemRef = useRef<HTMLDivElement | null>(null);

  const loadMore = useCallback(async () => {
    if ((isAuthRequired && !authUser) || !enabled || loading || !hasMore) return;

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
  }, [cursor, fetcher, hasMore, loading, enabled]);

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

  /** Initial load */
  useEffect(() => {
    loadMore();
    return () => abortRef.current?.abort();
  }, [authUser]);

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
