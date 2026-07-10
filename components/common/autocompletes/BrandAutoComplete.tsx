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
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  useEffect,
  useReducer,
  useRef,
  useCallback,
  useMemo,
  useState,
} from "react";
import { Spinner } from "@/components/ui/spinner";
import debounce from "lodash/debounce";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { Brand } from "@/@types/brand.types";
import { getBrands } from "@/actions/BrandAction";

type Props<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  defaultBrand?: Pick<Brand, "id" | "title"> | null;
};

type State = {
  brands: Brand[];
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
        items: Brand[];
        total: number;
        page: number;
        replace: boolean;
      };
    }
  | { type: "FETCH_ERROR"; payload: string | null }
  | { type: "SET_OPEN"; payload: boolean }
  | { type: "SET_SEARCH"; payload: string };

const initialState: State = {
  brands: [],
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
        brands: replace ? items : [...state.brands, ...items],
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

export default function BrandAutocomplete<T extends FieldValues>({
  control,
  name,
  label = "Select brand",
  defaultBrand = null,
}: Props<T>) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [selectedBrand, setSelectedBrand] = useState<Pick<
    Brand,
    "id" | "title"
  > | null>(defaultBrand);
  const listRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef(0);
  const searchRef = useRef("");
  const initialLoadRef = useRef(true);

  const fetchBrands = useCallback(
    async (nextPage: number, nextSearch: string, replace: boolean) => {
      try {
        dispatch({
          type: "FETCH_START",
          payload: { replace, initial: initialLoadRef.current },
        });

        const response = await getBrands({
          page: nextPage,
          limit: 10,
          order: "id",
          direction: "desc",
          search: nextSearch,
        });

        if (!response.success) throw new Error(response.message);

        const items: Brand[] = response.data.items;
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
    },
    [],
  );

  useEffect(() => {
    fetchBrands(0, "", true);
  }, [fetchBrands]);

  useEffect(() => {
    if (defaultBrand) setSelectedBrand(defaultBrand);
  }, [defaultBrand]);

  const debouncedFetch = useMemo(
    () =>
      debounce((query: string) => {
        pageRef.current = 0;
        fetchBrands(0, query, true);
      }, 400),
    [fetchBrands],
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
      fetchBrands(nextPage, searchRef.current, false);
    }
  }, [state.loadingMore, state.hasMore, fetchBrands]);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const selectedLabel =
          selectedBrand?.title ??
          state.brands.find((r) => r.id === field.value)?.title;

        return (
          <Field data-invalid={fieldState.invalid}>
            {label && <FieldLabel>{label}</FieldLabel>}

            {state.loading ? (
              <Button
                variant="outline"
                disabled
                className="w-full justify-start font-normal"
              >
                <Spinner className="mr-2" />
                Loading brands...
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
                    className={cn(
                      "w-full justify-between font-normal",
                      fieldState.invalid && "border-destructive",
                    )}
                  >
                    <span
                      className={cn(!selectedLabel && "text-muted-foreground")}
                    >
                      {selectedLabel ?? "Select a brand..."}
                    </span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
                  <Command shouldFilter={false}>
                    <CommandInput
                      placeholder="Search Brands..."
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
                          <CommandEmpty>No brands found.</CommandEmpty>
                          {state.brands.map((brand) => (
                            <CommandItem
                              key={brand.id}
                              value={String(brand.id)}
                              onSelect={(val) => {
                                const num = Number(val);
                                const picked =
                                  state.brands.find((u) => u.id === num) ??
                                  null;
                                setSelectedBrand(
                                  num === field.value ? null : picked,
                                );
                                field.onChange(
                                  num === field.value ? null : num,
                                );
                                dispatch({ type: "SET_OPEN", payload: false });
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  field.value === brand.id
                                    ? "opacity-100"
                                    : "opacity-0",
                                )}
                              />
                              {brand.title}
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

            {state.error || fieldState.error?.message ? (
              <FieldError>
                {state.error || fieldState.error?.message}
              </FieldError>
            ) : null}
          </Field>
        );
      }}
    />
  );
}
