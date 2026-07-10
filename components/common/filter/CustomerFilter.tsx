"use client";
import { Customer } from "@/@types/customer.types";
import { FilterProps } from "@/@types/filter.types";
import { getCustomers } from "@/actions/CustomerAction";
import { FilterOption } from "@/hooks/useInfiniteFilter";
import FilterCombobox from "./FilterCombobox";

const mapCustomer = (item: Customer): FilterOption => ({
  id: item.id,
  label: item.name,
});

export default function CustomerFilter({
  value,
  onChange,
  label = "Select customer",
  defaultOption,
}: FilterProps) {
  return (
    <FilterCombobox<Customer>
      value={value}
      onChange={onChange}
      label={label}
      placeholder="Select an customer..."
      loadingText="Loading customers..."
      searchPlaceholder="Search customers..."
      emptyText="No customers found."
      defaultOption={defaultOption}
      fetchFn={getCustomers}
      mapFn={mapCustomer}
    />
  );
}
