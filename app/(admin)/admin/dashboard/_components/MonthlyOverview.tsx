"use client";

import { useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

interface MonthlyOverviewProps {
  purchase: number;
  sale: number;
  expense: number;
}

const COLORS = {
  purchase: { stroke: "#378ADD", fill: "#378ADD" },
  sale: { stroke: "#1D9E75", fill: "#1D9E75" },
  expense: { stroke: "#EF9F27", fill: "#EF9F27" },
};

const fmt = (v: number) => "$" + (v / 1000).toFixed(1) + "k";

function MetricCard({
  label,
  value,
  pct,
  color,
}: {
  label: string;
  value: number;
  pct: string;
  color: string;
}) {
  return (
    <div className="flex-1 bg-muted/50 rounded-lg p-4 min-w-0">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className="text-xl font-medium">{fmt(value)}</p>
      <p className="text-xs mt-1" style={{ color }}>
        {pct} of total
      </p>
    </div>
  );
}

export function MonthlyOverview({
  purchase,
  sale,
  expense,
}: MonthlyOverviewProps) {
  const { chartData, total, netProfit } = useMemo(() => {
    const total = purchase + sale + expense;
    const pct = (v: number) => ((v / total) * 100).toFixed(1) + "%";
    return {
      total,
      netProfit: sale - purchase - expense,
      chartData: [
        {
          name: "Purchases",
          value: purchase,
          pct: pct(purchase),
          color: COLORS.purchase.fill,
        },
        { name: "Sales", value: sale, pct: pct(sale), color: COLORS.sale.fill },
        {
          name: "Expenses",
          value: expense,
          pct: pct(expense),
          color: COLORS.expense.fill,
        },
      ],
    };
  }, [purchase, sale, expense]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly overview</CardTitle>
        <CardDescription>Purchase · Sales · Expenses breakdown</CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Metric cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {chartData.map((d) => (
            <MetricCard
              key={d.name}
              label={d.name}
              value={d.value}
              pct={d.pct}
              color={d.color}
            />
          ))}
          <div className="flex-1 bg-muted/50 rounded-lg p-4 min-w-0">
            <p className="text-xs text-muted-foreground mb-1">Net profit</p>
            <p
              className={`text-xl font-medium ${netProfit >= 0 ? "text-emerald-500" : "text-rose-500"}`}
            >
              {netProfit >= 0 ? "+" : ""}
              {fmt(netProfit)}
            </p>
            <p className="text-xs mt-1 text-muted-foreground">
              Sales − Purchases − Expenses
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex gap-4 flex-wrap">
          {chartData.map((d) => (
            <span
              key={d.name}
              className="flex items-center gap-1.5 text-xs text-muted-foreground"
            >
              <span
                className="w-2.5 h-2.5 rounded-sm"
                style={{ background: d.color }}
              />
              {d.name} · {fmt(d.value)} · {d.pct}
            </span>
          ))}
        </div>

        {/* Donut chart */}
        <div className="relative">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius="62%"
                outerRadius="82%"
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((d) => (
                  <Cell
                    key={d.name}
                    fill={d.color}
                    stroke={d.color}
                    strokeWidth={1}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => {
                  if (value === undefined) return ["—", ""];
                  const entry = chartData.find((d) => d.name === name);
                  return [`${fmt(Number(value))} (${entry?.pct ?? ""})`, name];
                }}
                contentStyle={{ borderRadius: 8, fontSize: 13 }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Center label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xl font-medium">{fmt(total)}</span>
            <span className="text-xs text-muted-foreground">
              total this month
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
