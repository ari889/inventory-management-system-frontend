import { BaseType } from "./common.types";
import { InitialStateType } from "./reducer.types";
import { User } from "./user.types";

export interface CustomerGroup extends BaseType {
  id: number;
  groupName: string;
  percentage: number;
  status: boolean;
  creator: User;
  updator: User | null;
}

export interface InitialCustomerGroupState extends InitialStateType {
  customerGroups: CustomerGroup[];
  open: boolean;
  showUpdateModal: boolean;
}
