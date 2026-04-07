import { BaseType } from "./common.types";
import { InitialStateType } from "./reducer.types";
import { User } from "./user.types";

export interface Warehouse extends BaseType {
  id: number;
  name: string;
  phone: string;
  email: string;
  address: string;
  status: boolean; // true = Active, False = Inactive
  creator: User;
  updater: User | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface InitialWarehouseState extends InitialStateType {
  warehouses: Warehouse[];
  open: boolean;
  showUpdateModal: boolean;
}
