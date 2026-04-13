import { Account } from "./account.types";
import { Author, BaseType } from "./common.types";
import { Employee } from "./employee.types";
import { InitialStateType } from "./reducer.types";

export interface Payroll extends BaseType, Author {
  employee: Employee;
  account: Account;
  amount: string;
  paymentMethods: "CASH" | "CHEQUE" | "BANK";
  status: boolean;
}

export interface InitialPayrollState extends InitialStateType {
  payrolls: Payroll[];
  open: boolean;
  showUpdateModal: boolean;
}
