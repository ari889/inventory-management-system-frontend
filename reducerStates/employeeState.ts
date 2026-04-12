import { baseInitialState } from "./baseInitialState";
import { InitialEmployeeState } from "@/@types/employee.types";

export const initialEmployeeState: InitialEmployeeState = {
  ...baseInitialState,
  employees: [],
  open: false,
  showUpdateModal: false,
};
