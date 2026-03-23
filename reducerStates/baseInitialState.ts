import { InitialStateType } from "@/@types/reducer.types";

export const baseInitialState: InitialStateType = {
  isLoading: true,
  sorting: [],
  isError: false,
  error: null,
  totalCount: 0,
  page: 0,
  limit: 10,
  deleteOpen: false,
  deleteLoading: false,
  selectedId: null,
  selectedRows: new Set<number>(),
  bulkDeleteLoader: false,
  bulkDeleteOpen: false,
};
