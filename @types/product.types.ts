import { Brand } from "./brand.types";
import { Author, BaseType } from "./common.types";
import { ProductCategory } from "./product-category.types";
import { PurchaseProduct } from "./purchase.types";
import { InitialStateType } from "./reducer.types";
import { SaleProduct } from "./sale.types";
import { Tax } from "./tax.types";
import { Unit } from "./unit.types";
import { Warehouse } from "./warehouse.types";

export interface WarehouseProduct {
  id: number;
  warehouseId: number;
  warehouse: Warehouse;
  productId: number;
  product: Product;
  qty: number;
}

export interface Product extends BaseType, Author {
  name: string;
  code: string;
  barcodeSymbology: string;
  image: string | null;

  brandId: number | null;
  brand?: Brand | null;

  categoryId: number;
  category: ProductCategory;

  unitId: number;
  unit: Unit;

  purchaseUnitId: number;
  purchaseUnit: Unit;

  saleUnitId: number;
  saleUnit: Unit;

  cost: string;
  price: string;

  qty: number | null;
  alertQty: number | null;

  taxId: number | null;
  tax?: Tax | null;
  taxMethod: boolean; // true = Exclusive, false = Inclusive

  description: string | null;
  status: boolean; // true = Active, false = Inactive

  purchaseProducts: PurchaseProduct[];
  saleProducts: SaleProduct[];
  warehouseProducts: WarehouseProduct[];
}

export interface InitialProductState extends InitialStateType {
  products: Product[];
  open: boolean;
  showUpdateModal: boolean;
  search: string;
  status?: boolean;
  taxMethod?: boolean;
  createdBy?: number;
  brandId?: number;
  categoryId?: number;
  unitId?: number;
  purchaseUnitId?: number;
  saleUnitId?: number;
  taxId?: number;
}
