import { InitialExpenseCategoryState } from "@/@types/expense-category.types";
import { baseInitialState } from "./baseInitialState";

export const initialExpenseCategoryState: InitialExpenseCategoryState = {
  ...baseInitialState,
  expenseCategoris: [],
  open: false,
  showUpdateModal: false,
  search: "",
};
