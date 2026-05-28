import { Account } from "./account.types";
import { Author, BaseType } from "./common.types";
import { Purchase } from "./purchase.types";

export interface Payment extends BaseType, Author {
  account: Account;
  purchase: Purchase;
  paymentNo: string;
  amount: string;
  change: string;
  paymentMethod: "CASH" | "CHEQUE" | "MOBILE";
  paymentNote: string;
}
