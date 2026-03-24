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
import { useEffect, useReducer, useRef, useCallback } from "react";
import { Role } from "@/@types/role.types";
import { Spinner } from "@/components/ui/spinner";
import { getRoles } from "@/actions/RoleAction";
import debounce from "lodash/debounce";
import { Control, Controller, FieldValues, Path } from "react-hook-form";

type Props<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label?: string;
};

type State = {
  roles: Role[];
  loading: boolean;
  searching: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  error: string | null; // API or validation errors
  open: boolean;
  search: string;
};

type Action =
  | { type: "FETCH_START"; payload: { replace: boolean; initial: boolean } }
  | {
      type: "FETCH_SUCCESS";
      payload: { items: Role[]; total: number; page: number; replace: boolean };
    }
  | { type: "FETCH_ERROR"; payload: string | null }
  | { type: "SET_OPEN"; payload: boolean }
  | { type: "SET_SEARCH"; payload: string };

const initialState: State = {
  roles: [],
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
        roles: replace ? items : [...state.roles, ...items],
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

export default function RoleAutocomplete<T extends FieldValues>({
  control,
  name,
  label = "Select Role",
}: Props<T>) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const listRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef(0);
  const searchRef = useRef("");
  const initialLoadRef = useRef(true);

  const fetchRoles = async (
    nextPage: number,
    nextSearch: string,
    replace: boolean,
  ) => {
    try {
      dispatch({
        type: "FETCH_START",
        payload: { replace, initial: initialLoadRef.current },
      });

      const response = await getRoles({
        page: nextPage,
        limit: 10,
        order: "id",
        direction: "desc",
        search: nextSearch,
        deletable: null,
      });

      if (!response.success) throw new Error(response.message);

      dispatch({
        type: "FETCH_SUCCESS",
        payload: {
          items: response.data.items,
          total: response.data.totalItems,
          page: nextPage,
          replace,
        },
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
    fetchRoles(0, "", true);
  }, []);

  const debouncedFetch = useCallback(
    debounce((query: string) => {
      pageRef.current = 0;
      fetchRoles(0, query, true);
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
      fetchRoles(nextPage, searchRef.current, false);
    }
  }, [state.loadingMore, state.hasMore]);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const selectedLabel = state.roles.find(
          (r) => r.id === field.value,
        )?.roleName;

        return (
          <Field data-invalid={fieldState.invalid}>
            {label && <FieldLabel>{label}</FieldLabel>}

            {state.loading ? (
              <Button
                variant="default"
                disabled
                className="w-full justify-start font-normal"
              >
                <Spinner className="mr-2" />
                Loading roles...
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
                    className={`w-full justify-between font-normal ${fieldState.invalid ? "border-red-500" : ""}`}
                  >
                    <span
                      className={cn(!selectedLabel && "text-muted-foreground")}
                    >
                      {selectedLabel ?? "Select role"}
                    </span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
                  <Command shouldFilter={false}>
                    <CommandInput
                      placeholder="Search roles..."
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
                          <CommandEmpty>No roles found.</CommandEmpty>
                          {state.roles.map((role) => (
                            <CommandItem
                              key={role.id}
                              value={String(role.id)}
                              onSelect={(val) => {
                                const num = Number(val);
                                field.onChange(
                                  num === field.value ? null : num,
                                );
                                dispatch({ type: "SET_OPEN", payload: false });
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  field.value === role.id
                                    ? "opacity-100"
                                    : "opacity-0",
                                )}
                              />
                              {role.roleName}
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

            {/* Show both API errors and RHF validation errors */}
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
