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
    case "SET_SEARCH":
      return { ...state, search: action.payload as string, page: 0 };
    case "SET_STATUS":
      return { ...state, status: action.payload as boolean, page: 0 };
    case "SET_TAX_METHOD":
      return { ...state, taxMethod: action.payload as boolean, page: 0 };
    case "SET_CREATED_BY":
      return { ...state, createdBy: action.payload as number, page: 0 };
    case "SET_BRAND_ID":
      return { ...state, brandId: action.payload as number, page: 0 };
    case "SET_CATEGORY_ID":
      return { ...state, categoryId: action.payload as number, page: 0 };
    case "SET_UNIT_ID":
      return { ...state, unitId: action.payload as number, page: 0 };
    case "SET_PURCHASE_UNIT_ID":
      return { ...state, purchaseUnitId: action.payload as number, page: 0 };
    case "SET_SALE_UNIT_ID":
      return { ...state, saleUnitId: action.payload as number, page: 0 };
    case "SET_TAX_ID":
      return { ...state, taxId: action.payload as number, page: 0 };
    default:
      return state;
  }
};

export const productReducer =
  createReducer<InitialProductState>(productCustomReducer);
