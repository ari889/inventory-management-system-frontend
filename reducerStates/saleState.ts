import { baseInitialState } from "./baseInitialState";
import { InitialSaleState } from "@/@types/sale.types";

export const initialSaleState: InitialSaleState = {
  ...baseInitialState,
  sales: [],
  open: false,
  showUpdateModal: false,
  showAddPaymentModal: false,
  saleIdForPayment: null,
  showSalePayments: false,
};
