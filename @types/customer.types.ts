import { Author, BaseType } from "./common.types";
import { CustomerGroup } from "./customer-group.types";
import { InitialStateType } from "./reducer.types";

export interface Customer extends BaseType, Author {
  customerGroup: CustomerGroup;
  name: string;
  companyName: string;
  taxNumber: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  status: boolean;
}

export interface InitialCustomerState extends InitialStateType {
  customers: Customer[];
  open: boolean;
  showUpdateModal: boolean;
}
