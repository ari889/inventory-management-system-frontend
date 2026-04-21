import { Author, BaseType } from "./common.types";
import { InitialStateType } from "./reducer.types";

export interface Tax extends BaseType, Author {
  name: string;
  rate: string;
  status: boolean;
}

export interface InitialTaxState extends InitialStateType {
  taxes: Tax[];
  open: boolean;
  showUpdateModal: boolean;
}
