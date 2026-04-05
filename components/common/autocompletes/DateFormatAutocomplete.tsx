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
import { useMemo, useReducer } from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";

type DateFormatOption = { value: string; label: string };

type State = { open: boolean; search: string };
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

const formatSample = (pattern: string): string => {
  const now = new Date();
  return pattern
    .replace("MMMM", now.toLocaleString("en", { month: "long" }))
    .replace("MMM", now.toLocaleString("en", { month: "short" }))
    .replace("MM", String(now.getMonth() + 1).padStart(2, "0"))
    .replace("DD", String(now.getDate()).padStart(2, "0"))
    .replace("YYYY", String(now.getFullYear()));
};

const DATE_FORMAT_OPTIONS: DateFormatOption[] = [
  "MM/DD/YYYY",
  "DD/MM/YYYY",
  "YYYY-MM-DD",
  "DD-MM-YYYY",
  "MM-DD-YYYY",
  "YYYY/MM/DD",
  "DD.MM.YYYY",
  "MMMM DD, YYYY",
  "MMM DD, YYYY",
  "DD MMMM YYYY",
].map((fmt) => ({
  value: fmt,
  label: `${fmt}  →  ${formatSample(fmt)}`,
}));

type Props<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  disabled?: boolean;
};

export default function DateFormatAutocomplete<T extends FieldValues>({
  control,
  name,
  label = "Date Format",
  disabled = false,
}: Props<T>) {
  const [state, dispatch] = useReducer(reducer, { open: false, search: "" });

  const filtered = useMemo(() => {
    const q = state.search.toLowerCase();
    if (!q) return DATE_FORMAT_OPTIONS;
    return DATE_FORMAT_OPTIONS.filter(
      (f) =>
        f.value.toLowerCase().includes(q) || f.label.toLowerCase().includes(q),
    );
  }, [state.search]);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const selected = DATE_FORMAT_OPTIONS.find(
          (f) => f.value === field.value,
        );

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
                    {selected ? selected.label : "Select date format"}
                  </span>
                  <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
                <Command shouldFilter={false}>
                  <CommandInput
                    placeholder="Search format..."
                    value={state.search}
                    onValueChange={(q) =>
                      dispatch({ type: "SET_SEARCH", payload: q })
                    }
                  />
                  <CommandList>
                    <CommandEmpty>No format found.</CommandEmpty>
                    {filtered.map((fmt) => (
                      <CommandItem
                        key={fmt.value}
                        value={fmt.value}
                        onSelect={(val) => {
                          field.onChange(val === field.value ? "" : val);
                          dispatch({ type: "SET_OPEN", payload: false });
                          dispatch({ type: "SET_SEARCH", payload: "" });
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            field.value === fmt.value
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                        {fmt.label}
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
