import { useCallback, useEffect, useRef, useState } from "react";
import logger from "../../../logger.config.mjs";

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
  isMissingRequired = false,
  deps = [],
}: UseInfiniteScrollOptions<T>) {
  const [items, setItems]   = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // ── Refs ────────────────────────────────────────────────────────────────
  //
  // Cursor and hasMore are kept in refs as well as state.
  // This breaks the stale-closure problem: loadMore reads the ref (always
  // current) rather than the state value captured at memoisation time.
  //
  const cursorRef   = useRef<string | null>(null);
  const hasMoreRef  = useRef(true);
  const loadingRef  = useRef(false);          // mirrors loading state
  const abortRef    = useRef<AbortController | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // ── Internal setter that keeps ref + state in sync ───────────────────
  const setCursor = (v: string | null) => {
    cursorRef.current = v;
  };

  const setHasMoreSync = (v: boolean) => {
    hasMoreRef.current = v;
    setHasMore(v);
  };

  const setLoadingSync = (v: boolean) => {
    loadingRef.current = v;
    setLoading(v);
  };

  // ── loadMore ─────────────────────────────────────────────────────────
  //
  // No deps on cursor/hasMore/loading — reads refs instead so it is always
  // fresh without needing to be recreated on every state change.
  //
  const loadMore = useCallback(async () => {
    if (isMissingRequired || !enabled) return;
    if (loadingRef.current || !hasMoreRef.current) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoadingSync(true);

    try {
      const res = await fetcher(cursorRef.current ?? undefined, controller.signal);
      // Ignore stale responses that arrived after a reset
      if (controller.signal.aborted) return;

      setItems((prev) => [...prev, ...res.items]);
      setCursor(res.nextCursor);
      setHasMoreSync(Boolean(res.nextCursor));
    } catch (err: any) {
      if (err.name !== "AbortError") {
        logger.error("Infinite scroll fetch failed", err);
      }
    } finally {
      // Only clear loading if this controller is still the active one
      if (!controller.signal.aborted) {
        setLoadingSync(false);
      }
    }
  // fetcher identity must be stable (useCallback in the page). 
  // isMissingRequired and enabled are primitive booleans — safe to depend on.
  }, [fetcher, enabled, isMissingRequired]);

  // ── Observer: attach to the last item ───────────────────────────────
  const setObserverTarget = useCallback(
    (node: HTMLDivElement | null) => {
      observerRef.current?.disconnect();
      if (!node || !enabled) return;

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) loadMore();
        },
        { rootMargin: "200px" }
      );
      observerRef.current.observe(node);
    },
    [loadMore, enabled]
  );

  // ── Reset when filters/deps change ──────────────────────────────────
  //
  // Key fix: reset all refs synchronously BEFORE calling loadMore, so
  // the fetch that immediately follows sees cursor=null and hasMore=true.
  // We also abort any in-flight request from the previous filter set.
  //
  useEffect(() => {
    // Abort previous fetch immediately
    abortRef.current?.abort();
    abortRef.current = null;

    // Reset refs first (loadMore reads these, not state)
    cursorRef.current  = null;
    hasMoreRef.current = true;
    loadingRef.current = false;

    // Reset state for the UI
    setItems([]);
    setHasMoreSync(true);
    setLoadingSync(false);

    // Now trigger the first fetch for the new filter set.
    // We call it in a microtask so React has flushed the state resets
    // above before loadMore runs its guard checks via the refs.
    const id = setTimeout(() => {
      loadMore();
    }, 0);

    return () => {
      clearTimeout(id);
      abortRef.current?.abort();
    };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  // ── Trigger on isMissingRequired toggle ─────────────────────────────
  useEffect(() => {
    if (!isMissingRequired) loadMore();
    return () => abortRef.current?.abort();
  }, [isMissingRequired]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    items,
    loading,
    hasMore,
    setObserverTarget,
    reset: () => {
      abortRef.current?.abort();
      cursorRef.current  = null;
      hasMoreRef.current = true;
      loadingRef.current = false;
      setItems([]);
      setHasMoreSync(true);
      setLoadingSync(false);
    },
  };
}