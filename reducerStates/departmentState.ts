import { baseInitialState } from "./baseInitialState";
import { InitialDepartmentState } from "@/@types/department.types";

export const initialDepartmentState: InitialDepartmentState = {
  ...baseInitialState,
  departments: [],
  open: false,
  showUpdateModal: false,
  search: "",
};
