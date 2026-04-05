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
import { useCallback, useMemo, useReducer, useRef } from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";

type CurrencyOption = { value: string; label: string; symbol: string };

type State = {
  open: boolean;
  search: string;
};

type Action =
  | { type: "SET_OPEN"; payload: boolean }
  | { type: "SET_SEARCH"; payload: string };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_OPEN":
      return { ...state, open: action.payload };
    case "SET_SEARCH":
      return { ...state, search: action.payload };
    default:
      return state;
  }
}

/**
 * CurrencyCodeAutocomplete component that allows users to select a currency code from a searchable dropdown list. It uses the Intl API to get the list of supported currencies and their codes, and integrates with react-hook-form for form state management.
 */
const ALL_CURRENCIES: CurrencyOption[] = Intl.supportedValuesOf("currency").map(
  (code) => {
    const symbol =
      new Intl.NumberFormat("en", {
        style: "currency",
        currency: code,
        currencyDisplay: "narrowSymbol",
      })
        .formatToParts(0)
        .find((p) => p.type === "currency")?.value ?? code;

    const name =
      new Intl.DisplayNames(["en"], { type: "currency" }).of(code) ?? code;

    return {
      value: code,
      symbol,
      label: `${code} — ${name} (${symbol})`,
    };
  },
);

type Props<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  disabled?: boolean;
};

export default function CurrencyCodeAutocomplete<T extends FieldValues>({
  control,
  name,
  label = "Currency",
  disabled = false,
}: Props<T>) {
  const [state, dispatch] = useReducer(reducer, { open: false, search: "" });
  const listRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    const q = state.search.toLowerCase();
    if (!q) return ALL_CURRENCIES;
    return ALL_CURRENCIES.filter(
      (c) =>
        c.value.toLowerCase().includes(q) || c.label.toLowerCase().includes(q),
    ).slice(0, 50); // cap for performance
  }, [state.search]);

  const handleSearch = useCallback((query: string) => {
    dispatch({ type: "SET_SEARCH", payload: query });
  }, []);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const selected = ALL_CURRENCIES.find((c) => c.value === field.value);

        return (
          <Field data-invalid={fieldState.invalid}>
            {label && <FieldLabel>{label}</FieldLabel>}

            <Popover
              open={state.open}
              onOpenChange={(v) => dispatch({ type: "SET_OPEN", payload: v })}
              modal
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  disabled={disabled}
                  aria-expanded={state.open}
                  className={cn(
                    "w-full justify-between font-normal",
                    fieldState.invalid && "border-destructive",
                  )}
                >
                  <span className={cn(!selected && "text-muted-foreground")}>
                    {selected ? selected.label : "Select currency"}
                  </span>
                  <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
                <Command shouldFilter={false}>
                  <CommandInput
                    placeholder="Search by code or name..."
                    value={state.search}
                    onValueChange={handleSearch}
                  />
                  <CommandList ref={listRef}>
                    <CommandEmpty>No currency found.</CommandEmpty>
                    {filtered.map((currency) => (
                      <CommandItem
                        key={currency.value}
                        value={currency.value}
                        onSelect={(val) => {
                          field.onChange(val === field.value ? "" : val);
                          dispatch({ type: "SET_OPEN", payload: false });
                          dispatch({ type: "SET_SEARCH", payload: "" });
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            field.value === currency.value
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                        {currency.label}
                      </CommandItem>
                    ))}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            {fieldState.error?.message && (
              <FieldError>{fieldState.error.message}</FieldError>
            )}
          </Field>
        );
      }}
    />
  );
}
