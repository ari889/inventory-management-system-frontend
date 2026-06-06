import { Author, BaseType } from "./common.types";
import { InitialStateType } from "./reducer.types";

export interface Department extends BaseType, Author {
  name: string;
  status: boolean;
}

export interface InitialDepartmentState extends InitialStateType {
  departments: Department[];
  open: boolean;
  showUpdateModal: boolean;
  search?: string;
  status?: boolean;
  createdBy?: number;
}
