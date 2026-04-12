import { Author, BaseType } from "./common.types";
import { Department } from "./department.types";
import { InitialStateType } from "./reducer.types";

export interface Employee extends BaseType, Author {
  name: string;
  image: string | null;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  postalCode: string | null;
  country: string;
  department: Department;
  status: boolean;
}

export interface InitialEmployeeState extends InitialStateType {
  employees: Employee[];
  open: boolean;
  showUpdateModal: boolean;
}
