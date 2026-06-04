import { Author, BaseType } from "./common.types";
import { InitialStateType } from "./reducer.types";

export interface Brand extends BaseType, Author {
  title: string;
  image: string | null;
  status: boolean;
}

export interface InitialBrandState extends InitialStateType {
  brands: Brand[];
  open: boolean;
  showUpdateModal: boolean;
  search?: string;
  status?: boolean;
}
