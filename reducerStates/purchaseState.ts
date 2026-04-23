import { baseInitialState } from "./baseInitialState";
import { InitialPurchaseState } from "@/@types/purchase.types";

export const initialPurchaseState: InitialPurchaseState = {
  ...baseInitialState,
  purchases: [],
  open: false,
  showUpdateModal: false,
  showAddPaymentModal: false,
  purchaseIdForPayment: null,
  showPurchasePayments: false,
};
