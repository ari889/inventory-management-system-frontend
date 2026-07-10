"use client";
import { Warehouse } from "@/@types/warehouse.types";
import { FilterProps } from "@/@types/filter.types";
import { getWarehouses } from "@/actions/WarehouseAction";
import { FilterOption } from "@/hooks/useInfiniteFilter";
import FilterCombobox from "./FilterCombobox";

const mapWarehouse = (item: Warehouse): FilterOption => ({
  id: item.id,
  label: item.name,
});

export default function WarehouseFilter({
  value,
  onChange,
  label = "Select warehouse",
  defaultOption,
}: FilterProps) {
  return (
    <FilterCombobox<Warehouse>
      value={value}
      onChange={onChange}
      label={label}
      placeholder="Select an warehouse..."
      loadingText="Loading warehouses..."
      searchPlaceholder="Search warehouses..."
      emptyText="No warehouses found."
      defaultOption={defaultOption}
      fetchFn={getWarehouses}
      mapFn={mapWarehouse}
    />
  );
}
