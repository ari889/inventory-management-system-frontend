import { InitialAttendanceState } from "@/@types/attendance.types";
import { baseInitialState } from "./baseInitialState";

export const initialAttendanceState: InitialAttendanceState = {
  ...baseInitialState,
  attendances: [],
  open: false,
  showUpdateModal: false,
  employeeId: undefined,
  createdBy: undefined,
  status: undefined,
  date: undefined,
};
