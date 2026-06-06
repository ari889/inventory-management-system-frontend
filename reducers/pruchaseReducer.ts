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
    case "TOGGLE_ADD_PAYMENT_MODAL":
      return {
        ...state,
        showAddPaymentModal: !state.showAddPaymentModal,
        purchaseIdForPayment: state.purchaseIdForPayment
          ? null
          : (action.payload as number),
      };
    case "TOGGLE_PURCHASE_PAYMENTS":
      return {
        ...state,
        showPurchasePayments: !state.showPurchasePayments,
        purchaseIdForPayment: state.purchaseIdForPayment
          ? null
          : (action.payload as number),
      };
    case "SET_SEARCH":
      return { ...state, search: action.payload as string, page: 0 };
    case "SET_STATUS":
      return { ...state, status: action.payload as boolean, page: 0 };
    case "SET_CREATED_BY":
      return { ...state, createdBy: action.payload as number, page: 0 };
    case "SET_SUPPLIER_ID":
      return { ...state, supplierId: action.payload as number, page: 0 };
    case "SET_WAREHOUSE_ID":
      return { ...state, warehouseId: action.payload as number, page: 0 };
    default:
      return state;
  }
};

export const purchaseReducer = createReducer<InitialPurchaseState>(
  purchaseCustomReducer,
);
