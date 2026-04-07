import { InitialWarehouseState } from "@/@types/warehouse.types";
import { baseInitialState } from "./baseInitialState";

export const initialWarehouseState: InitialWarehouseState = {
  ...baseInitialState,
  warehouses: [],
  open: false,
  showUpdateModal: false,
};
