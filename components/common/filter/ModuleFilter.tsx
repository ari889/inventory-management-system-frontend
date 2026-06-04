"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useEffect, useReducer, useRef, useCallback, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import debounce from "lodash/debounce";
import { Module } from "@/@types/module.types";
import { getAllModules, getModules } from "@/actions/ModuleAction";
import { Field, FieldLabel } from "@/components/ui/field";

type ModuleOption = Pick<Module, "id" | "moduleName">;

type Props = {
  value?: number;
  onChange: (value: number | null) => void;
  label?: string;
  defaultModule?: ModuleOption | null;
};

type State = {
  modules: Module[];
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
        items: Module[];
        total: number;
        page: number;
        replace: boolean;
      };
    }
  | { type: "FETCH_ERROR"; payload: string | null }
  | { type: "SET_OPEN"; payload: boolean }
  | { type: "SET_SEARCH"; payload: string };

const initialState: State = {
  modules: [],
  loading: true,
  searching: false,
  loadingMore: false,
  hasMore: true,
  error: null,
  open: false,
  search: "",
};

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
        modules: replace ? items : [...state.modules, ...items],
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

    default:
      return state;
  }
}

export default function ModuleFilter({
  value,
  onChange,
  label = "Select module",
  defaultModule = null,
}: Props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [selectedModule, setSelectedModule] = useState<ModuleOption | null>(
    defaultModule,
  );
  const listRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef(0);
  const searchRef = useRef("");
  const initialLoadRef = useRef(true);

  const fetchModules = async (
    nextPage: number,
    nextSearch: string,
    replace: boolean,
  ) => {
    try {
      dispatch({
        type: "FETCH_START",
        payload: { replace, initial: initialLoadRef.current },
      });

      const response = await getAllModules({
        page: nextPage,
        limit: 10,
        order: "id",
        direction: "desc",
        search: nextSearch,
      });

      if (!response.success) throw new Error(response.message);

      const items: Module[] = response.data.items;
      const total: number = response.data.totalItems;

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
  };

  useEffect(() => {
    fetchModules(0, "", true);
  }, []);

  useEffect(() => {
    if (defaultModule) setSelectedModule(defaultModule);
  }, [defaultModule]);

  const debouncedFetch = useCallback(
    debounce((query: string) => {
      pageRef.current = 0;
      fetchModules(0, query, true);
    }, 400),
    [],
  );

  const handleSearch = (query: string) => {
    dispatch({ type: "SET_SEARCH", payload: query });
    searchRef.current = query;
    debouncedFetch(query);
  };

  const handleScroll = useCallback(() => {
    const el = listRef.current;
    if (!el || state.loadingMore || !state.hasMore) return;
    const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 40;
    if (nearBottom) {
      const nextPage = pageRef.current + 1;
      pageRef.current = nextPage;
      fetchModules(nextPage, searchRef.current, false);
    }
  }, [state.loadingMore, state.hasMore]);

  const selectedLabel =
    selectedModule?.moduleName ??
    state.modules.find((r) => r.id === value)?.moduleName;

  return (
    <Field className="flex flex-col gap-1.5">
      {label && (
        <FieldLabel className="text-sm font-medium leading-none">
          {label}
        </FieldLabel>
      )}

      {state.loading ? (
        <Button
          variant="outline"
          disabled
          className="w-full justify-start font-normal"
        >
          <Spinner className="mr-2" />
          Loading modules...
        </Button>
      ) : (
        <Popover
          open={state.open}
          onOpenChange={(v) => dispatch({ type: "SET_OPEN", payload: v })}
          modal
        >
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={state.open}
              className="w-full justify-between font-normal"
            >
              <span className={cn(!selectedLabel && "text-muted-foreground")}>
                {selectedLabel ?? "Select a module..."}
              </span>
              <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
            <Command shouldFilter={false}>
              <CommandInput
                placeholder="Search modules..."
                value={state.search}
                onValueChange={handleSearch}
              />
              <CommandList ref={listRef} onScroll={handleScroll}>
                {state.searching ? (
                  <div className="flex justify-center py-4">
                    <Spinner className="h-4 w-4" />
                  </div>
                ) : (
                  <>
                    <CommandEmpty>No modules found.</CommandEmpty>
                    {state.modules.map((module) => (
                      <CommandItem
                        key={module.id}
                        value={String(module.id)}
                        onSelect={(val) => {
                          const num = Number(val);
                          const picked =
                            state.modules.find((u) => u.id === num) ?? null;
                          const isDeselecting = num === value;
                          setSelectedModule(isDeselecting ? null : picked);
                          onChange(isDeselecting ? null : num);
                          dispatch({ type: "SET_OPEN", payload: false });
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            value === module.id ? "opacity-100" : "opacity-0",
                          )}
                        />
                        {module.moduleName}
                      </CommandItem>
                    ))}
                    {state.loadingMore && (
                      <div className="flex justify-center py-2">
                        <Spinner className="h-4 w-4" />
                      </div>
                    )}
                  </>
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      )}

      {state.error && <p className="text-sm text-destructive">{state.error}</p>}
    </Field>
  );
}
