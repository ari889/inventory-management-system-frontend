import { ActionType, InitialStateType } from "@/@types/reducer.types";
import { ColumnSort } from "@tanstack/react-table";

export const baseReducer = <T extends InitialStateType>(
  state: T,
  action: ActionType,
): T | null => {
  switch (action.type) {
    case "SET_SORTING":
      return { ...state, sorting: action.payload as ColumnSort[], page: 0 };
    case "SET_ERROR":
      return { ...state, isError: true, error: action.payload as string };
    case "REMOVE_ERROR":
      return { ...state, isError: false, error: null };
    case "SET_COUNT":
      return { ...state, totalCount: action.payload as number };
    case "SET_PAGE":
      return { ...state, page: action.payload as number };
    case "SET_PAGE_SIZE":
      return { ...state, limit: action.payload as number };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload as boolean };
    case "SET_DELETE_LOADING":
      return { ...state, deleteLoading: action.payload as boolean };
    case "OPEN_DELETE_MODAL":
      return {
        ...state,
        deleteOpen: true,
        selectedId: action.payload as number,
      };
    case "CLOSE_DELETE_MODAL":
      return { ...state, deleteOpen: false, selectedId: null };
    case "TOGGLE_ROW_SELECTION": {
      const newSelected = new Set(state.selectedRows);
      const id = action.payload as number;
      if (newSelected.has(id)) newSelected.delete(id);
      else newSelected.add(id);
      return { ...state, selectedRows: newSelected };
    }
    case "DESELECT_ALL_ROWS":
      return { ...state, selectedRows: new Set() };
    case "TOGGLE_BULK_DELETE_LOADING":
      return { ...state, bulkDeleteLoader: action.payload as boolean };
    case "TOGGLE_BULK_DELETE_MODAL":
      return { ...state, bulkDeleteOpen: !state.bulkDeleteOpen };
    default:
      return null;
  }
};
