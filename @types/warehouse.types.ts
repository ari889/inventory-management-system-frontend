import { Author, BaseType } from "./common.types";
import { InitialStateType } from "./reducer.types";

export interface Warehouse extends BaseType, Author {
  name: string;
  phone: string;
  email: string;
  address: string;
  status: boolean; // true = Active, False = Inactive
}

export interface InitialWarehouseState extends InitialStateType {
  warehouses: Warehouse[];
  open: boolean;
  showUpdateModal: boolean;
}
