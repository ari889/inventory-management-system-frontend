import { InitialPayrollState } from "@/@types/payroll.types";
import { baseInitialState } from "./baseInitialState";

export const initialPayrollState: InitialPayrollState = {
  ...baseInitialState,
  payrolls: [],
  open: false,
  showUpdateModal: false,
};
