import { ActionType } from "@/@types/reducer.types";
import { createReducer } from "./createReducer";
import { Purchase } from "@/@types/purchase.types";
import { InitialSupplierReportState } from "@/@types/supplier-report.types";
import { DateRange } from "react-day-picker";

const supplierReportCustomReducer = (
  state: InitialSupplierReportState,
  action: ActionType,
): InitialSupplierReportState => {
  switch (action.type) {
    case "SET_PURCHASES":
      return { ...state, purchases: action.payload as Purchase[] };
    case "SET_DATE_RANGE":
      return {
        ...state,
        dateRange: action.payload as DateRange,
      };
    case "SET_SUPPLIER_ID":
      return {
        ...state,
        supplierId: action?.payload as number | undefined,
      };
    case "SET_PURCHASE_NO":
      return {
        ...state,
        purchaseNo: action?.payload as string | undefined,
      };
    default:
      return state;
  }
};

export const supplierReportReducer = createReducer<InitialSupplierReportState>(
  supplierReportCustomReducer,
);
