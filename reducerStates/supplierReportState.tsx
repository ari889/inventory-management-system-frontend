import { InitialSupplierReportState } from "@/@types/supplier-report.types";
import { baseInitialState } from "./baseInitialState";

const now = new Date();

export const initialSupplierReportState: InitialSupplierReportState = {
  ...baseInitialState,
  purchases: [],
  dateRange: {
    from: new Date(now.getFullYear(), now.getMonth(), 1),
    to: new Date(now.getFullYear(), now.getMonth() + 1, 0),
  },
  purchaseNo: undefined,
  supplierId: undefined,
};
