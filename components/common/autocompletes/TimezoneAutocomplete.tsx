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

type TimezoneOption = { value: string; label: string; offset: string };

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

const getUtcOffset = (tz: string): string => {
  try {
    const parts = new Intl.DateTimeFormat("en", {
      timeZone: tz,
      timeZoneName: "shortOffset",
    }).formatToParts(new Date());
    return parts.find((p) => p.type === "timeZoneName")?.value ?? "UTC";
  } catch {
    return "UTC";
  }
};

// Built once at module level
const ALL_TIMEZONES: TimezoneOption[] = Intl.supportedValuesOf("timeZone").map(
  (tz) => {
    const offset = getUtcOffset(tz);
    return {
      value: tz,
      offset,
      label: `(${offset}) ${tz.replace(/_/g, " ")}`,
    };
  },
);

type Props<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  disabled?: boolean;
};

export default function TimezoneAutocomplete<T extends FieldValues>({
  control,
  name,
  label = "Timezone",
  disabled = false,
}: Props<T>) {
  const [state, dispatch] = useReducer(reducer, { open: false, search: "" });
  const listRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    const q = state.search.toLowerCase();
    if (!q) return ALL_TIMEZONES;
    return ALL_TIMEZONES.filter(
      (tz) =>
        tz.value.toLowerCase().includes(q) ||
        tz.offset.toLowerCase().includes(q),
    ).slice(0, 80);
  }, [state.search]);

  const handleSearch = useCallback((query: string) => {
    dispatch({ type: "SET_SEARCH", payload: query });
  }, []);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const selected = ALL_TIMEZONES.find((tz) => tz.value === field.value);

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
                    {selected ? selected.label : "Select timezone"}
                  </span>
                  <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
                <Command shouldFilter={false}>
                  <CommandInput
                    placeholder="Search by city or UTC offset..."
                    value={state.search}
                    onValueChange={handleSearch}
                  />
                  <CommandList ref={listRef}>
                    <CommandEmpty>No timezone found.</CommandEmpty>
                    {filtered.map((tz) => (
                      <CommandItem
                        key={tz.value}
                        value={tz.value}
                        onSelect={(val) => {
                          field.onChange(val === field.value ? "" : val);
                          dispatch({ type: "SET_OPEN", payload: false });
                          dispatch({ type: "SET_SEARCH", payload: "" });
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            field.value === tz.value
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                        {tz.label}
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
