import { baseInitialState } from "./baseInitialState";
import { InitialCustomerGroupState } from "@/@types/customer-group.types";

export const initialCustomerGroupState: InitialCustomerGroupState = {
  ...baseInitialState,
  customerGroups: [],
  open: false,
  showUpdateModal: false,
};
