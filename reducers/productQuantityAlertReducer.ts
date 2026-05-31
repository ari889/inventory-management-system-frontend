import { ActionType } from "@/@types/reducer.types";
import { createReducer } from "./createReducer";
import { InitialProductQuantityAlertReportState } from "@/@types/product-quantity-alert.types";
import { Product } from "@/@types/product.types";

const productQuantityAlertReportCustomReducer = (
  state: InitialProductQuantityAlertReportState,
  action: ActionType,
): InitialProductQuantityAlertReportState => {
  switch (action.type) {
    case "SET_PRODUCTS":
      return { ...state, products: action.payload as Product[] };
    case "SET_NAME":
      return {
        ...state,
        name: action.payload as string,
      };
    case "SET_BRAND_ID":
      return {
        ...state,
        brandId: action?.payload as number | undefined,
      };
    case "SET_CATEGORY_ID":
      return {
        ...state,
        categoryId: action?.payload as number | undefined,
      };
    case "SET_CODE":
      return {
        ...state,
        code: action?.payload as string,
      };
    default:
      return state;
  }
};

export const productQuantityAlertReportReducer =
  createReducer<InitialProductQuantityAlertReportState>(
    productQuantityAlertReportCustomReducer,
  );
