import { DateRange } from "react-day-picker";
import { InitialStateType } from "./reducer.types";
import { Sale } from "./sale.types";

export interface InitialCustomerReportState extends InitialStateType {
  sales: Sale[];
  dateRange: DateRange;
  saleNo: string | undefined;
  customerId: number | undefined;
}
