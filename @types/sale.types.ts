import { Author, BaseType } from "./common.types";
import { Customer } from "./customer.types";
import { Payment } from "./payment.types";
import { Product } from "./product.types";
import { InitialStateType } from "./reducer.types";
import { Tax } from "./tax.types";
import { Unit } from "./unit.types";
import { Warehouse } from "./warehouse.types";

export interface SaleProductType {
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
  unitPrice: string;
  quantity: number;
  discount: string;
  subtotal: string;
}

export interface Sale extends BaseType, Author {
  saleNo: string;
  customer: Customer;
  warehouse: Warehouse;
  item: number;
  tax?: Tax;
  totalQty: number;
  totalDiscount: string;
  totalTax: string;
  totalPrice: string;
  orderTaxRate: string;
  orderTax: number;
  orderDiscount: string;
  shippingCost: string;
  grandTotal: string;
  paidAmount: string;
  saleStatus: boolean;
  paymentStatus: "PAID" | "PARTIAL" | "DUE";
  document: string;
  note: string;
  status: boolean;
  saleProducts: SaleProduct[];
  payments: Payment[];
}

export interface SaleProduct extends BaseType {
  id: number;
  sale: Sale;
  product: Product;
  qty: number;
  unit: Unit;
  netUnitPrice: string;
  productTax?: Tax;
  discount: string;
  taxRate: string;
  tax: string;
  total: string;
}

export interface InitialSaleState extends InitialStateType {
  sales: Sale[];
  open: boolean;
  showUpdateModal: boolean;
  showAddPaymentModal: boolean;
  saleIdForPayment: number | null;
  showSalePayments: boolean;
}
