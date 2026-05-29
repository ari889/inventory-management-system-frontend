"use client";

import { SummaryReportType } from "@/@types/report.types";
import { getSummaryReport } from "@/actions/ReportAction";
import { CustomDatePicker } from "@/components/common/CustomDatePicker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { debounce } from "lodash";
import { useCallback, useEffect, useState } from "react";
import { DateRange } from "react-day-picker";

const ShowSummaryReport = () => {
  const [report, setReport] = useState<SummaryReportType>();
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const now = new Date();
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(now.getFullYear(), now.getMonth(), 1),
    to: new Date(now.getFullYear(), now.getMonth() + 1, 0),
  });

  /**
   * fetch data from server by payload
   */
  const fetchSummaryReport = useCallback(async (from?: Date, to?: Date) => {
    setError("");
    setLoading(true);

    try {
      const data = await getSummaryReport(from, to);
      console.log(data);

      if (!data?.success && !data?.errors) throw new Error(data.message);

      setReport(data.data);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  const debouncedFetch = useCallback(
    debounce((from?: Date, to?: Date) => {
      fetchSummaryReport(from, to);
    }, 300),
    [fetchSummaryReport],
  );

  /**
   * call to server action
   */
  useEffect(() => {
    debouncedFetch(date?.from, date?.to);

    return () => {
      debouncedFetch.cancel();
    };
  }, [date, debouncedFetch]);

  return (
    <>
      <CustomDatePicker date={date} setDate={setDate} />
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Purchase</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>Amount</TableCell>
                  <TableCell align="center">:</TableCell>
                  <TableCell align="right">
                    {report?.purchase?.grandTotal?.toFixed(2)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Purchase</TableCell>
                  <TableCell align="center">:</TableCell>
                  <TableCell align="right">
                    {report?.purchase?.totalPurchase}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Paid</TableCell>
                  <TableCell align="center">:</TableCell>
                  <TableCell align="right">
                    {report?.purchase?.paidAmount?.toFixed(2)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Tax</TableCell>
                  <TableCell align="center">:</TableCell>
                  <TableCell align="right">
                    {report?.purchase?.tax?.toFixed(2)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Sale</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>Amount</TableCell>
                  <TableCell align="center">:</TableCell>
                  <TableCell align="right">
                    {report?.sale?.grandTotal?.toFixed(2)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Sale</TableCell>
                  <TableCell align="center">:</TableCell>
                  <TableCell align="right">{report?.sale?.totalSale}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Paid</TableCell>
                  <TableCell align="center">:</TableCell>
                  <TableCell align="right">
                    {report?.sale?.paidAmount?.toFixed(2)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Tax</TableCell>
                  <TableCell align="center">:</TableCell>
                  <TableCell align="right">
                    {report?.sale?.tax?.toFixed(2)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Profit/Loss</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>Sale</TableCell>
                  <TableCell align="center">:</TableCell>
                  <TableCell align="right">
                    {report?.sale?.grandTotal?.toFixed(2)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Purcahse</TableCell>
                  <TableCell align="center">:</TableCell>
                  <TableCell align="right">
                    {report?.purchase?.grandTotal?.toFixed(2)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Paid</TableCell>
                  <TableCell align="center">:</TableCell>
                  <TableCell align="right">
                    {(
                      (report?.sale?.paidAmount ?? 0) -
                      (report?.purchase?.grandTotal ?? 0)
                    ).toFixed(2)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Net Profit/Net Loss</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell align="center">
                    <span className="text-3xl font-bold block">
                      {(
                        (report?.sale?.grandTotal ?? 0) -
                        (report?.sale?.tax ?? 0) -
                        ((report?.purchase?.grandTotal ?? 0) -
                          (report?.purchase?.tax ?? 0))
                      ).toFixed(2)}
                    </span>
                    <span className="block mt-3">
                      (Sale {report?.sale?.grandTotal?.toFixed(2)} - Tax{" "}
                      {report?.sale?.tax?.toFixed(2)})
                    </span>
                    <span className="block mt-5">
                      (Purchase {report?.purchase?.grandTotal?.toFixed(2)} - Tax
                      {report?.purchase?.tax?.toFixed(2)})
                    </span>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Payment Received</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>Amount</TableCell>
                  <TableCell align="center">:</TableCell>
                  <TableCell align="right">
                    {report?.paymentReceived?.amount?.toFixed(2)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Received</TableCell>
                  <TableCell align="center">:</TableCell>
                  <TableCell align="right">
                    {report?.paymentReceived?.count}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Cash</TableCell>
                  <TableCell align="center">:</TableCell>
                  <TableCell align="right">
                    {report?.paymentReceived?.cash?.toFixed(2)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Cheque</TableCell>
                  <TableCell align="center">:</TableCell>
                  <TableCell align="right">
                    {report?.paymentReceived?.cheque?.toFixed(2)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Mobile</TableCell>
                  <TableCell align="center">:</TableCell>
                  <TableCell align="right">
                    {report?.paymentReceived?.mobile?.toFixed(2)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Payment Sent</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>Amount</TableCell>
                  <TableCell align="center">:</TableCell>
                  <TableCell align="right">
                    {report?.paymentPaid?.amount?.toFixed(2)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Received</TableCell>
                  <TableCell align="center">:</TableCell>
                  <TableCell align="right">
                    {report?.paymentPaid?.count}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Cash</TableCell>
                  <TableCell align="center">:</TableCell>
                  <TableCell align="right">
                    {report?.paymentPaid?.cash?.toFixed(2)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Cheque</TableCell>
                  <TableCell align="center">:</TableCell>
                  <TableCell align="right">
                    {report?.paymentPaid?.cheque?.toFixed(2)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Mobile</TableCell>
                  <TableCell align="center">:</TableCell>
                  <TableCell align="right">
                    {report?.paymentPaid?.mobile?.toFixed(2)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Expense</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>Amount</TableCell>
                  <TableCell align="center">:</TableCell>
                  <TableCell align="right">
                    {report?.expense?.amount?.toFixed(2)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Expense</TableCell>
                  <TableCell align="center">:</TableCell>
                  <TableCell align="right">
                    {report?.expense?.totalExpense?.toFixed(2)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Cash In Hand</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>Received</TableCell>
                  <TableCell align="center">:</TableCell>
                  <TableCell align="right">
                    {report?.paymentReceived?.amount?.toFixed(2)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Sent</TableCell>
                  <TableCell align="center">:</TableCell>
                  <TableCell align="right">
                    {report?.paymentPaid?.amount?.toFixed(2)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Expense</TableCell>
                  <TableCell align="center">:</TableCell>
                  <TableCell align="right">
                    {report?.expense?.amount?.toFixed(2)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Payroll</TableCell>
                  <TableCell align="center">:</TableCell>
                  <TableCell align="right">
                    {report?.payroll?.amount?.toFixed(2)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>In Hand</TableCell>
                  <TableCell align="center">:</TableCell>
                  <TableCell align="right">
                    {(
                      (report?.paymentReceived?.amount ?? 0) -
                      (report?.paymentPaid?.amount ?? 0) -
                      (report?.expense?.amount ?? 0) -
                      (report?.payroll?.amount ?? 0)
                    ).toFixed(2)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        {report?.warehouses?.map((warehouse) => (
          <Card key={warehouse.warehouseId}>
            <CardHeader>
              <CardTitle>{warehouse?.warehouseName}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell align="center">
                      <span className="text-3xl font-bold block">
                        {(
                          (warehouse?.sale?.grandTotal ?? 0) -
                          (warehouse?.purchase?.grandTotal ?? 0)
                        ).toFixed(2)}
                      </span>
                      <span className="block mt-2">
                        (Sale {warehouse?.sale?.grandTotal?.toFixed(2)} -
                        Purchase {warehouse?.purchase?.grandTotal?.toFixed(2)})
                      </span>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell align="center">
                      <span className="text-3xl font-bold block">
                        {(
                          warehouse?.sale?.grandTotal -
                          warehouse?.sale?.tax -
                          warehouse?.purchase?.grandTotal -
                          warehouse?.purchase?.tax
                        ).toFixed(2)}
                      </span>
                      <span className="block mt-2">
                        (Sale{" "}
                        {warehouse?.sale?.grandTotal - warehouse?.sale?.tax} -
                        Purchase{" "}
                        {warehouse?.purchase?.grandTotal -
                          warehouse?.purchase?.tax}
                        )
                      </span>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
};

export default ShowSummaryReport;
