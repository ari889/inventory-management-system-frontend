import { InitialTaxState } from "@/@types/tax.types";
import { baseInitialState } from "./baseInitialState";

export const initialTaxState: InitialTaxState = {
  ...baseInitialState,
  taxes: [],
  open: false,
  showUpdateModal: false,
};
