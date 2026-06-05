import { ActionType } from "@/@types/reducer.types";
import { createReducer } from "./createReducer";
import { Account, InitialAccountState } from "@/@types/account.types";

const accountCustomReducer = (
  state: InitialAccountState,
  action: ActionType,
): InitialAccountState => {
  switch (action.type) {
    case "SELECT_ALL_ROWS":
      return {
        ...state,
        selectedRows: new Set(state.accounts.map((m) => m.id)),
      };
    case "SET_ACCOUNTS":
      return { ...state, accounts: action.payload as Account[] };
    case "TOGGLE_MODAL":
      return { ...state, open: !state.open };
    case "REFRESH": {
      const newAccounts = [action.payload as Account, ...state.accounts];
      if (newAccounts.length > state.limit) newAccounts.pop();
      return {
        ...state,
        accounts: newAccounts,
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
      const updatedAccount = action.payload as Account;
      return {
        ...state,
        showUpdateModal: false,
        selectedId: null,
        accounts: state.accounts.map((w) =>
          w.id === updatedAccount.id ? updatedAccount : w,
        ),
      };
    }
    case "SET_SEARCH":
      return { ...state, search: action.payload as string, page: 0 };
    case "SET_STATUS":
      return { ...state, status: action.payload as boolean, page: 0 };
    case "SET_CREATED_BY":
      return { ...state, createdBy: action.payload as number, page: 0 };
    default:
      return state;
  }
};

export const accountReducer =
  createReducer<InitialAccountState>(accountCustomReducer);
