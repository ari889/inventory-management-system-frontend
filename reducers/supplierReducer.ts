import { ActionType } from "@/@types/reducer.types";
import { createReducer } from "./createReducer";
import { InitialSupplierState, Supplier } from "@/@types/supplier.types";

const supplierCustomReducer = (
  state: InitialSupplierState,
  action: ActionType,
): InitialSupplierState => {
  switch (action.type) {
    case "SELECT_ALL_ROWS":
      return {
        ...state,
        selectedRows: new Set(state.suppliers.map((m) => m.id)),
      };
    case "SET_SUPPLIERS":
      return { ...state, suppliers: action.payload as Supplier[] };
    case "TOGGLE_MODAL":
      return { ...state, open: !state.open };
    case "REFRESH": {
      const newSuppliers = [action.payload as Supplier, ...state.suppliers];
      if (newSuppliers.length > state.limit) newSuppliers.pop();
      return {
        ...state,
        suppliers: newSuppliers,
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
      const updatedSupplier = action.payload as Supplier;
      return {
        ...state,
        showUpdateModal: false,
        selectedId: null,
        suppliers: state.suppliers.map((w) =>
          w.id === updatedSupplier.id ? updatedSupplier : w,
        ),
      };
    }
    default:
      return state;
  }
};

export const supplierReducer = createReducer<InitialSupplierState>(
  supplierCustomReducer,
);
