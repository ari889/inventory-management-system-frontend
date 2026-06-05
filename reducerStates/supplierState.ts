import { baseInitialState } from "./baseInitialState";
import { InitialSupplierState } from "@/@types/supplier.types";

export const initialSupplierState: InitialSupplierState = {
  ...baseInitialState,
  suppliers: [],
  open: false,
  showUpdateModal: false,
  search: "",
  status: undefined,
  createdBy: undefined,
};
