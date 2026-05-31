import { baseInitialState } from "./baseInitialState";
import { InitialProductQuantityAlertReportState } from "@/@types/product-quantity-alert.types";

export const initialProductQuantityAlertReportState: InitialProductQuantityAlertReportState =
  {
    ...baseInitialState,
    products: [],
    name: "",
    code: "",
    brandId: undefined,
    categoryId: undefined,
  };
