import { ActionType } from "@/@types/reducer.types";
import { createReducer } from "./createReducer";
import { Sale, InitialSaleState } from "@/@types/sale.types";

const saleCustomReducer = (
  state: InitialSaleState,
  action: ActionType,
): InitialSaleState => {
  switch (action.type) {
    case "SELECT_ALL_ROWS":
      return {
        ...state,
        selectedRows: new Set(state.sales.map((m) => m.id)),
      };
    case "SET_SALES":
      return { ...state, sales: action.payload as Sale[] };
    case "REFRESH": {
      const newSales = [action.payload as Sale, ...state.sales];
      if (newSales.length > state.limit) newSales.pop();
      return {
        ...state,
        sales: newSales,
        totalCount: state.totalCount + 1,
      };
    }
    case "TOGGLE_ADD_PAYMENT_MODAL":
      return {
        ...state,
        showAddPaymentModal: !state.showAddPaymentModal,
        saleIdForPayment: state.saleIdForPayment
          ? null
          : (action.payload as number),
      };
    case "TOGGLE_SALE_PAYMENTS":
      return {
        ...state,
        showSalePayments: !state.showSalePayments,
        saleIdForPayment: state.saleIdForPayment
          ? null
          : (action.payload as number),
      };
    default:
      return state;
  }
};

export const saleReducer = createReducer<InitialSaleState>(saleCustomReducer);
