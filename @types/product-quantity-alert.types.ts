import { Product } from "./product.types";
import { InitialStateType } from "./reducer.types";

export interface InitialProductQuantityAlertReportState extends InitialStateType {
  products: Product[];
  name: string;
  code: string;
  brandId: number | undefined;
  categoryId: number | undefined;
}
