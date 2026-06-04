import { InitialBrandState } from "@/@types/brand.types";
import { baseInitialState } from "./baseInitialState";

export const initialBrandState: InitialBrandState = {
  ...baseInitialState,
  brands: [],
  open: false,
  showUpdateModal: false,
  search: "",
  status: undefined,
};
