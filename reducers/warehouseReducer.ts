import { ActionType } from "@/@types/reducer.types";
import { createReducer } from "./createReducer";
import { InitialWarehouseState, Warehouse } from "@/@types/warehouse.types";

const warehouseCustomReducer = (
  state: InitialWarehouseState,
  action: ActionType,
): InitialWarehouseState => {
  switch (action.type) {
    case "SELECT_ALL_ROWS":
      return {
        ...state,
        selectedRows: new Set(state.warehouses.map((m) => m.id)),
      };
    case "SET_WAREHOUSES":
      return { ...state, warehouses: action.payload as Warehouse[] };
    case "TOGGLE_MODAL":
      return { ...state, open: !state.open };
    case "REFRESH": {
      const newWarehouses = [action.payload as Warehouse, ...state.warehouses];
      if (newWarehouses.length > state.limit) newWarehouses.pop();
      return {
        ...state,
        warehouses: newWarehouses,
        totalCount: state.totalCount + 1,
      };
    }
    case "TOGGLE_UPDATE_MODAL":
      return {
        ...state,
        showUpdateModal: !state.showUpdateModal,
        selectedId: state.selectedId ? null : (action.payload as number),
      };
    case "UPDATE_SUCCESS": {
      const updatedWarehouse = action.payload as Warehouse;
      return {
        ...state,
        showUpdateModal: false,
        selectedId: null,
        warehouses: state.warehouses.map((w) =>
          w.id === updatedWarehouse.id ? updatedWarehouse : w,
        ),
      };
    }
    default:
      return state;
  }
};

export const warehouseReducer = createReducer<InitialWarehouseState>(
  warehouseCustomReducer,
);
