import { Author, BaseType } from "./common.types";
import { InitialStateType } from "./reducer.types";

export interface ProductCategory extends BaseType, Author {
  name: string;
  status: boolean;
}

export interface InitialProductCategoryState extends InitialStateType {
  productCategoris: ProductCategory[];
  open: boolean;
  showUpdateModal: boolean;
  search: string;
  status?: boolean;
  createdBy?: number;
}
