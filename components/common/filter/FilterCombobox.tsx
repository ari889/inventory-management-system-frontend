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
import { Spinner } from "@/components/ui/spinner";
import { Field, FieldLabel } from "@/components/ui/field";
import { FilterOption, useInfiniteFilter } from "@/hooks/useInfiniteFilter";

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

type Props<T> = {
  value: number | null | undefined;
  onChange: (value: number | undefined) => void;
  label?: string;
  placeholder?: string;
  loadingText?: string;
  emptyText?: string;
  searchPlaceholder?: string;
  defaultOption?: FilterOption | null;
  fetchFn: FetchFn;
  mapFn: (item: T) => FilterOption;
};

export default function FilterCombobox<T>({
  value,
  onChange,
  label,
  placeholder = "Select an option...",
  loadingText = "Loading...",
  emptyText = "No results found.",
  searchPlaceholder = "Search...",
  defaultOption = null,
  fetchFn,
  mapFn,
}: Props<T>) {
  const { state, listRef, handleSearch, handleScroll, handleSelect, setOpen } =
    useInfiniteFilter<T>({ fetchFn, mapFn, defaultOption });

  const selectedLabel =
    state.selected?.label ?? state.options.find((o) => o.id === value)?.label;

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
          {loadingText}
        </Button>
      ) : (
        <Popover open={state.open} onOpenChange={setOpen} modal>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={state.open}
              className="w-full justify-between font-normal"
            >
              <span className={cn(!selectedLabel && "text-muted-foreground")}>
                {selectedLabel ?? placeholder}
              </span>
              <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
            <Command shouldFilter={false}>
              <CommandInput
                placeholder={searchPlaceholder}
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
                    <CommandEmpty>{emptyText}</CommandEmpty>
                    {state.options.map((option) => (
                      <CommandItem
                        key={option.id}
                        value={String(option.id)}
                        onSelect={(val) =>
                          handleSelect(Number(val), value, onChange)
                        }
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            value === option.id ? "opacity-100" : "opacity-0",
                          )}
                        />
                        {option.label}
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
