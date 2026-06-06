import { ActionType } from "@/@types/reducer.types";
import { createReducer } from "./createReducer";
import { InitialPayrollState, Payroll } from "@/@types/payroll.types";

const payrollCustomReducer = (
  state: InitialPayrollState,
  action: ActionType,
): InitialPayrollState => {
  switch (action.type) {
    case "SELECT_ALL_ROWS":
      return {
        ...state,
        selectedRows: new Set(state.payrolls.map((p) => p.id)),
      };
    case "SET_PAYROLLS":
      return { ...state, payrolls: action.payload as Payroll[] };
    case "TOGGLE_MODAL":
      return { ...state, open: !state.open };
    case "REFRESH": {
      const newPayroll = [action.payload as Payroll, ...state.payrolls];
      if (newPayroll.length > state.limit) newPayroll.pop();
      return {
        ...state,
        payrolls: newPayroll,
        totalCount: state.totalCount + 1,
      };
    }
    case "TOGGLE_UPDATE_MODAL":
      return {
        ...state,
        showUpdateModal: !state.showUpdateModal,
        selectedId: state.selectedId ? null : (action.payload as number),
      };
    case "UPDATE_SUCCESS": {
      const updatedPayroll = action.payload as Payroll;
      return {
        ...state,
        showUpdateModal: false,
        selectedId: null,
        payrolls: state.payrolls.map((w) =>
          w.id === updatedPayroll.id ? updatedPayroll : w,
        ),
      };
    }
    case "SET_EMPLOYEE_ID":
      return { ...state, employeeId: action.payload as number, page: 0 };
    case "SET_ACCOUNT_ID":
      return { ...state, accountId: action.payload as number, page: 0 };
    case "SET_PAYMENT_METHODS":
      return {
        ...state,
        paymentMethods: action.payload as "CASH" | "CHEQUE" | "BANK",
        page: 0,
      };
    case "SET_CREATED_BY":
      return { ...state, createdBy: action.payload as number, page: 0 };
    default:
      return state;
  }
};

export const payrollReducer =
  createReducer<InitialPayrollState>(payrollCustomReducer);
