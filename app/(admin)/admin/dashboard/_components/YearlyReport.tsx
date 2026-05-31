"use client";

import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

interface MonthlyData {
  month: string;
  totalPurchase: number;
  totalSale: number;
  totalExpense: number;
}

interface YearlyReportProps {
  data: MonthlyData[];
  year?: number;
}

const LINES = [
  { key: "totalSale", label: "Sales", color: "#1D9E75", dash: "" },
  { key: "totalPurchase", label: "Purchases", color: "#378ADD", dash: "5 3" },
  { key: "totalExpense", label: "Expenses", color: "#EF9F27", dash: "2 4" },
  { key: "netProfit", label: "Net profit", color: "#7F77DD", dash: "6 2" },
] as const;

const fmt = (v: number) =>
  (v < 0 ? "-" : "") + "$" + (Math.abs(v) / 1000).toFixed(1) + "k";

const calcDelta = (last: number, prev: number) =>
  prev !== 0 ? ((last - prev) / prev) * 100 : undefined;

function MetricCard({
  label,
  value,
  delta,
  deltaPositiveIsGood = true,
  positive,
}: {
  label: string;
  value: number;
  delta?: number;
  deltaPositiveIsGood?: boolean;
  positive?: boolean;
}) {
  const isPositive = (delta ?? 0) >= 0;

  const valueColor =
    positive === undefined
      ? "text-foreground"
      : positive
        ? "text-emerald-500"
        : "text-rose-500";

  const deltaColor =
    delta === undefined
      ? ""
      : isPositive === deltaPositiveIsGood
        ? "text-emerald-500"
        : "text-rose-500";

  return (
    <div className="flex-1 bg-muted/50 rounded-lg p-4 min-w-0">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className={`text-xl font-medium ${valueColor}`}>{fmt(value)}</p>
      {delta !== undefined && (
        <p className={`text-xs mt-1 ${deltaColor}`}>
          {isPositive ? "↑" : "↓"} {Math.abs(delta).toFixed(1)}% vs last month
        </p>
      )}
    </div>
  );
}

function YearlyReport({
  data,
  year = new Date().getFullYear(),
}: YearlyReportProps) {
  const { enriched, totals, deltas } = useMemo(() => {
    const enriched = data.map((d) => ({
      ...d,
      month: d.month.slice(0, 3),
      netProfit: d.totalSale - d.totalPurchase - d.totalExpense,
    }));

    const totalSale = data.reduce((s, d) => s + d.totalSale, 0);
    const totalPurchase = data.reduce((s, d) => s + d.totalPurchase, 0);
    const totalExpense = data.reduce((s, d) => s + d.totalExpense, 0);
    const netProfit = totalSale - totalPurchase - totalExpense;

    const last = data[data.length - 1];
    const prev = data[data.length - 2];

    return {
      enriched,
      totals: { totalSale, totalPurchase, totalExpense, netProfit },
      deltas:
        prev && last
          ? {
              sale: calcDelta(last.totalSale, prev.totalSale),
              purchase: calcDelta(last.totalPurchase, prev.totalPurchase),
              expense: calcDelta(last.totalExpense, prev.totalExpense),
            }
          : {},
    };
  }, [data]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Yearly report</CardTitle>
        <CardDescription>Sales · Purchases · Expenses · {year}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Metric cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <MetricCard
            label="Total sales"
            value={totals.totalSale}
            delta={deltas.sale}
            deltaPositiveIsGood={true}
          />
          <MetricCard
            label="Total purchases"
            value={totals.totalPurchase}
            delta={deltas.purchase}
            deltaPositiveIsGood={false}
          />
          <MetricCard
            label="Total expenses"
            value={totals.totalExpense}
            delta={deltas.expense}
            deltaPositiveIsGood={false}
          />
          <MetricCard
            label="Net profit"
            value={totals.netProfit}
            positive={totals.netProfit >= 0}
          />
        </div>

        {/* Legend */}
        <div className="flex gap-4 flex-wrap">
          {LINES.map((l) => (
            <span
              key={l.key}
              className="flex items-center gap-1.5 text-xs text-muted-foreground"
            >
              <svg width="20" height="10" aria-hidden="true">
                <line
                  x1="0"
                  y1="5"
                  x2="20"
                  y2="5"
                  stroke={l.color}
                  strokeWidth="2"
                  strokeDasharray={l.dash}
                />
              </svg>
              {l.label}
            </span>
          ))}
        </div>

        {/* Chart */}
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={enriched}
            margin={{ left: 8, right: 8, top: 8, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              className="stroke-border"
            />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11 }}
              tickFormatter={fmt}
              width={52}
            />
            <Tooltip
              formatter={(value, name) => {
                if (value === undefined) return ["—", ""];
                const line = LINES.find((l) => l.key === name);
                return [fmt(Number(value)), line?.label ?? String(name)];
              }}
              labelFormatter={(label) => label}
              contentStyle={{
                borderRadius: 8,
                fontSize: 13,
                border: "0.5px solid hsl(var(--border))",
              }}
            />
            {LINES.map((l) => (
              <Line
                key={l.key}
                dataKey={l.key}
                name={l.key}
                stroke={l.color}
                strokeWidth={2}
                strokeDasharray={l.dash}
                dot={{ r: 3, fill: l.color }}
                activeDot={{ r: 5 }}
                type="monotone"
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export default YearlyReport;
