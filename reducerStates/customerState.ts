import { InitialCustomerState } from "@/@types/customer.types";
import { baseInitialState } from "./baseInitialState";

export const initialCustomerState: InitialCustomerState = {
  ...baseInitialState,
  customers: [],
  open: false,
  showUpdateModal: false,
  search: "",
  status: undefined,
  createdBy: undefined,
  customerGroupId: undefined,
};
