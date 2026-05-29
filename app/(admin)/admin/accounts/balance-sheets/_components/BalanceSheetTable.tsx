"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DatePickerWithRange } from "./DatePickerWithRange";
import { useCallback, useEffect, useState } from "react";
import { BalanceSheetType } from "@/@types/balance-sheet.types";
import { getBalanceSheet } from "@/actions/BalanceSheetAction";
import { debounce } from "lodash";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Ban } from "lucide-react";
import TableLoading from "@/components/common/TableLoading";
import TableAlert from "@/components/common/TableAlert";
import { DateRange } from "react-day-picker";
import { addDays } from "date-fns";

const BalanceSheetTable = () => {
  const [balanceSheets, setBalanceSheets] = useState<BalanceSheetType[]>([]);
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
  const fetchBalanceSheets = useCallback(async (from?: Date, to?: Date) => {
    setError("");
    setLoading(true);

    try {
      const data = await getBalanceSheet(from, to);

      if (!data?.success && !data?.errors) throw new Error(data.message);

      setBalanceSheets(data.data);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  const debouncedFetch = useCallback(
    debounce((from?: Date, to?: Date) => {
      fetchBalanceSheets(from, to);
    }, 300),
    [fetchBalanceSheets],
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

  /**
   * decide what to be rendered
   */
  let content = null;

  if (loading) content = <TableLoading columns={6} />;
  else if (!loading && error)
    content = (
      <TableAlert
        message={error as string}
        colspan={6}
        variant="destructive"
        heading="Failed to fetch!"
        className="w-full"
      />
    );
  else if (!loading && !error && balanceSheets?.length === 0)
    content = (
      <TableRow>
        <TableCell colSpan={6}>
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Ban />
              </EmptyMedia>
              <EmptyTitle>No accounts found</EmptyTitle>
              <EmptyDescription>
                You have not created any accounts yet.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </TableCell>
      </TableRow>
    );
  else
    content = balanceSheets.map((item, index) => (
      <TableRow key={item.id}>
        <TableCell>{index + 1}</TableCell>
        <TableCell>{item.name}</TableCell>
        <TableCell>{item.accountNo}</TableCell>
        <TableCell align="center" className="font-semibold">
          {item.debit}
        </TableCell>
        <TableCell align="center" className="font-semibold">
          {item.credit}
        </TableCell>
        <TableCell align="center" className="font-semibold">
          {item.balance}
        </TableCell>
      </TableRow>
    ));

  const totalDebit = balanceSheets.reduce((acc, item) => acc + item.debit, 0);
  const totalCredit = balanceSheets.reduce((acc, item) => acc + item.credit, 0);
  const totalBalance = balanceSheets.reduce(
    (acc, item) => acc + item.balance,
    0,
  );
  return (
    <>
      <DatePickerWithRange date={date} setDate={setDate} />
      <Table>
        <TableCaption>Your monthly balance sheet</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Account Name</TableHead>
            <TableHead>Account No</TableHead>
            <TableHead className="text-center">Debit</TableHead>
            <TableHead className="text-center">Credit</TableHead>
            <TableHead className="text-center">Balance</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>{content}</TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}></TableCell>
            <TableCell align="center">{totalDebit}</TableCell>
            <TableCell align="center">{totalCredit}</TableCell>
            <TableCell align="center">{totalBalance}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </>
  );
};

export default BalanceSheetTable;
