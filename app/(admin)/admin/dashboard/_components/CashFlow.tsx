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

interface MonthlyPayment {
  month: string;
  received: number;
  sent: number;
}

interface CashFlowChartProps {
  data: MonthlyPayment[];
  year?: number;
}

const fmt = (v: number) =>
  (v < 0 ? "-" : "") + "$" + (Math.abs(v) / 1000).toFixed(1) + "k";

const delta = (last: number, prev: number) =>
  prev ? (((last - prev) / prev) * 100).toFixed(1) : null;

function CashFlow({
  data,
  year = new Date().getFullYear(),
}: CashFlowChartProps) {
  const { enriched, totalReceived, totalSent, netFlow, momReceived, momSent } =
    useMemo(() => {
      const enriched = data.map((d) => ({
        ...d,
        month: d.month.slice(0, 3),
      }));

      const totalReceived = data.reduce((s, d) => s + d.received, 0);
      const totalSent = data.reduce((s, d) => s + d.sent, 0);
      const netFlow = totalReceived - totalSent;

      const last = data[data.length - 1];
      const prev = data[data.length - 2];

      return {
        enriched,
        totalReceived,
        totalSent,
        netFlow,
        momReceived: prev && last ? delta(last.received, prev.received) : null,
        momSent: prev && last ? delta(last.sent, prev.sent) : null,
      };
    }, [data]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cash flow</CardTitle>
        <CardDescription>Payment received vs sent · {year}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Metric cards */}
        <div className="flex gap-3 flex-wrap">
          <div className="flex-1 bg-muted/50 rounded-lg p-4 min-w-0">
            <p className="text-xs text-muted-foreground mb-1">Total received</p>
            <p className="text-xl font-medium text-emerald-500">
              {fmt(totalReceived)}
            </p>
            {momReceived && (
              <p className="text-xs text-muted-foreground mt-1">
                {Number(momReceived) >= 0 ? "↑" : "↓"}{" "}
                {Math.abs(Number(momReceived))}% vs last month
              </p>
            )}
          </div>

          <div className="flex-1 bg-muted/50 rounded-lg p-4 min-w-0">
            <p className="text-xs text-muted-foreground mb-1">Total sent</p>
            <p className="text-xl font-medium text-rose-500">
              {fmt(totalSent)}
            </p>
            {momSent && (
              <p className="text-xs text-muted-foreground mt-1">
                {Number(momSent) >= 0 ? "↑" : "↓"} {Math.abs(Number(momSent))}%
                vs last month
              </p>
            )}
          </div>

          <div className="flex-1 bg-muted/50 rounded-lg p-4 min-w-0">
            <p className="text-xs text-muted-foreground mb-1">Net flow</p>
            <p
              className={`text-xl font-medium ${netFlow >= 0 ? "text-emerald-500" : "text-rose-500"}`}
            >
              {netFlow >= 0 ? "+" : ""}
              {fmt(netFlow)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Received − Sent
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex gap-4 flex-wrap">
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <svg width="20" height="10" aria-hidden="true">
              <line
                x1="0"
                y1="5"
                x2="20"
                y2="5"
                stroke="#1D9E75"
                strokeWidth="2"
              />
            </svg>
            Payment received
          </span>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <svg width="20" height="10" aria-hidden="true">
              <line
                x1="0"
                y1="5"
                x2="20"
                y2="5"
                stroke="#E24B4A"
                strokeWidth="2"
                strokeDasharray="5 3"
              />
            </svg>
            Payment sent
          </span>
        </div>

        {/* Chart */}
        <ResponsiveContainer width="100%" height={280}>
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
                return [
                  fmt(Number(value)),
                  name === "received" ? "Payment received" : "Payment sent",
                ];
              }}
              contentStyle={{ borderRadius: 8, fontSize: 13 }}
            />
            <Line
              dataKey="received"
              name="received"
              stroke="#1D9E75"
              strokeWidth={2}
              dot={{ r: 3, fill: "#1D9E75" }}
              activeDot={{ r: 5 }}
              type="monotone"
            />
            <Line
              dataKey="sent"
              name="sent"
              stroke="#E24B4A"
              strokeWidth={2}
              strokeDasharray="5 3"
              dot={{ r: 3, fill: "#E24B4A" }}
              activeDot={{ r: 5 }}
              type="monotone"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export default CashFlow;
