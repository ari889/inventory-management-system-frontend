import { Author, BaseType } from "./common.types";
import { InitialStateType } from "./reducer.types";
import { Employee } from "./employee.types";

export interface Attendance extends BaseType, Author {
  employee: Employee;
  date: Date;
  checkIn: Date;
  checkOut: Date | null;
  status: boolean;
}

export interface InitialAttendanceState extends InitialStateType {
  attendances: Attendance[];
  open: boolean;
  showUpdateModal: boolean;
}
