import { ActionType } from "@/@types/reducer.types";
import { createReducer } from "./createReducer";
import {
  ExpenseCategory,
  InitialExpenseCategoryState,
} from "@/@types/expense-category.types";

const expenseCategoryCustomReducer = (
  state: InitialExpenseCategoryState,
  action: ActionType,
): InitialExpenseCategoryState => {
  switch (action.type) {
    case "SELECT_ALL_ROWS":
      return {
        ...state,
        selectedRows: new Set(state.expenseCategoris.map((m) => m.id)),
      };
    case "SET_EXPENSE_CATEGORIES":
      return {
        ...state,
        expenseCategoris: action.payload as ExpenseCategory[],
      };
    case "TOGGLE_MODAL":
      return { ...state, open: !state.open };
    case "REFRESH": {
      const newExpenseCategory = [
        action.payload as ExpenseCategory,
        ...state.expenseCategoris,
      ];
      if (newExpenseCategory.length > state.limit) newExpenseCategory.pop();
      return {
        ...state,
        expenseCategoris: newExpenseCategory,
        totalCount: state.totalCount + 1,
      };
    }
    case "TOGGLE_UPDATE_MODAL":
      return {
        ...state,
        showUpdateModal: !state.showUpdateModal,
        selectedId: state.selectedId ? null : (action.payload as number),
      };
    case "UPDATE_SUCCESS": {
      const updatedExpenseCategory = action.payload as ExpenseCategory;
      return {
        ...state,
        showUpdateModal: false,
        selectedId: null,
        expenseCategoris: state.expenseCategoris.map((ec) =>
          ec.id === updatedExpenseCategory.id ? updatedExpenseCategory : ec,
        ),
      };
    }
    case "SET_SEARCH":
      return { ...state, search: action.payload as string, page: 0 };
    case "SET_STATUS":
      return { ...state, status: action.payload as boolean, page: 0 };
    default:
      return state;
  }
};

export const expenseCategoryReducer =
  createReducer<InitialExpenseCategoryState>(expenseCategoryCustomReducer);
