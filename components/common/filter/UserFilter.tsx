"use client";
import { User } from "@/@types/user.types";
import { FilterProps } from "@/@types/filter.types";
import { getUsers } from "@/actions/UserAction";
import { FilterOption } from "@/hooks/useInfiniteFilter";
import FilterCombobox from "./FilterCombobox";

const mapUser = (item: User): FilterOption => ({
  id: item.id,
  label: item.name,
});

export default function UserFilter({
  value,
  onChange,
  label = "Select user",
  defaultOption,
}: FilterProps) {
  return (
    <FilterCombobox<User>
      value={value}
      onChange={onChange}
      label={label}
      placeholder="Select an user..."
      loadingText="Loading users..."
      searchPlaceholder="Search users..."
      emptyText="No users found."
      defaultOption={defaultOption}
      fetchFn={getUsers}
      mapFn={mapUser}
    />
  );
}
