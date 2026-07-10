"use client";
import { Department } from "@/@types/department.types";
import { FilterProps } from "@/@types/filter.types";
import { FilterOption } from "@/hooks/useInfiniteFilter";
import FilterCombobox from "./FilterCombobox";
import { getDepartments } from "@/actions/DepartmentAction";

const mapDepartment = (item: Department): FilterOption => ({
  id: item.id,
  label: item.name,
});

export default function DepartmentFilter({
  value,
  onChange,
  label = "Select department",
  defaultOption,
}: FilterProps) {
  return (
    <FilterCombobox
      value={value}
      onChange={onChange}
      label={label}
      placeholder="Select a department..."
      loadingText="Loading departments..."
      searchPlaceholder="Search departments..."
      emptyText="No departments found."
      defaultOption={defaultOption}
      fetchFn={getDepartments}
      mapFn={mapDepartment}
    />
  );
}
