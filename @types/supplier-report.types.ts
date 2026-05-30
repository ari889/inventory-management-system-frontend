import { DateRange } from "react-day-picker";
import { Purchase } from "./purchase.types";
import { InitialStateType } from "./reducer.types";

export interface InitialSupplierReportState extends InitialStateType {
  purchases: Purchase[];
  dateRange: DateRange;
  purchaseNo: string | undefined;
  supplierId: number | undefined;
}
