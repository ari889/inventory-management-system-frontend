import { baseInitialState } from "./baseInitialState";
import { InitialProductReportState } from "@/@types/product-report.types";

const now = new Date();

export const initialProductReportState: InitialProductReportState = {
  ...baseInitialState,
  products: [],
  dateRange: {
    from: new Date(now.getFullYear(), now.getMonth(), 1),
    to: new Date(now.getFullYear(), now.getMonth() + 1, 0),
  },
  warehouseId: undefined,
};
