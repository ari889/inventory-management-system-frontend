import { baseInitialState } from "./baseInitialState";
import { InitialExpenseState } from "@/@types/expense.types";

export const initialExpenseState: InitialExpenseState = {
  ...baseInitialState,
  expenses: [],
  open: false,
  showUpdateModal: false,
  expenseCategoryId: undefined,
  warehouseId: undefined,
  accountId: undefined,
  status: undefined,
  createdBy: undefined,
};
