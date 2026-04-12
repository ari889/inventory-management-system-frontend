import { ActionType } from "@/@types/reducer.types";
import { createReducer } from "./createReducer";
import { Employee, InitialEmployeeState } from "@/@types/employee.types";

const employeeCustomReducer = (
  state: InitialEmployeeState,
  action: ActionType,
): InitialEmployeeState => {
  switch (action.type) {
    case "SELECT_ALL_ROWS":
      return {
        ...state,
        selectedRows: new Set(state.employees.map((m) => m.id)),
      };
    case "SET_EMPLOYEES":
      return { ...state, employees: action.payload as Employee[] };
    case "TOGGLE_MODAL":
      return { ...state, open: !state.open };
    case "REFRESH": {
      const newEmployee = [action.payload as Employee, ...state.employees];
      if (newEmployee.length > state.limit) newEmployee.pop();
      return {
        ...state,
        employees: newEmployee,
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
      const updatedEmployee = action.payload as Employee;
      return {
        ...state,
        showUpdateModal: false,
        selectedId: null,
        employees: state.employees.map((w) =>
          w.id === updatedEmployee.id ? updatedEmployee : w,
        ),
      };
    }
    default:
      return state;
  }
};

export const employeeReducer = createReducer<InitialEmployeeState>(
  employeeCustomReducer,
);
