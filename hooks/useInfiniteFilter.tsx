"use client";

import { useEffect, useReducer, useRef, useCallback, useMemo } from "react";
import debounce from "lodash/debounce";

export type FilterOption = {
  id: number;
  label: string;
};

type FetchFn = (params: {
  page: number;
  limit: number;
  order: string;
  direction: "asc" | "desc";
  search?: string;
}) => Promise<{
  success: boolean;
  message?: string;
  data: { items: unknown[]; totalItems: number };
}>;

type MapFn<T> = (item: T) => FilterOption;

type State = {
  options: FilterOption[];
  selected: FilterOption | null;
  loading: boolean;
  searching: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  error: string | null;
  open: boolean;
  search: string;
};

type Action =
  | { type: "FETCH_START"; payload: { replace: boolean; initial: boolean } }
  | {
      type: "FETCH_SUCCESS";
      payload: {
        items: FilterOption[];
        total: number;
        page: number;
        replace: boolean;
      };
    }
  | { type: "FETCH_ERROR"; payload: string | null }
  | { type: "SET_OPEN"; payload: boolean }
  | { type: "SET_SEARCH"; payload: string }
  | { type: "SET_SELECTED"; payload: FilterOption | null };

function makeInitialState(defaultOption: FilterOption | null): State {
  return {
    options: [],
    selected: defaultOption,
    loading: true,
    searching: false,
    loadingMore: false,
    hasMore: true,
    error: null,
    open: false,
    search: "",
  };
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "FETCH_START":
      if (action.payload.initial) return { ...state, loading: true };
      if (action.payload.replace) return { ...state, searching: true };
      return { ...state, loadingMore: true };

    case "FETCH_SUCCESS": {
      const { items, total, page, replace } = action.payload;
      return {
        ...state,
        options: replace ? items : [...state.options, ...items],
        hasMore: (page + 1) * 10 < total,
        error: null,
        loading: false,
        searching: false,
        loadingMore: false,
      };
    }

    case "FETCH_ERROR":
      return {
        ...state,
        error: action.payload,
        loading: false,
        searching: false,
        loadingMore: false,
      };

    case "SET_OPEN":
      return { ...state, open: action.payload };

    case "SET_SEARCH":
      return { ...state, search: action.payload };

    case "SET_SELECTED":
      return { ...state, selected: action.payload, open: false };

    default:
      return state;
  }
}

type UseInfiniteFilterOptions<T> = {
  fetchFn: FetchFn;
  mapFn: MapFn<T>;
  defaultOption?: FilterOption | null;
};

export function useInfiniteFilter<T>({
  fetchFn,
  mapFn,
  defaultOption = null,
}: UseInfiniteFilterOptions<T>) {
  const [state, dispatch] = useReducer(
    reducer,
    defaultOption,
    makeInitialState,
  );

  const listRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef(0);
  const searchRef = useRef("");
  const initialLoadRef = useRef(true);

  const fetchOptions = useCallback(
    async (nextPage: number, nextSearch: string, replace: boolean) => {
      try {
        dispatch({
          type: "FETCH_START",
          payload: { replace, initial: initialLoadRef.current },
        });

        const response = await fetchFn({
          page: nextPage,
          limit: 10,
          order: "id",
          direction: "desc",
          search: nextSearch,
        });

        if (!response.success) throw new Error(response.message);

        const items = (response.data.items as T[]).map(mapFn);
        const total = response.data.totalItems;

        dispatch({
          type: "FETCH_SUCCESS",
          payload: { items, total, page: nextPage, replace },
        });
      } catch (error) {
        dispatch({
          type: "FETCH_ERROR",
          payload:
            error instanceof Error ? error.message : "Something went wrong",
        });
      } finally {
        initialLoadRef.current = false;
      }
    },
    [fetchFn, mapFn],
  );

  useEffect(() => {
    fetchOptions(0, "", true);
  }, [fetchOptions]);

  const debouncedFetch = useMemo(
    () =>
      debounce((query: string) => {
        pageRef.current = 0;
        fetchOptions(0, query, true);
      }, 400),
    [fetchOptions],
  );

  useEffect(() => {
    return () => debouncedFetch.cancel();
  }, [debouncedFetch]);

  const handleSearch = useCallback(
    (query: string) => {
      dispatch({ type: "SET_SEARCH", payload: query });
      searchRef.current = query;
      debouncedFetch(query);
    },
    [debouncedFetch],
  );

  const handleScroll = useCallback(() => {
    const el = listRef.current;
    if (!el || state.loadingMore || !state.hasMore) return;
    const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 40;
    if (nearBottom) {
      const nextPage = pageRef.current + 1;
      pageRef.current = nextPage;
      fetchOptions(nextPage, searchRef.current, false);
    }
  }, [state.loadingMore, state.hasMore, fetchOptions]);

  const handleSelect = useCallback(
    (
      num: number,
      currentValue: number | null | undefined,
      onChange: (v: number | undefined) => void,
    ) => {
      const picked = state.options.find((o) => o.id === num) ?? null;
      const isDeselecting = num === currentValue;
      dispatch({
        type: "SET_SELECTED",
        payload: isDeselecting ? null : picked,
      });
      onChange(isDeselecting ? undefined : num);
    },
    [state.options],
  );

  const setOpen = useCallback((open: boolean) => {
    dispatch({ type: "SET_OPEN", payload: open });
  }, []);

  return {
    state,
    listRef,
    handleSearch,
    handleScroll,
    handleSelect,
    setOpen,
  };
}
