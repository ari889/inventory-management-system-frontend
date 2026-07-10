"use client";
import { FilterProps } from "@/@types/filter.types";
import { FilterOption } from "@/hooks/useInfiniteFilter";
import FilterCombobox from "./FilterCombobox";
import { CustomerGroup } from "@/@types/customer-group.types";
import { getCustomerGroups } from "@/actions/CustomerGroupAction";

const mapCustomerGroup = (item: CustomerGroup): FilterOption => ({
  id: item.id,
  label: item.groupName,
});

export default function CustomerGroupFilter({
  value,
  onChange,
  label = "Select customerGroup",
  defaultOption,
}: FilterProps) {
  return (
    <FilterCombobox
      value={value}
      onChange={onChange}
      label={label}
      placeholder="Select an customer group..."
      loadingText="Loading customer groups..."
      searchPlaceholder="Search customer groups..."
      emptyText="No customer groups found."
      defaultOption={defaultOption}
      fetchFn={getCustomerGroups}
      mapFn={mapCustomerGroup}
    />
  );
}
