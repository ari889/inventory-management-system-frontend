import { InitialStockState } from "@/@types/stock.types";
import { baseInitialState } from "./baseInitialState";

export const initialStocktState: InitialStockState = {
  ...baseInitialState,
  warehouseProducts: [],
  name: "",
  warehouseId: undefined,
};
