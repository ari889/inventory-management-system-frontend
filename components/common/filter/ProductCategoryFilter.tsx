"use client";
import { FilterProps } from "@/@types/filter.types";
import { FilterOption } from "@/hooks/useInfiniteFilter";
import FilterCombobox from "./FilterCombobox";
import { ProductCategory } from "@/@types/product-category.types";
import { getProductCategories } from "@/actions/ProductCategoryAction";

const mapProductCategory = (item: ProductCategory): FilterOption => ({
  id: item.id,
  label: item.name,
});

export default function ProductCategoryFilter({
  value,
  onChange,
  label = "Select product category",
  defaultOption,
}: FilterProps) {
  return (
    <FilterCombobox
      value={value}
      onChange={onChange}
      label={label}
      placeholder="Select an product category..."
      loadingText="Loading product categorys..."
      searchPlaceholder="Search product categorys..."
      emptyText="No product categorys found."
      defaultOption={defaultOption}
      fetchFn={getProductCategories}
      mapFn={mapProductCategory}
    />
  );
}
