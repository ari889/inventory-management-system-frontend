import { Author, BaseType } from "./common.types";
import { InitialStateType } from "./reducer.types";
import { Supplier } from "./supplier.types";
import { Warehouse } from "./warehouse.types";

export interface Purchase extends BaseType, Author {
  purchaseNo: string;
  supplier: Supplier;
  warehouse: Warehouse;
  item: number;
  totalQty: number;
  totalDiscount: string;
  totalTax: string;
  totalCost: string;
  orderTaxRate: string;
  orderTax: string;
  orderDiscount: string;
  shippingCost: string;
  grandTotal: string;
  paidAmount: string;
  purchaseStatus: "PENDING" | "ORDERED" | "RECEIVED" | "PARTIAL" | "CANCELLED";
  paymentStatus: boolean; // true: Paid, false: Due
  document: string;
  note: string;
  status: boolean;
}

export interface InitialPurchaseState extends InitialStateType {
  purchases: Purchase[];
  open: boolean;
  showUpdateModal: boolean;
}

export interface PurchaseProductType {
  id: number;
  name: string;
  code: string;
  price: string;
  taxId?: number;
  taxRate: string;
  taxName?: string;
  unitId: number;
  unitName: string;
  unitCost: string;
  quantity: number;
  discount: string;
  subtotal: string;
}
