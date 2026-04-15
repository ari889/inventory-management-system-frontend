import { Brand } from "./brand.types";
import { Author, BaseType } from "./common.types";
import { ProductCategory } from "./product-category.types";
import { InitialStateType } from "./reducer.types";
import { Tax } from "./tax.types";
import { Unit } from "./unit.types";

export interface Product extends BaseType, Author {
  name: string;
  code: string;
  barcodeSymbology: string;
  image: string | null;

  brandId: number | null;
  brand?: Brand | null;

  categoryId: number;
  category?: ProductCategory;

  unitId: number;
  unit?: Unit;

  purchaseUnitId: number;
  purchaseUnit?: Unit;

  saleUnitId: number;
  saleUnit?: Unit;

  cost: number;
  price: number;

  qty: number | null;
  alertQty: number | null;

  taxId: number | null;
  tax?: Tax | null;
  taxMethod: boolean; // true = Exclusive, false = Inclusive

  description: string | null;
  status: boolean; // true = Active, false = Inactive
}

export interface InitialProductState extends InitialStateType {
  products: Product[];
  open: boolean;
  showUpdateModal: boolean;
}
