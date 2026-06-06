"use client";

import { useCallback, useEffect, useMemo, useReducer } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, User } from "lucide-react";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { debounce } from "lodash";
import TableLoading from "@/components/common/TableLoading";
import TableAlert from "@/components/common/TableAlert";
import { supplierReportReducer } from "@/reducers/supplierReportReducer";
import { initialSupplierReportState } from "@/reducerStates/supplierReportState";
import { Purchase } from "@/@types/purchase.types";
import { getSupplierReport } from "@/actions/ReportAction";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CustomDateRangePicker } from "@/components/common/filter/CustomDateRangePicker";
import { DateRange } from "react-day-picker";
import { Input } from "@/components/ui/input";
import SupplierFilter from "@/components/common/filter/SupplierFilter";

export default function SupplierReportTable() {
  const [state, dispatch] = useReducer(
    supplierReportReducer,
    initialSupplierReportState,
  );

  const {
    isLoading,
    sorting,
    isError,
    error,
    purchases,
    totalCount,
    page,
    limit,
    dateRange,
    purchaseNo,
    supplierId,
  } = state;

  const totalPages = Math.ceil(totalCount / limit);

  /**
   * fetch data from server by payload
   */
  const fetchSupplierReportsDebounced = useCallback(
    debounce(async (page: number, limit: number) => {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "REMOVE_ERROR" });
      try {
        const order = sorting[0]?.id ?? "id";
        const direction =
          sorting.length === 0 ? "desc" : sorting[0].desc ? "desc" : "asc";
        const data = await getSupplierReport({
          page,
          limit,
          order,
          direction,
          dateRange,
          purchaseNo,
          supplierId,
        });
        if (!data?.success && !data?.errors) throw new Error(data.message);
        dispatch({ type: "SET_PURCHASES", payload: data.data.items });
        dispatch({ type: "SET_COUNT", payload: data.data.totalItems });
      } catch (error) {
        if (error instanceof Error) {
          dispatch({ type: "SET_ERROR", payload: error.message });
        } else {
          dispatch({ type: "SET_ERROR", payload: "Something went wrong!" });
        }
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    }, 300),
    [page, limit, sorting, dateRange, purchaseNo, supplierId],
  );

  /**
   * call to server action
   */
  useEffect(() => {
    fetchSupplierReportsDebounced(page, limit);

    return () => {
      fetchSupplierReportsDebounced.cancel();
    };
  }, [page, limit, fetchSupplierReportsDebounced]);

  /**
   * react table column
   */
  const columns = useMemo<ColumnDef<Purchase>[]>(
    () => [
      {
        accessorKey: "supplierId",
        header: ({ column }) => (
          <div className="text-left">
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="px-0"
            >
              Supplier <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        ),
        cell: ({ row }) => (
          <div className="font-medium text-left">
            {row?.original?.supplier
              ? `${row?.original?.supplier?.name}-${row?.original?.supplier?.phone}`
              : "N/A"}
          </div>
        ),
      },
      {
        accessorKey: "purchaseNo",
        header: ({ column }) => (
          <div className="text-left">
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="px-0"
            >
              Purchase No <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        ),
        cell: ({ row }) => (
          <div className="font-medium text-left">
            {row.getValue("purchaseNo") ?? "N/A"}
          </div>
        ),
      },
      {
        accessorKey: "createdAt",
        header: ({ column }) => (
          <div className="text-left">
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="px-0"
            >
              Date <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        ),
        cell: ({ row }) => (
          <div className="font-medium text-left">
            {format(row.getValue("createdAt"), "dd MMM, yyyy") ?? "N/A"}
          </div>
        ),
      },
      {
        accessorKey: "grandTotal",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="px-0"
          >
            GrandTotal <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="font-medium">
            {row?.original?.grandTotal ?? "N/A"}
          </div>
        ),
      },
      {
        accessorKey: "paidAmount",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="px-0"
          >
            Paid Amount <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="font-medium">
            {row.getValue("paidAmount") ?? "N/A"}
          </div>
        ),
      },
      {
        accessorKey: "dueAmount",
        header: () => <div className="text-center">Due Amount</div>,
        cell: ({ row }) => (
          <div className="font-medium">
            {(
              Number(row.getValue("grandTotal") ?? 0) -
              Number(row.getValue("paidAmount") ?? 0)
            ).toFixed(2)}
          </div>
        ),
      },
    ],
    [],
  );

  /**
   * define react table by it's hook
   */
  const table = useReactTable({
    data: purchases,
    columns,
    state: { sorting },
    manualPagination: true,
    manualSorting: true,
    onSortingChange: (updater) => {
      const newSorting =
        typeof updater === "function" ? updater(sorting) : updater;

      dispatch({
        type: "SET_SORTING",
        payload: newSorting,
      });
    },
    getCoreRowModel: getCoreRowModel(),
  });

  const totalGrandTotal = purchases?.reduce((acc, curr) => {
    return acc + Number(curr?.grandTotal);
  }, 0);

  const totalPaidAmount = purchases?.reduce((acc, curr) => {
    return acc + Number(curr?.paidAmount);
  }, 0);

  const totalDueAcount = purchases?.reduce((acc, curr) => {
    return acc + (Number(curr?.grandTotal) - Number(curr?.paidAmount));
  }, 0);

  /**
   * decide what to be rendered
   */
  let content = null;

  if (isLoading)
    content = <TableLoading columns={table.getAllColumns().length} />;
  if (!isLoading && isError)
    content = (
      <TableAlert
        message={error as string}
        colspan={table.getAllColumns().length}
        variant="destructive"
        heading="Failed to fetch!"
        className="w-full"
      />
    );
  if (!isLoading && !isError && !purchases?.length)
    content = (
      <TableAlert
        message="No data found!"
        colspan={table.getAllColumns().length}
        heading="Info!"
        className="w-full"
      />
    );
  if (!isLoading && !isError && purchases?.length)
    content = table.getRowModel().rows.map((row) => (
      <TableRow key={row.id} className="border-t hover:bg-muted/40 transition">
        {row.getVisibleCells().map((cell) => (
          <TableCell key={cell.id} className="px-4 py-3 text-center">
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        ))}
      </TableRow>
    ));

  return (
    <div className="p-6">
      <Card className="rounded-2xl shadow-sm">
        <CardContent>
          <div className="flex flex-row justify-between items-center my-3">
            <div className="flex flex-row justify-start items-center">
              <User className="mr-2 border rounded border-gray-300 p-2 w-12 h-12" />
              <div>
                <h2 className="text-xl font-semibold">Supplier Reports</h2>
                <h3 className="text-gray-500">
                  See and manage your supplier report
                </h3>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-3">
            <CustomDateRangePicker
              label="Select Date Range"
              date={dateRange}
              setDate={(range) =>
                dispatch({ type: "SET_DATE_RANGE", payload: range })
              }
            />
            <Field className="flex flex-col gap-1.5">
              <FieldLabel
                htmlFor="purchaseNo"
                className="text-sm font-medium leading-none"
              >
                Purchase No
              </FieldLabel>
              <Input
                id="purchaseNo"
                type="text"
                placeholder="Eg: #12345"
                onChange={(e) =>
                  dispatch({ type: "SET_PURCHASE_NO", payload: e.target.value })
                }
              />
            </Field>
            <SupplierFilter
              value={supplierId ?? null}
              onChange={(id) =>
                dispatch({ type: "SET_SUPPLIER_ID", payload: id })
              }
              label="Select supplier"
            />
          </div>
          <div className="rounded-xl border overflow-hidden">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>{content}</TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={3}></TableCell>
                  <TableCell align="center">
                    {totalGrandTotal.toFixed(2)}
                  </TableCell>
                  <TableCell align="center">
                    {totalPaidAmount.toFixed(2)}
                  </TableCell>
                  <TableCell align="center">
                    {totalDueAcount.toFixed(2)}
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>

          <div className="flex flex-row items-center justify-end gap-4 mt-3">
            <Field orientation="horizontal" className="w-fit">
              <FieldLabel htmlFor="select-rows-per-page">
                Rows per page
              </FieldLabel>
              <Select
                defaultValue={String(limit)}
                onValueChange={(value) =>
                  dispatch({ type: "SET_PAGE_SIZE", payload: Number(value) })
                }
              >
                <SelectTrigger className="w-20" id="select-rows-per-page">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent align="start">
                  <SelectGroup>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
            <Pagination className="mx-0 w-auto">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      page > 0 &&
                      dispatch({ type: "SET_PAGE", payload: page - 1 })
                    }
                    isActive={page > 0}
                  />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      page < totalPages - 1 &&
                      dispatch({ type: "SET_PAGE", payload: page + 1 })
                    }
                    isActive={page < totalPages - 1}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
