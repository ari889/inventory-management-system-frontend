"use client";
import { Unit } from "@/@types/unit.types";
import { FilterProps } from "@/@types/filter.types";
import { getUnits } from "@/actions/UnitAction";
import { FilterOption } from "@/hooks/useInfiniteFilter";
import FilterCombobox from "./FilterCombobox";

const mapUnit = (item: Unit): FilterOption => ({
  id: item.id,
  label: item.unitName as string,
});

export default function UnitFilter({
  value,
  onChange,
  label = "Select unit",
  defaultOption,
}: FilterProps) {
  return (
    <FilterCombobox<Unit>
      value={value}
      onChange={onChange}
      label={label}
      placeholder="Select an unit..."
      loadingText="Loading units..."
      searchPlaceholder="Search units..."
      emptyText="No units found."
      defaultOption={defaultOption}
      fetchFn={getUnits}
      mapFn={mapUnit}
    />
  );
}
