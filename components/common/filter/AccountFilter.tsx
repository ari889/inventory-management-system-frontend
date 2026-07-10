"use client";
import { Account } from "@/@types/account.types";
import { FilterProps } from "@/@types/filter.types";
import { getAccounts } from "@/actions/AccountAction";
import { FilterOption } from "@/hooks/useInfiniteFilter";
import FilterCombobox from "./FilterCombobox";

const mapAccount = (item: Account): FilterOption => ({
  id: item.id,
  label: item.name,
});

export default function AccountFilter({
  value,
  onChange,
  label = "Select account",
  defaultOption,
}: FilterProps) {
  return (
    <FilterCombobox<Account>
      value={value}
      onChange={onChange}
      label={label}
      placeholder="Select an account..."
      loadingText="Loading accounts..."
      searchPlaceholder="Search accounts..."
      emptyText="No accounts found."
      defaultOption={defaultOption}
      fetchFn={getAccounts}
      mapFn={mapAccount}
    />
  );
}
