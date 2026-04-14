import { ActionType } from "@/@types/reducer.types";
import { createReducer } from "./createReducer";
import {
  InitialProductCategoryState,
  ProductCategory,
} from "@/@types/product-category.types";

const productCategoryCustomReducer = (
  state: InitialProductCategoryState,
  action: ActionType,
): InitialProductCategoryState => {
  switch (action.type) {
    case "SELECT_ALL_ROWS":
      return {
        ...state,
        selectedRows: new Set(state.productCategoris.map((m) => m.id)),
      };
    case "SET_PRODUCT_CATEGORIES":
      return {
        ...state,
        productCategoris: action.payload as ProductCategory[],
      };
    case "TOGGLE_MODAL":
      return { ...state, open: !state.open };
    case "REFRESH": {
      const newProductCategory = [
        action.payload as ProductCategory,
        ...state.productCategoris,
      ];
      if (newProductCategory.length > state.limit) newProductCategory.pop();
      return {
        ...state,
        productCategoris: newProductCategory,
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
      const updatedProductCategory = action.payload as ProductCategory;
      return {
        ...state,
        showUpdateModal: false,
        selectedId: null,
        productCategoris: state.productCategoris.map((ec) =>
          ec.id === updatedProductCategory.id ? updatedProductCategory : ec,
        ),
      };
    }
    default:
      return state;
  }
};

export const productCategoryReducer =
  createReducer<InitialProductCategoryState>(productCategoryCustomReducer);
