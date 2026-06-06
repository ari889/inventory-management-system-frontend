import { Author, BaseType } from "./common.types";
import { InitialStateType } from "./reducer.types";

export interface ExpenseCategory extends BaseType, Author {
  name: string;
  status: boolean;
}

export interface InitialExpenseCategoryState extends InitialStateType {
  expenseCategoris: ExpenseCategory[];
  open: boolean;
  showUpdateModal: boolean;
  search?: string;
  status?: boolean;
}
