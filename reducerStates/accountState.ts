import { baseInitialState } from "./baseInitialState";
import { InitialAccountState } from "@/@types/account.types";

export const initialAccountState: InitialAccountState = {
  ...baseInitialState,
  accounts: [],
  open: false,
  showUpdateModal: false,
  search: "",
  status: undefined,
  createdBy: undefined,
};
