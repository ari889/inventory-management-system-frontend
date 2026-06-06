import { ActionType } from "@/@types/reducer.types";
import { createReducer } from "./createReducer";
import { Attendance, InitialAttendanceState } from "@/@types/attendance.types";

const attendanceCustomReducer = (
  state: InitialAttendanceState,
  action: ActionType,
): InitialAttendanceState => {
  switch (action.type) {
    case "SELECT_ALL_ROWS":
      return {
        ...state,
        selectedRows: new Set(state.attendances.map((m) => m.id)),
      };
    case "SET_ATTENDANCES":
      return { ...state, attendances: action.payload as Attendance[] };
    case "TOGGLE_MODAL":
      return { ...state, open: !state.open };
    case "REFRESH": {
      const newAttendances = [
        action.payload as Attendance,
        ...state.attendances,
      ];
      if (newAttendances.length > state.limit) newAttendances.pop();
      return {
        ...state,
        attendances: newAttendances,
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
      const updatedAccount = action.payload as Attendance;
      return {
        ...state,
        showUpdateModal: false,
        selectedId: null,
        attendances: state.attendances.map((a) =>
          a.id === updatedAccount.id ? updatedAccount : a,
        ),
      };
    }
    case "SET_EMPLOYEE_ID":
      return { ...state, employeeId: action.payload as number, page: 0 };
    case "SET_CREATED_BY":
      return { ...state, createdBy: action.payload as number, page: 0 };
    case "SET_STATUS":
      return { ...state, status: action.payload as boolean, page: 0 };
    case "SET_DATE":
      return { ...state, date: action.payload as string, page: 0 };
    default:
      return state;
  }
};

export const attendanceReducer = createReducer<InitialAttendanceState>(
  attendanceCustomReducer,
);
