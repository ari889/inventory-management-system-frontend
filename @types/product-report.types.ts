import { DateRange } from "react-day-picker";
import { InitialStateType } from "./reducer.types";
import { Product } from "./product.types";

export interface InitialProductReportState extends InitialStateType {
  products: Product[];
  dateRange: DateRange;
  warehouseId: number | undefined;
}
