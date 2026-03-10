import { ColumnSort } from "@tanstack/react-table";

export interface InitialStateType {
  isLoading: boolean;
  sorting: ColumnSort[];
  isError: boolean;
  error: string | null;
  totalCount: number;
  page: number;
  limit: number;
  deleteOpen: boolean;
  deleteLoading: boolean;
  selectedId: number | null;
}

export interface ActionType {
  type: string;
  payload?: unknown;
}
