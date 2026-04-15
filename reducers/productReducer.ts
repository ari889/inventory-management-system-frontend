import { ActionType } from "@/@types/reducer.types";
import { createReducer } from "./createReducer";
import { Product, InitialProductState } from "@/@types/product.types";

const productCustomReducer = (
  state: InitialProductState,
  action: ActionType,
): InitialProductState => {
  switch (action.type) {
    case "SELECT_ALL_ROWS":
      return {
        ...state,
        selectedRows: new Set(state.products.map((m) => m.id)),
      };
    case "SET_PRODUCTS":
      return { ...state, products: action.payload as Product[] };
    case "TOGGLE_MODAL":
      return { ...state, open: !state.open };
    case "REFRESH": {
      const newProducts = [action.payload as Product, ...state.products];
      if (newProducts.length > state.limit) newProducts.pop();
      return {
        ...state,
        products: newProducts,
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
      const updatedProduct = action.payload as Product;
      return {
        ...state,
        showUpdateModal: false,
        selectedId: null,
        products: state.products.map((p) =>
          p.id === updatedProduct.id ? updatedProduct : p,
        ),
      };
    }
    default:
      return state;
  }
};

export const productReducer =
  createReducer<InitialProductState>(productCustomReducer);
