import { InitialStateType } from "./reducer.types";
import { WarehouseProduct } from "./product.types";

export interface InitialStockState extends InitialStateType {
  warehouseProducts: WarehouseProduct[];
  name: string;
  warehouseId: number | undefined;
}
