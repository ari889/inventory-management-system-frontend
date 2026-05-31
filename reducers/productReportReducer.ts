import { ActionType } from "@/@types/reducer.types";
import { createReducer } from "./createReducer";
import { InitialProductReportState } from "@/@types/product-report.types";
import { DateRange } from "react-day-picker";
import { Product } from "@/@types/product.types";

const productReportCustomReducer = (
  state: InitialProductReportState,
  action: ActionType,
): InitialProductReportState => {
  switch (action.type) {
    case "SET_PRODUCTS":
      return { ...state, products: action.payload as Product[] };
    case "SET_DATE_RANGE":
      return {
        ...state,
        dateRange: action.payload as DateRange,
      };
    case "SET_WAREHOUSE_ID":
      return {
        ...state,
        warehouseId: action?.payload as number | undefined,
      };
    default:
      return state;
  }
};

export const productReportReducer = createReducer<InitialProductReportState>(
  productReportCustomReducer,
);
