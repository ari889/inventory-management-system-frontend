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
  useState,
  useMemo,
} from "react";
import { Spinner } from "@/components/ui/spinner";
import debounce from "lodash/debounce";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { Employee } from "@/@types/employee.types";
import { getEmployees } from "@/actions/EmployeeAction";

/**
 * A reusable autocomplete component for selecting a employee. Fetches options from the server with support for searching and infinite scrolling.
 */
type Props<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  defaultEmployee?: Pick<Employee, "id" | "name"> | null;
};

/**
 * State management for the EmployeEAutocomplete component using useReducer. Handles loading states, error handling, and pagination for fetching employees.
 */
type State = {
  employees: Employee[];
  loading: boolean;
  searching: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  error: string | null;
  open: boolean;
  search: string;
};

/**
 * Actions for the reducer to manage the state of EmployeetAutocomplete, including fetching employees, handling search input, and managing the open state of the popover.
 */
type Action =
  | { type: "FETCH_START"; payload: { replace: boolean; initial: boolean } }
  | {
      type: "FETCH_SUCCESS";
      payload: {
        items: Employee[];
        total: number;
        page: number;
        replace: boolean;
      };
    }
  | { type: "FETCH_ERROR"; payload: string | null }
  | { type: "SET_OPEN"; payload: boolean }
  | { type: "SET_SEARCH"; payload: string };

/**
 * Reducer function to manage the state of the EmployeeAutocomplete component. Handles different action types to update the state accordingly, such as starting a fetch, successfully fetching data, handling errors, and updating search input.
 * @param state - The current state of the component.
 * @param action - The action to be processed to update the state.
 * @returns The updated state based on the action type.
 */
const initialState: State = {
  employees: [],
  loading: true,
  searching: false,
  loadingMore: false,
  hasMore: true,
  error: null,
  open: false,
  search: "",
};

/**
 * Reducer function to manage the state of the EmployeeAutocomplete component. Handles different action types to update the state accordingly, such as starting a fetch, successfully fetching data, handling errors, and updating search input.
 * @param state - The current state of the component.
 * @param action - The action to be processed to update the state.
 * @returns The updated state based on the action type.
 */
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
        employees: replace ? items : [...state.employees, ...items],
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

export default function EmployeeAutocomplete<T extends FieldValues>({
  control,
  name,
  label = "Select employee",
  defaultEmployee = null,
}: Props<T>) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [selectedEmployee, setSelectedEmployee] = useState<Pick<
    Employee,
    "id" | "name"
  > | null>(defaultEmployee);
  const listRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef(0);
  const searchRef = useRef("");
  const initialLoadRef = useRef(true);

  /**
   * Fetch employees from the server with support for pagination and searching. Dispatches actions to update the state based on the fetch status (loading, success, error) and whether it's an initial load, a search, or loading more items.
   * @param nextPage
   * @param nextSearch
   * @param replace
   */
  const fetchEmployees = useCallback(
    async (nextPage: number, nextSearch: string, replace: boolean) => {
      try {
        dispatch({
          type: "FETCH_START",
          payload: { replace, initial: initialLoadRef.current },
        });

        const response = await getEmployees({
          page: nextPage,
          limit: 10,
          order: "id",
          direction: "desc",
          search: nextSearch,
        });

        if (!response.success) throw new Error(response.message);

        const items: Employee[] = response.data.items;
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

  /**
   * Initial fetch of employees when the component mounts. This ensures that the autocomplete has options to display when the user interacts with it for the first time. The empty dependency array ensures this effect runs only once on mount.
   */
  useEffect(() => {
    fetchEmployees(0, "", true);
  }, [fetchEmployees]);

  /**
   * Set the default selected employee when the component mounts or when the defaultEmployee prop changes. This ensures that if an initial employee is provided from the parent component, it will be displayed as the selected option in the autocomplete.
   */
  useEffect(() => {
    if (defaultEmployee) setSelectedEmployee(defaultEmployee);
  }, [defaultEmployee]);

  const debouncedFetch = useMemo(
    () =>
      debounce((query: string) => {
        pageRef.current = 0;
        fetchEmployees(0, query, true);
      }, 400),
    [fetchEmployees],
  );

  useEffect(() => {
    return () => debouncedFetch.cancel();
  }, [debouncedFetch]);

  /**
   * Handle search input changes by updating the search state and triggering a debounced fetch to retrieve units matching the search query. This allows users to find specific units quickly without overwhelming the server with requests on every keystroke.
   * @param query
   */
  const handleSearch = (query: string) => {
    dispatch({ type: "SET_SEARCH", payload: query });
    searchRef.current = query;
    debouncedFetch(query);
  };

  /**
   * Handle scroll events on the dropdown list to implement infinite scrolling. When the user scrolls near the bottom of the list, it triggers a fetch for the next page of items. It also prevents if there are more items to load and if a fetch is not already in progress.
   */
  const handleScroll = useCallback(() => {
    const el = listRef.current;
    if (!el || state.loadingMore || !state.hasMore) return;
    const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 40;
    if (nearBottom) {
      const nextPage = pageRef.current + 1;
      pageRef.current = nextPage;
      fetchEmployees(nextPage, searchRef.current, false);
    }
  }, [state.loadingMore, state.hasMore, fetchEmployees]);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const selectedLabel =
          selectedEmployee?.name ??
          state.employees.find((e) => e.id === field.value)?.name;

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
                Loading employees...
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
                      {selectedLabel ?? "Select a employee..."}
                    </span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
                  <Command shouldFilter={false}>
                    <CommandInput
                      placeholder="Search employees..."
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
                          <CommandEmpty>No employees found.</CommandEmpty>
                          {state.employees.map((employee) => (
                            <CommandItem
                              key={employee.id}
                              value={String(employee.id)}
                              onSelect={(val) => {
                                const num = Number(val);
                                const picked =
                                  state.employees.find((u) => u.id === num) ??
                                  null;
                                setSelectedEmployee(
                                  num === field.value ? null : picked,
                                );
                                field.onChange(
                                  num === field.value ? null : num,
                                );
                                dispatch({
                                  type: "SET_OPEN",
                                  payload: false,
                                });
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  field.value === employee.id
                                    ? "opacity-100"
                                    : "opacity-0",
                                )}
                              />
                              {employee.name}
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
