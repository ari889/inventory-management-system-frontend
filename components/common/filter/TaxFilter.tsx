"use client";
import { Tax } from "@/@types/tax.types";
import { FilterProps } from "@/@types/filter.types";
import { FilterOption } from "@/hooks/useInfiniteFilter";
import FilterCombobox from "./FilterCombobox";
import { getTaxes } from "@/actions/TaxAction";

const mapTax = (item: Tax): FilterOption => ({
  id: item.id,
  label: item.name,
});

export default function TaxFilter({
  value,
  onChange,
  label = "Select tax",
  defaultOption,
}: FilterProps) {
  return (
    <FilterCombobox<Tax>
      value={value}
      onChange={onChange}
      label={label}
      placeholder="Select an tax..."
      loadingText="Loading taxs..."
      searchPlaceholder="Search taxs..."
      emptyText="No taxs found."
      defaultOption={defaultOption}
      fetchFn={getTaxes}
      mapFn={mapTax}
    />
  );
}
