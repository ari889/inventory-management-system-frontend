import { Account } from "./account.types";
import { Author, BaseType } from "./common.types";
import { ExpenseCategory } from "./expense-category.types";
import { InitialStateType } from "./reducer.types";
import { Warehouse } from "./warehouse.types";

export interface Expense extends BaseType, Author {
  expenseCategory: ExpenseCategory;
  warehouse: Warehouse;
  account: Account;
  amount: number;
  note: string;
  status: boolean;
}

export interface InitialExpenseState extends InitialStateType {
  expenses: Expense[];
  open: boolean;
  showUpdateModal: boolean;
  search: string;
}
