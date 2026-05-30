// components/reports/DailySalesReport.tsx
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Ban, ChevronLeft, ChevronRight, RefreshCcw } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import WarehouseFilter from "@/components/common/filter/WarehouseFilter";
import { DateRange } from "react-day-picker";
import { CustomDatePicker } from "@/components/common/filter/CustomDatePicker";
import { DailySaleMap } from "@/@types/report.types";
import { debounce } from "lodash";
import { getDailySale } from "@/actions/ReportAction";
import CustomEmpty from "@/components/common/CustomEmpty";
import DailySalesReportSkeleton from "./DailySalesReportSkeleton";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function formatNumber(value: number) {
  if (!value) return null;
  return value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function DailySalesReport() {
  const [report, setReport] = useState<DailySaleMap>({});
  const [currentDate, setCurrentDate] = useState(new Date());
  const [warehouseId, setWarehouseId] = useState<number | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const now = new Date();
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(now.getFullYear(), now.getMonth(), 1),
    to: new Date(now.getFullYear(), now.getMonth() + 1, 0),
  });

  const fetchDailySales = useCallback(
    async (from?: Date, to?: Date) => {
      setError("");
      setLoading(true);
      try {
        const data = await getDailySale(warehouseId, from, to);
        if (!data?.success)
          throw new Error(data?.message ?? "Something went wrong");
        setReport(data.data);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Something went wrong",
        );
      } finally {
        setLoading(false);
      }
    },
    [warehouseId],
  );

  const debouncedFetch = useMemo(
    () => debounce((from?: Date, to?: Date) => fetchDailySales(from, to), 300),
    [fetchDailySales],
  );

  useEffect(() => {
    debouncedFetch(date?.from, date?.to);

    return () => {
      debouncedFetch.cancel();
    };
  }, [warehouseId, date, debouncedFetch]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = currentDate.toLocaleString("default", { month: "long" });

  const calendarRows = useMemo(() => {
    const firstDayOfWeek = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    const cells: (number | null)[] = [
      ...Array(firstDayOfWeek).fill(null),
      ...Array.from({ length: totalDays }, (_, i) => i + 1),
    ];

    while (cells.length % 7 !== 0) cells.push(null);

    const rows = [];
    for (let i = 0; i < cells.length; i += 7) {
      rows.push(cells.slice(i, i + 7));
    }
    return rows;
  }, [year, month]);

  const today = new Date();
  const isToday = (day: number) =>
    day === today.getDate() &&
    month === today.getMonth() &&
    year === today.getFullYear();

  const getDateKey = (day: number) =>
    `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  const prevMonth = () =>
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1),
    );

  const nextMonth = () =>
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1),
    );

  /**
   * decide what to be rendered
   */
  let content = null;
  if (loading) content = <DailySalesReportSkeleton />;
  else if (!loading && error)
    content = (
      <CustomEmpty
        title={error}
        type="error"
        icon={Ban}
        description="Something went wrong. Please try again or contact support."
      >
        <Button
          type="button"
          variant="destructive"
          onClick={() => fetchDailySales()}
        >
          <RefreshCcw />
          Refetch
        </Button>
      </CustomEmpty>
    );
  else
    content = (
      <div className="w-full rounded-lg border">
        <div className="flex items-center justify-between p-4 border-b">
          <Button variant="outline" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4 mr-1" /> Previous
          </Button>
          <h2 className="text-xl font-semibold">
            {monthName} {year}
          </h2>
          <Button variant="outline" onClick={nextMonth}>
            Next <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>

        <div className={loading ? "opacity-50 pointer-events-none" : ""}>
          <Table>
            <TableHeader>
              <TableRow>
                {DAYS.map((day) => (
                  <TableHead
                    key={day}
                    className="text-center font-semibold w-[14.28%]"
                  >
                    {day}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody>
              {calendarRows.map((week, rowIndex) => (
                <TableRow key={rowIndex}>
                  {week.map((day, cellIndex) => {
                    const key = day ? getDateKey(day) : null;
                    const data = key ? report[key] : null;

                    return (
                      <TableCell
                        key={cellIndex}
                        className="align-top border p-2 h-28 w-[14.28%]"
                      >
                        {day && (
                          <div className="flex flex-col gap-1 text-xs">
                            {/* Day number */}
                            <span
                              className={`flex h-7 w-7 items-center justify-center rounded-full font-semibold text-sm mb-1 ${
                                isToday(day)
                                  ? "bg-primary text-primary-foreground"
                                  : ""
                              }`}
                            >
                              {day}
                            </span>

                            {/* Sale data */}
                            {data && (
                              <div className="space-y-0.5">
                                {data.totalDiscount > 0 && (
                                  <div>
                                    <span className="font-semibold text-muted-foreground">
                                      Product Discount
                                    </span>
                                    <br />
                                    <span>
                                      {formatNumber(data.totalDiscount)}
                                    </span>
                                  </div>
                                )}
                                {data.orderDiscount > 0 && (
                                  <div>
                                    <span className="font-semibold text-muted-foreground">
                                      Order Discount
                                    </span>
                                    <br />
                                    <span>
                                      {formatNumber(data.orderDiscount)}
                                    </span>
                                  </div>
                                )}
                                {data.totalTax > 0 && (
                                  <div>
                                    <span className="font-semibold text-muted-foreground">
                                      Total Tax
                                    </span>
                                    <br />
                                    <span>{formatNumber(data.totalTax)}</span>
                                  </div>
                                )}
                                {data.orderTax > 0 && (
                                  <div>
                                    <span className="font-semibold text-muted-foreground">
                                      Order Tax
                                    </span>
                                    <br />
                                    <span>{formatNumber(data.orderTax)}</span>
                                  </div>
                                )}
                                {data.shippingCost > 0 && (
                                  <div>
                                    <span className="font-semibold text-muted-foreground">
                                      Shipping
                                    </span>
                                    <br />
                                    <span>
                                      {formatNumber(data.shippingCost)}
                                    </span>
                                  </div>
                                )}
                                {data.grandTotal > 0 && (
                                  <div>
                                    <span className="font-semibold text-primary">
                                      Grand Total
                                    </span>
                                    <br />
                                    <span className="font-semibold">
                                      {formatNumber(data.grandTotal)}
                                    </span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );

  return (
    <>
      <div className="grid grid-cols-2 gap-2 my-5">
        <WarehouseFilter
          value={warehouseId}
          onChange={setWarehouseId}
          label="Choose warehouse"
        />
        <CustomDatePicker date={date} setDate={setDate} />
      </div>

      {content}
    </>
  );
}
