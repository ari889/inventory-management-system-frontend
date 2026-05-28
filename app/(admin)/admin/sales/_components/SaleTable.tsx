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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  ArrowUpDown,
  Trash2,
  SquarePen,
  Trash,
  PlusCircle,
  ShoppingCart,
  SquarePlus,
  Eye,
} from "lucide-react";
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
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { ButtonGroup } from "@/components/ui/button-group";
import DeleteModal from "@/components/common/DeleteModal";
import { initialSaleState } from "@/reducerStates/saleState";
import {
  bulkDeleteSales,
  deleteSaleById,
  getSales,
} from "@/actions/SaleAction";
import { Sale } from "@/@types/sale.types";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { saleReducer } from "@/reducers/saleReducer";
import ShowSalePaymentModal from "./ShowSalePaymentModal";
import { Badge } from "@/components/ui/badge";
import AddSalePaymentModal from "./AddSalePaymentModal";

export default function SaleTable() {
  const [state, dispatch] = useReducer(saleReducer, initialSaleState);

  const {
    isLoading,
    sorting,
    isError,
    error,
    sales,
    totalCount,
    page,
    limit,
    deleteOpen,
    selectedId,
    deleteLoading,
    selectedRows,
    bulkDeleteLoader,
    bulkDeleteOpen,
    saleIdForPayment,
    showSalePayments,
    showAddPaymentModal,
  } = state;

  const totalPages = Math.ceil(totalCount / limit);

  /**
   * fetch data from server by payload
   */
  const fetchSalesDebounced = useCallback(
    debounce(async (page: number, limit: number) => {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "REMOVE_ERROR" });
      try {
        const order = sorting[0]?.id ?? "id";
        const direction =
          sorting.length === 0 ? "desc" : sorting[0].desc ? "desc" : "asc";
        const data = await getSales({
          page,
          limit,
          order,
          direction,
        });
        if (!data?.success && !data?.errors) throw new Error(data.message);
        dispatch({ type: "SET_SALES", payload: data.data.items });
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
    [page, limit, sorting],
  );

  /**
   * call to server action
   */
  useEffect(() => {
    fetchSalesDebounced(page, limit);

    return () => {
      fetchSalesDebounced.cancel();
    };
  }, [page, limit, fetchSalesDebounced]);

  /**
   * delete sale by id
   */
  const deleteSale = useCallback(async () => {
    dispatch({ type: "SET_DELETE_LOADING", payload: true });
    try {
      const data = await deleteSaleById(selectedId!);
      if (!data?.success && !data?.errors) throw new Error(data.message);
      toast.success(data.message, {
        position: "top-right",
      });
      if (sales.length === 1 && page > 1)
        dispatch({ type: "SET_PAGE", payload: page - 1 });
      fetchSalesDebounced(page, limit);
      dispatch({ type: "CLOSE_DELETE_MODAL" });
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message, {
          position: "top-right",
        });
      } else {
        toast.error("Something went wrong!", {
          position: "top-right",
        });
      }
    } finally {
      dispatch({ type: "SET_DELETE_LOADING", payload: false });
    }
  }, [selectedId, page, limit, fetchSalesDebounced, sales.length]);

  /**
   * bulk delete sales
   */
  const bulkDelete = async () => {
    dispatch({ type: "TOGGLE_BULK_DELETE_LOADING", payload: true });
    try {
      const response = await bulkDeleteSales(Array.from(selectedRows));
      if (!response.success) throw new Error(response.message);
      dispatch({ type: "DESELECT_ALL_ROWS" });
      dispatch({ type: "TOGGLE_BULK_DELETE_MODAL" });
      dispatch({ type: "SET_PAGE", payload: 0 });
      fetchSalesDebounced(0, limit);
      toast.success(response.message, {
        position: "top-right",
      });
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message, {
          position: "top-right",
        });
      } else {
        toast.error("Something went wrong!", {
          position: "top-right",
        });
      }
    } finally {
      dispatch({ type: "TOGGLE_BULK_DELETE_LOADING", payload: false });
    }
  };

  /**
   * on payment success
   */
  const onSuccess = (
    paymentStatus: "PAID" | "PARTIAL" | "DUE",
    paidAmount: string,
  ) => {
    dispatch({
      type: "SET_SALES",
      payload: sales.map((p) => ({ ...p, paymentStatus, paidAmount })),
    });
  };

  /**
   * react table column
   */
  const columns = useMemo<ColumnDef<Sale>[]>(
    () => [
      {
        id: "select",
        header: () => {
          const allSelected =
            state.selectedRows.size === sales.length && sales.length > 0;

          return (
            <Checkbox
              checked={allSelected}
              onCheckedChange={() => {
                const allSelected =
                  state.selectedRows.size === sales.length && sales.length > 0;
                if (allSelected) {
                  dispatch({ type: "DESELECT_ALL_ROWS" });
                } else {
                  dispatch({ type: "SELECT_ALL_ROWS" });
                }
              }}
            />
          );
        },
        cell: ({ row }) => (
          <Checkbox
            checked={state.selectedRows.has(row.original.id)}
            onCheckedChange={() =>
              dispatch({
                type: "TOGGLE_ROW_SELECTION",
                payload: row.original.id,
              })
            }
          />
        ),
        size: 40,
      },
      {
        accessorKey: "id",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="px-0"
          >
            SL <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => page * limit + row.index + 1,
      },
      {
        accessorKey: "saleNo",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="px-0"
          >
            Sale No <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="font-medium">{row.getValue("saleNo") ?? "N/A"}</div>
        ),
      },
      {
        accessorKey: "customer.id",
        header: () => <div className="text-center">Customer</div>,
        cell: ({ row }) => (
          <div className="font-medium">
            {row?.original?.customer?.name ?? "N/A"}
          </div>
        ),
      },
      {
        accessorKey: "warehouse.id",
        header: () => <div className="text-center">warehouse</div>,
        cell: ({ row }) => (
          <div className="font-medium">
            {row?.original?.warehouse?.name ?? "N/A"}
          </div>
        ),
      },
      {
        accessorKey: "item",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="px-0"
          >
            Item <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="font-medium">{row.getValue("item") ?? "N/A"}</div>
        ),
      },
      {
        accessorKey: "totalQty",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="px-0"
          >
            Total Quantity <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="font-medium">{row.getValue("totalQty") ?? "N/A"}</div>
        ),
      },
      {
        accessorKey: "totalDiscount",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="px-0"
          >
            Total Discount <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="font-medium">
            {row.getValue("totalDiscount") ?? "N/A"}
          </div>
        ),
      },
      {
        accessorKey: "totalTax",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="px-0"
          >
            Total Tax <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="font-medium">{row.getValue("totalTax") ?? "N/A"}</div>
        ),
      },
      {
        accessorKey: "totalPrice",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="px-0"
          >
            Total Price <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="font-medium">
            {row.getValue("totalPrice") ?? "N/A"}
          </div>
        ),
      },
      {
        accessorKey: "orderTaxRate",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="px-0"
          >
            Order Tax Rate <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="font-medium">
            {row.getValue("orderTaxRate")
              ? `${row.getValue("orderTaxRate")}%`
              : "N/A"}
          </div>
        ),
      },
      {
        accessorKey: "orderTax",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="px-0"
          >
            Order Tax <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="font-medium">{row.getValue("orderTax") ?? "N/A"}</div>
        ),
      },
      {
        accessorKey: "orderDiscount",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="px-0"
          >
            Order Discount <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="font-medium">
            {row.getValue("orderDiscount") ?? "N/A"}
          </div>
        ),
      },
      {
        accessorKey: "shippingCost",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="px-0"
          >
            Shipping Cost <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="font-medium">
            {row.getValue("shippingCost") ?? "N/A"}
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
            Grand Total <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="font-medium">
            {row.getValue("grandTotal") ?? "N/A"}
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
        accessorKey: "saleStatus",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="px-0"
          >
            Sale Status <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="font-medium">
            {row.getValue("saleStatus") ? (
              <Badge variant="default">Completed</Badge>
            ) : (
              <Badge variant="destructive">Pending</Badge>
            )}
          </div>
        ),
      },
      {
        accessorKey: "creator.id",
        header: () => <div className="text-center">Created By</div>,
        cell: ({ row }) => (
          <div className="font-medium">
            {row?.original?.creator?.name ?? "N/A"}
          </div>
        ),
      },
      {
        accessorKey: "createdAt",
        header: () => <div className="text-center">Created At</div>,
        cell: ({ row }) => (
          <div className="font-medium">
            {row?.original?.createdAt
              ? new Date(row?.original?.createdAt).toLocaleDateString()
              : "N/A"}
          </div>
        ),
      },
      {
        id: "actions",
        header: () => <div className="text-center">Actions</div>,
        cell: ({ row }) => {
          return (
            <div className="flex justify-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-2xl">
                  <DropdownMenuItem asChild>
                    <Link href={`/admin/sales/${row.getValue("id")}`}>
                      <SquarePen />
                      Edit
                    </Link>
                  </DropdownMenuItem>
                  {row?.original?.paymentStatus !== "PAID" && (
                    <DropdownMenuItem
                      onClick={() =>
                        dispatch({
                          type: "TOGGLE_ADD_PAYMENT_MODAL",
                          payload: row.getValue("id"),
                        })
                      }
                    >
                      <SquarePlus />
                      Add Payment
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    onClick={() =>
                      dispatch({
                        type: "TOGGLE_SALE_PAYMENTS",
                        payload: row.getValue("id"),
                      })
                    }
                  >
                    <Eye />
                    Show Payments
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() =>
                      dispatch({
                        type: "OPEN_DELETE_MODAL",
                        payload: row.getValue("id"),
                      })
                    }
                  >
                    <Trash />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
      },
    ],
    [page, limit, sales.length, state.selectedRows],
  );

  /**
   * define react table by it's hook
   */
  const table = useReactTable({
    data: sales,
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

  const selectedSale = sales.find((p) => p.id === saleIdForPayment);

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
  if (!isLoading && !isError && !sales?.length)
    content = (
      <TableAlert
        message="No data found!"
        colspan={table.getAllColumns().length}
        heading="Info!"
        className="w-full"
      />
    );
  if (!isLoading && !isError && sales?.length)
    content = table.getRowModel().rows.map((row) => (
      <tr key={row.id} className="border-t hover:bg-muted/40 transition">
        {row.getVisibleCells().map((cell) => (
          <td key={cell.id} className="px-4 py-3 text-center">
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </td>
        ))}
      </tr>
    ));

  return (
    <div className="p-6">
      <Card className="rounded-2xl shadow-sm">
        <CardContent>
          <div className="flex flex-row justify-between items-center my-3">
            <div className="flex flex-row justify-start items-center">
              <ShoppingCart className="mr-2 border rounded border-gray-300 p-2 w-12 h-12" />
              <div>
                <h2 className="text-xl font-semibold">Sales</h2>
                <h3 className="text-gray-500">See and manage your sales</h3>
              </div>
            </div>
            <ButtonGroup>
              <Button variant="default" asChild>
                <Link href="/admin/sales/add">
                  <PlusCircle />
                  Create New
                </Link>
              </Button>
              {selectedRows?.size > 0 && (
                <Button
                  variant="destructive"
                  onClick={() => dispatch({ type: "TOGGLE_BULK_DELETE_MODAL" })}
                >
                  <Trash2 />
                  Delete All
                </Button>
              )}
            </ButtonGroup>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-3">
            {/* add filter here */}
          </div>
          <div className="w-full overflow-x-auto rounded-xl border">
            <Table className="min-w-350">
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
      <DeleteModal
        open={bulkDeleteOpen}
        loading={bulkDeleteLoader}
        onOpenChange={() => dispatch({ type: "TOGGLE_BULK_DELETE_MODAL" })}
        action={bulkDelete}
        title="Delete all sales!"
        description="Are you sure you want to delete all these sales?"
      />
      <DeleteModal
        open={deleteOpen}
        loading={deleteLoading}
        onOpenChange={() => dispatch({ type: "CLOSE_DELETE_MODAL" })}
        action={deleteSale}
        title="Delete Sale!"
        description="Are you sure you want to delete this sale?"
      />
      {saleIdForPayment && selectedSale ? (
        <AddSalePaymentModal
          sale={selectedSale}
          open={showAddPaymentModal}
          toggleModal={() => dispatch({ type: "TOGGLE_ADD_PAYMENT_MODAL" })}
          onSuccess={onSuccess}
        />
      ) : null}
      {saleIdForPayment && selectedSale ? (
        <ShowSalePaymentModal
          sale={selectedSale}
          open={showSalePayments}
          toggleModal={() => dispatch({ type: "TOGGLE_SALE_PAYMENTS" })}
          onDeleteSuccess={onSuccess}
        />
      ) : null}
    </div>
  );
}
