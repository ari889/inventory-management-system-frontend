// components/reports/MonthlySalesReport.tsx
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
import { MonthlySaleMap } from "@/@types/report.types";
import { getMonthlySale } from "@/actions/ReportAction";
import { debounce } from "lodash";
import CustomEmpty from "@/components/common/CustomEmpty";
import MonthlySalesReportSkeleton from "./MonthlySalesReportSkeleton";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function formatNumber(value: number) {
  return value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function MonthlySalesReport() {
  const [report, setReport] = useState<MonthlySaleMap>({});
  const [year, setYear] = useState(new Date().getFullYear());
  const [warehouseId, setWarehouseId] = useState<number | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const fetchMonthlySales = useCallback(async () => {
    setError("");
    setLoading(true);
    try {
      const data = await getMonthlySale(warehouseId, year);
      if (!data?.success)
        throw new Error(data?.message ?? "Something went wrong");
      setReport(data.data);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [warehouseId, year]);

  const debouncedFetch = useMemo(
    () => debounce(() => fetchMonthlySales(), 300),
    [fetchMonthlySales],
  );

  useEffect(() => {
    debouncedFetch();

    return () => {
      debouncedFetch.cancel();
    };
  }, [warehouseId, year, debouncedFetch]);

  const prevYear = () => setYear((y) => y - 1);
  const nextYear = () => setYear((y) => y + 1);

  /**
   * decide what to be rendered
   */
  let content = null;
  if (loading) content = <MonthlySalesReportSkeleton />;
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
          onClick={() => fetchMonthlySales()}
        >
          <RefreshCcw />
          Refetch
        </Button>
      </CustomEmpty>
    );
  else
    content = (
      <div className={`w-full rounded-lg border`}>
        <div className="flex items-center justify-between p-4 border-b">
          <Button variant="outline" onClick={prevYear}>
            <ChevronLeft className="h-4 w-4 mr-1" /> {year - 1}
          </Button>
          <h2 className="text-xl font-semibold">{year}</h2>
          <Button variant="outline" onClick={nextYear}>
            {year + 1} <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {MONTHS.map((month) => (
                  <TableHead
                    key={month}
                    className="text-center font-semibold min-w-30"
                  >
                    {month}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody>
              <TableRow>
                {MONTHS.map((_, index) => {
                  const monthNumber = index + 1;
                  const data = report[monthNumber];

                  return (
                    <TableCell
                      key={monthNumber}
                      className="align-top border p-2 min-w-30"
                    >
                      {data ? (
                        <div className="space-y-1 text-xs">
                          {data.totalDiscount > 0 && (
                            <div>
                              <span className="font-semibold text-muted-foreground">
                                Product Discount
                              </span>
                              <br />
                              <span>{formatNumber(data.totalDiscount)}</span>
                            </div>
                          )}
                          {data.orderDiscount > 0 && (
                            <div>
                              <span className="font-semibold text-muted-foreground">
                                Order Discount
                              </span>
                              <br />
                              <span>{formatNumber(data.orderDiscount)}</span>
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
                                Shipping Cost
                              </span>
                              <br />
                              <span>{formatNumber(data.shippingCost)}</span>
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
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    );
  return (
    <>
      {/* Filter */}
      <div className="my-5">
        <WarehouseFilter
          value={warehouseId}
          onChange={setWarehouseId}
          label="Choose warehouse"
        />
      </div>

      {content}
    </>
  );
}
