"use client";
import { Brand } from "@/@types/brand.types";
import { FilterProps } from "@/@types/filter.types";
import { getBrands } from "@/actions/BrandAction";
import { FilterOption } from "@/hooks/useInfiniteFilter";
import FilterCombobox from "./FilterCombobox";

const mapBrand = (item: Brand): FilterOption => ({
  id: item.id,
  label: item.title,
});

export default function BrandFilter({
  value,
  onChange,
  label = "Select brand",
  defaultOption,
}: FilterProps) {
  return (
    <FilterCombobox
      value={value}
      onChange={onChange}
      label={label}
      placeholder="Select a brand..."
      loadingText="Loading brands..."
      searchPlaceholder="Search brands..."
      emptyText="No brands found."
      defaultOption={defaultOption}
      fetchFn={getBrands}
      mapFn={mapBrand}
    />
  );
}
