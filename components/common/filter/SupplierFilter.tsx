"use client";
import { Supplier } from "@/@types/supplier.types";
import { FilterProps } from "@/@types/filter.types";
import { getSuppliers } from "@/actions/SupplierAction";
import { FilterOption } from "@/hooks/useInfiniteFilter";
import FilterCombobox from "./FilterCombobox";

const mapSupplier = (item: Supplier): FilterOption => ({
  id: item.id,
  label: item.name,
});

export default function SupplierFilter({
  value,
  onChange,
  label = "Select supplier",
  defaultOption,
}: FilterProps) {
  return (
    <FilterCombobox<Supplier>
      value={value}
      onChange={onChange}
      label={label}
      placeholder="Select an supplier..."
      loadingText="Loading suppliers..."
      searchPlaceholder="Search suppliers..."
      emptyText="No suppliers found."
      defaultOption={defaultOption}
      fetchFn={getSuppliers}
      mapFn={mapSupplier}
    />
  );
}
