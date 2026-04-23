import { Author, BaseType } from "./common.types";
import { Product } from "./product.types";
import { InitialStateType } from "./reducer.types";
import { Supplier } from "./supplier.types";
import { Tax } from "./tax.types";
import { Unit } from "./unit.types";
import { Warehouse } from "./warehouse.types";

export interface PurchaseProductType {
  id: number | null;
  productId: number;
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

export interface Purchase extends BaseType, Author {
  purchaseNo: string;
  supplier: Supplier;
  tax: Tax;
  warehouse: Warehouse;
  item: number;
  totalQty: number;
  totalDiscount: string;
  totalTax: string;
  totalCost: string;
  orderTaxRate: string;
  orderTax: number;
  orderDiscount: string;
  shippingCost: string;
  grandTotal: string;
  paidAmount: string;
  purchaseStatus: "PENDING" | "ORDERED" | "RECEIVED" | "PARTIAL" | "CANCELLED";
  paymentStatus: boolean; // true: Paid, false: Due
  document: string;
  note: string;
  status: boolean;
  purchaseProducts: PurchaseProduct[];
}

export interface PurchaseProduct extends BaseType {
  id: number;
  purchase: Purchase;
  product: Product;
  qty: number;
  received: number;
  unit: Unit;
  productTax?: Tax;
  netUnitCost: string;
  discount: string;
  total: string;
}

export interface InitialPurchaseState extends InitialStateType {
  purchases: Purchase[];
  open: boolean;
  showUpdateModal: boolean;
  showAddPaymentModal: boolean;
  purchaseIdForPayment: number | null;
  showPurchasePayments: boolean;
}
