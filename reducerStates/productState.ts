import { InitialProductState } from "@/@types/product.types";
import { baseInitialState } from "./baseInitialState";

export const initialProductState: InitialProductState = {
  ...baseInitialState,
  products: [],
  open: false,
  showUpdateModal: false,
};
