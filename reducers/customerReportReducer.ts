import { ActionType } from "@/@types/reducer.types";
import { createReducer } from "./createReducer";
import { InitialCustomerReportState } from "@/@types/customer-report.types";
import { DateRange } from "react-day-picker";
import { Sale } from "@/@types/sale.types";

const customerReportCustomReducer = (
  state: InitialCustomerReportState,
  action: ActionType,
): InitialCustomerReportState => {
  switch (action.type) {
    case "SET_SALES":
      return { ...state, sales: action.payload as Sale[] };
    case "SET_DATE_RANGE":
      return {
        ...state,
        dateRange: action.payload as DateRange,
      };
    case "SET_CUSTOMER_ID":
      return {
        ...state,
        customerId: action?.payload as number | undefined,
      };
    case "SET_SALE_NO":
      return {
        ...state,
        saleNo: action?.payload as string | undefined,
      };
    default:
      return state;
  }
};

export const customerReportReducer = createReducer<InitialCustomerReportState>(
  customerReportCustomReducer,
);
