import { ActionType } from "@/@types/reducer.types";
import { createReducer } from "./createReducer";
import { Purchase, InitialPurchaseState } from "@/@types/purchase.types";

const purchaseCustomReducer = (
  state: InitialPurchaseState,
  action: ActionType,
): InitialPurchaseState => {
  switch (action.type) {
    case "SELECT_ALL_ROWS":
      return {
        ...state,
        selectedRows: new Set(state.purchases.map((m) => m.id)),
      };
    case "SET_PURCHASES":
      return { ...state, purchases: action.payload as Purchase[] };
    case "REFRESH": {
      const newPurchases = [action.payload as Purchase, ...state.purchases];
      if (newPurchases.length > state.limit) newPurchases.pop();
      return {
        ...state,
        purchases: newPurchases,
        totalCount: state.totalCount + 1,
      };
    }
    default:
      return state;
  }
};

export const purchaseReducer = createReducer<InitialPurchaseState>(
  purchaseCustomReducer,
);
