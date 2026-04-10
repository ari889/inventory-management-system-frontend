import { Author, BaseType } from "./common.types";
import { InitialStateType } from "./reducer.types";

export interface Supplier extends BaseType, Author {
  name: string;
  companyName: string;
  vatNumber: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  status: boolean;
}

export interface InitialSupplierState extends InitialStateType {
  suppliers: Supplier[];
  open: boolean;
  showUpdateModal: boolean;
}
