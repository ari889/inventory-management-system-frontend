import { Account } from "./account.types";
import { Author, BaseType } from "./common.types";
import { ExpenseCategory } from "./expense-category.types";
import { InitialStateType } from "./reducer.types";
import { Warehouse } from "./warehouse.types";

export interface Expense extends BaseType, Author {
  expenseCategory: ExpenseCategory;
  warehouse: Warehouse;
  account: Account;
  amount: string;
  note: string;
  status: boolean;
}

export interface InitialExpenseState extends InitialStateType {
  expenses: Expense[];
  open: boolean;
  showUpdateModal: boolean;
  expenseCategoryId: number | undefined;
  warehouseId: number | undefined;
  accountId: number | undefined;
  status: boolean | undefined;
  createdBy: number | undefined;
}
