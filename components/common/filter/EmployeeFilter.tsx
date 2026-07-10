"use client";
import { Employee } from "@/@types/employee.types";
import { FilterProps } from "@/@types/filter.types";
import { getEmployees } from "@/actions/EmployeeAction";
import { FilterOption } from "@/hooks/useInfiniteFilter";
import FilterCombobox from "./FilterCombobox";

const mapEmployee = (item: Employee): FilterOption => ({
  id: item.id,
  label: item.name,
});

export default function EmployeeFilter({
  value,
  onChange,
  label = "Select employee",
  defaultOption,
}: FilterProps) {
  return (
    <FilterCombobox<Employee>
      value={value}
      onChange={onChange}
      label={label}
      placeholder="Select an employee..."
      loadingText="Loading employees..."
      searchPlaceholder="Search employees..."
      emptyText="No employees found."
      defaultOption={defaultOption}
      fetchFn={getEmployees}
      mapFn={mapEmployee}
    />
  );
}
