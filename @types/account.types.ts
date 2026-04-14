import { Author, BaseType } from "./common.types";
import { InitialStateType } from "./reducer.types";

export interface Account extends BaseType, Author {
  accountNo: string;
  name: string;
  initialBalance: string;
  note: string;
  status: boolean;
}

export interface InitialAccountState extends InitialStateType {
  accounts: Account[];
  open: boolean;
  showUpdateModal: boolean;
  search: string;
}
