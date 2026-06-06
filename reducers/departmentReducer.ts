import { ActionType } from "@/@types/reducer.types";
import { createReducer } from "./createReducer";
import { Department, InitialDepartmentState } from "@/@types/department.types";

const departmentCustomReducer = (
  state: InitialDepartmentState,
  action: ActionType,
): InitialDepartmentState => {
  switch (action.type) {
    case "SELECT_ALL_ROWS":
      return {
        ...state,
        selectedRows: new Set(state.departments.map((m) => m.id)),
      };
    case "SET_DEPARTMENTS":
      return {
        ...state,
        departments: action.payload as Department[],
      };
    case "TOGGLE_MODAL":
      return { ...state, open: !state.open };
    case "REFRESH": {
      const newDepartment = [
        action.payload as Department,
        ...state.departments,
      ];
      if (newDepartment.length > state.limit) newDepartment.pop();
      return {
        ...state,
        departments: newDepartment,
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
      const updatedDepartment = action.payload as Department;
      return {
        ...state,
        showUpdateModal: false,
        selectedId: null,
        departments: state.departments.map((ec) =>
          ec.id === updatedDepartment.id ? updatedDepartment : ec,
        ),
      };
    }
    case "SET_SEARCH":
      return { ...state, search: action.payload as string, page: 0 };
    case "SET_STATUS":
      return { ...state, status: action.payload as boolean, page: 0 };
    case "SET_CREATED_BY":
      return { ...state, createdBy: action.payload as number, page: 0 };
    default:
      return state;
  }
};

export const departmentReducer = createReducer<InitialDepartmentState>(
  departmentCustomReducer,
);
