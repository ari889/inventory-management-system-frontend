import { ActionType } from "@/@types/reducer.types";
import { createReducer } from "./createReducer";
import { Brand, InitialBrandState } from "@/@types/brand.types";

const brandCustomReducer = (
  state: InitialBrandState,
  action: ActionType,
): InitialBrandState => {
  switch (action.type) {
    case "SELECT_ALL_ROWS":
      return {
        ...state,
        selectedRows: new Set(state.brands.map((m) => m.id)),
      };
    case "SET_BRANDS":
      return { ...state, brands: action.payload as Brand[] };
    case "TOGGLE_MODAL":
      return { ...state, open: !state.open };
    case "REFRESH": {
      const newBrands = [action.payload as Brand, ...state.brands];
      if (newBrands.length > state.limit) newBrands.pop();
      return {
        ...state,
        brands: newBrands,
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
      const updatedBrand = action.payload as Brand;
      return {
        ...state,
        showUpdateModal: false,
        selectedId: null,
        brands: state.brands.map((w) =>
          w.id === updatedBrand.id ? updatedBrand : w,
        ),
      };
    }
    default:
      return state;
  }
};

export const brandReducer =
  createReducer<InitialBrandState>(brandCustomReducer);
