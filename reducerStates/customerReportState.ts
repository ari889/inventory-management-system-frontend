import { InitialCustomerReportState } from "@/@types/customer-report.types";
import { baseInitialState } from "./baseInitialState";

const now = new Date();

export const initialCustomerReportState: InitialCustomerReportState = {
  ...baseInitialState,
  sales: [],
  dateRange: {
    from: new Date(now.getFullYear(), now.getMonth(), 1),
    to: new Date(now.getFullYear(), now.getMonth() + 1, 0),
  },
  saleNo: undefined,
  customerId: undefined,
};
