import { ActionType } from "@/@types/reducer.types";
import { createReducer } from "./createReducer";
import { Expense, InitialExpenseState } from "@/@types/expense.types";

const expenseCustomReducer = (
  state: InitialExpenseState,
  action: ActionType,
): InitialExpenseState => {
  switch (action.type) {
    case "SELECT_ALL_ROWS":
      return {
        ...state,
        selectedRows: new Set(state.expenses.map((m) => m.id)),
      };
    case "SET_EXPENSES":
      return {
        ...state,
        expenses: action.payload as Expense[],
      };
    case "TOGGLE_MODAL":
      return { ...state, open: !state.open };
    case "REFRESH": {
      const newExpense = [action.payload as Expense, ...state.expenses];
      if (newExpense.length > state.limit) newExpense.pop();
      return {
        ...state,
        expenses: newExpense,
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
      const updatedExpenses = action.payload as Expense;
      return {
        ...state,
        showUpdateModal: false,
        selectedId: null,
        expenses: state.expenses.map((e) =>
          e.id === updatedExpenses.id ? updatedExpenses : e,
        ),
      };
    }
    case "SET_EXPENSE_CATEGORY_ID":
      return { ...state, expenseCategoryId: action.payload as number, page: 0 };
    case "SET_WAREHOUSE_ID":
      return { ...state, warehouseId: action.payload as number, page: 0 };
    case "SET_ACCOUNT_ID":
      return { ...state, accountId: action.payload as number, page: 0 };
    case "SET_STATUS":
      return { ...state, status: action.payload as boolean, page: 0 };
    case "SET_CREATED_BY":
      return { ...state, createdBy: action.payload as number, page: 0 };
    default:
      return state;
  }
};

export const expenseReducer =
  createReducer<InitialExpenseState>(expenseCustomReducer);
