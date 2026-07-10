"use client";
import { FilterProps } from "@/@types/filter.types";
import { FilterOption } from "@/hooks/useInfiniteFilter";
import FilterCombobox from "./FilterCombobox";
import { ExpenseCategory } from "@/@types/expense-category.types";
import { getExpenseCategories } from "@/actions/ExpenseCategoryAction";

const mapExpenseCategory = (item: ExpenseCategory): FilterOption => ({
  id: item.id,
  label: item.name,
});

export default function ExpenseCategoryFilter({
  value,
  onChange,
  label = "Select expense category",
  defaultOption,
}: FilterProps) {
  return (
    <FilterCombobox
      value={value}
      onChange={onChange}
      label={label}
      placeholder="Select an expense category..."
      loadingText="Loading expense categorys..."
      searchPlaceholder="Search expense categorys..."
      emptyText="No expense categorys found."
      defaultOption={defaultOption}
      fetchFn={getExpenseCategories}
      mapFn={mapExpenseCategory}
    />
  );
}
