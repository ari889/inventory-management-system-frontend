import { InitialUnitState } from "@/@types/unit.types";
import { baseInitialState } from "./baseInitialState";

export const initialUnitState: InitialUnitState = {
  ...baseInitialState,
  units: [],
  open: false,
  showUpdateModal: false,
  search: "",
  status: undefined,
  baseUnitId: undefined,
  createdBy: undefined,
};
