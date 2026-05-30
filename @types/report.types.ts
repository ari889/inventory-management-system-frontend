export interface SummaryReportType {
  expense: {
    amount: number;
    totalExpense: number;
  };
  paymentPaid: {
    count: number;
    amount: number;
    cash: number;
    cheque: number;
    mobile: number;
  };
  paymentReceived: {
    count: number;
    amount: number;
    cash: number;
    cheque: number;
    mobile: number;
  };
  payroll: {
    amount: number;
    totalPayroll: number;
  };
  purchase: {
    grandTotal: number;
    paidAmount: number;
    tax: number;
    totalPurchase: number;
  };
  sale: {
    grandTotal: number;
    paidAmount: number;
    tax: number;
    totalSale: number;
  };
  totalItem: number;
  warehouses: {
    expense: number;
    warehouseId: number;
    warehouseName: string;
    purchase: {
      grandTotal: number;
      paidAmount: number;
      tax: number;
    };
    sale: {
      grandTotal: number;
      paidAmount: number;
      tax: number;
    };
  }[];
}

type DailySaleSummary = {
  totalDiscount: number;
  orderDiscount: number;
  totalTax: number;
  orderTax: number;
  shippingCost: number;
  grandTotal: number;
};

export type DailySaleMap = Record<string, DailySaleSummary>;

// report.types.ts
export type MonthlySaleSummary = {
  totalDiscount: number;
  orderDiscount: number;
  totalTax: number;
  orderTax: number;
  shippingCost: number;
  grandTotal: number;
};

// key is 1-12 (month number)
export type MonthlySaleMap = Record<number, MonthlySaleSummary>;
