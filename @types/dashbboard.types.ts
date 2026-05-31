export interface DashboardDeltas {
  sale: number | null;
  purchase: number | null;
  expense: number | null;
  profit: number | null;
}

export interface SectionCardsType {
  sale: number;
  purchase: number;
  expense: number;
  profit: number;
  totalCustomers: number;
  totalSuppliers: number;
  deltas: DashboardDeltas;
}

export interface MonthlyOverview {
  sale: number;
  purchase: number;
  expense: number;
}

export interface YearlyReportItem {
  month: string;
  totalSale: number;
  totalPurchase: number;
  totalExpense: number;
}

export interface CashFlowItem {
  month: string;
  received: number;
  sent: number;
}

export interface DashboardResponse {
  sectionCards: SectionCardsType;
  monthlyOverview: MonthlyOverview;
  yearlyReport: YearlyReportItem[];
  cashFlow: CashFlowItem[];
}
