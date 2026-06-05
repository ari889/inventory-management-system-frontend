import { InitialProductState } from "@/@types/product.types";
import { baseInitialState } from "./baseInitialState";

export const initialProductState: InitialProductState = {
  ...baseInitialState,
  products: [],
  open: false,
  showUpdateModal: false,
  search: "",
  status: undefined,
  taxMethod: undefined,
  createdBy: undefined,
  brandId: undefined,
  categoryId: undefined,
  unitId: undefined,
  purchaseUnitId: undefined,
  saleUnitId: undefined,
  taxId: undefined,
};
