import { FilterOption } from "@/hooks/useInfiniteFilter";

export type FilterProps = {
  value: number | null | undefined;
  onChange: (value: number | undefined) => void;
  label?: string;
  defaultOption?: FilterOption | null;
};
