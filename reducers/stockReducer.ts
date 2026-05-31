import { ActionType } from "@/@types/reducer.types";
import { createReducer } from "./createReducer";
import { InitialStockState } from "@/@types/stock.types";
import { WarehouseProduct } from "@/@types/product.types";

const stockCustomReducer = (
  state: InitialStockState,
  action: ActionType,
): InitialStockState => {
  switch (action.type) {
    case "SET_WAREHOUSE_PRODUCTS":
      return {
        ...state,
        warehouseProducts: action.payload as WarehouseProduct[],
      };
    case "SET_WAREHOUSE_ID":
      return {
        ...state,
        warehouseId: action?.payload as number | undefined,
      };
    case "SET_NAME":
      return {
        ...state,
        name: action?.payload as string,
      };
    default:
      return state;
  }
};

export const stockReducer =
  createReducer<InitialStockState>(stockCustomReducer);
