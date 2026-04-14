import { baseInitialState } from "./baseInitialState";
import { InitialProductCategoryState } from "@/@types/product-category.types";

export const initialProductCategoryState: InitialProductCategoryState = {
  ...baseInitialState,
  productCategoris: [],
  open: false,
  showUpdateModal: false,
  search: "",
};
