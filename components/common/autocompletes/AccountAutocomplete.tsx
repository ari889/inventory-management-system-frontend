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
import { Account } from "@/@types/account.types";
import { getAccounts } from "@/actions/AccountAction";

type Props<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  defaultAccount?: Pick<Account, "id" | "name"> | null;
};

type State = {
  accounts: Account[];
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
        items: Account[];
        total: number;
        page: number;
        replace: boolean;
      };
    }
  | { type: "FETCH_ERROR"; payload: string | null }
  | { type: "SET_OPEN"; payload: boolean }
  | { type: "SET_SEARCH"; payload: string };

const initialState: State = {
  accounts: [],
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
        accounts: replace ? items : [...state.accounts, ...items],
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

export default function AccountAutocomplete<T extends FieldValues>({
  control,
  name,
  label = "Select account",
  defaultAccount = null,
}: Props<T>) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [selectedAccount, setSelectedAccount] = useState<Pick<
    Account,
    "id" | "name"
  > | null>(defaultAccount);
  const listRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef(0);
  const searchRef = useRef("");
  const initialLoadRef = useRef(true);

  const fetchAccounts = useCallback(
    async (nextPage: number, nextSearch: string, replace: boolean) => {
      try {
        dispatch({
          type: "FETCH_START",
          payload: { replace, initial: initialLoadRef.current },
        });

        const response = await getAccounts({
          page: nextPage,
          limit: 10,
          order: "id",
          direction: "desc",
          search: nextSearch,
        });

        if (!response.success) throw new Error(response.message);

        const items: Account[] = response.data.items;
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
    fetchAccounts(0, "", true);
  }, [fetchAccounts]);

  useEffect(() => {
    if (defaultAccount) setSelectedAccount(defaultAccount);
  }, [defaultAccount]);

  const debouncedFetch = useMemo(
    () =>
      debounce((query: string) => {
        pageRef.current = 0;
        fetchAccounts(0, query, true);
      }, 400),
    [fetchAccounts],
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
      fetchAccounts(nextPage, searchRef.current, false);
    }
  }, [state.loadingMore, state.hasMore, fetchAccounts]);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const selectedLabel =
          selectedAccount?.name ??
          state.accounts.find((r) => r.id === field.value)?.name;

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
                Loading accounts...
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
                      {selectedLabel ?? "Select a account..."}
                    </span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
                  <Command shouldFilter={false}>
                    <CommandInput
                      placeholder="Search Accounts..."
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
                          <CommandEmpty>No accounts found.</CommandEmpty>
                          {state.accounts.map((account) => (
                            <CommandItem
                              key={account.id}
                              value={String(account.id)}
                              onSelect={(val) => {
                                const num = Number(val);
                                const picked =
                                  state.accounts.find((u) => u.id === num) ??
                                  null;
                                setSelectedAccount(
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
                                  field.value === account.id
                                    ? "opacity-100"
                                    : "opacity-0",
                                )}
                              />
                              {account.name}
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
