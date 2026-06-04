import { ActionType } from "@/@types/reducer.types";
import { createReducer } from "./createReducer";
import { InitialTaxState, Tax } from "@/@types/tax.types";

const taxCustomReducer = (
  state: InitialTaxState,
  action: ActionType,
): InitialTaxState => {
  switch (action.type) {
    case "SELECT_ALL_ROWS":
      return {
        ...state,
        selectedRows: new Set(state.taxes.map((m) => m.id)),
      };
    case "SET_TAXES":
      return { ...state, taxes: action.payload as Tax[] };
    case "TOGGLE_MODAL":
      return { ...state, open: !state.open };
    case "REFRESH": {
      const newTaxes = [action.payload as Tax, ...state.taxes];
      if (newTaxes.length > state.limit) newTaxes.pop();
      return {
        ...state,
        taxes: newTaxes,
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
      const updatedTax = action.payload as Tax;
      return {
        ...state,
        showUpdateModal: false,
        selectedId: null,
        taxes: state.taxes.map((w) =>
          w.id === updatedTax.id ? updatedTax : w,
        ),
      };
    }
    case "SET_SEARCH":
      return { ...state, search: action.payload as string };
    case "SET_STATUS":
      return { ...state, status: action.payload as boolean };
    default:
      return state;
  }
};

export const taxReducer = createReducer<InitialTaxState>(taxCustomReducer);
