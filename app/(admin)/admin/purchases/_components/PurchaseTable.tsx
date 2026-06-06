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
import { initialPurchaseState } from "@/reducerStates/purchaseState";
import {
  bulkDeletePurchases,
  deletePurchaseById,
  getPurchases,
} from "@/actions/PurchaseAction";
import { Purchase } from "@/@types/purchase.types";
import Link from "next/link";
import { purchaseReducer } from "@/reducers/pruchaseReducer";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AddPurchasePaymentModal from "./AddPurchasePaymentModal";
import ShowPurchasePaymentModal from "./ShowPurchasePaymentModal";
import FormFieldFilter from "@/components/common/filter/FormFieldFilter";
import FormFieldSelectFilter from "@/components/common/filter/FormFieldSelectFilter";
import UserFilter from "@/components/common/filter/UserFilter";
import SupplierFilter from "@/components/common/filter/SupplierFilter";
import WarehouseFilter from "@/components/common/filter/WarehouseFilter";

export default function PurchaseTable() {
  const [state, dispatch] = useReducer(purchaseReducer, initialPurchaseState);

  const {
    isLoading,
    sorting,
    isError,
    error,
    purchases,
    totalCount,
    page,
    limit,
    deleteOpen,
    selectedId,
    deleteLoading,
    selectedRows,
    bulkDeleteLoader,
    bulkDeleteOpen,
    showAddPaymentModal,
    purchaseIdForPayment,
    showPurchasePayments,
    search,
    status,
    createdBy,
    supplierId,
    warehouseId,
  } = state;

  const totalPages = Math.ceil(totalCount / limit);

  /**
   * fetch data from server by payload
   */
  const fetchPurchasesDebounced = useCallback(
    debounce(async (page: number, limit: number) => {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "REMOVE_ERROR" });
      try {
        const order = sorting[0]?.id ?? "id";
        const direction =
          sorting.length === 0 ? "desc" : sorting[0].desc ? "desc" : "asc";
        const data = await getPurchases({
          page,
          limit,
          order,
          direction,
          search,
          status,
          createdBy,
          supplierId,
          warehouseId,
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
    [page, limit, sorting, search, status, createdBy, supplierId, warehouseId],
  );

  /**
   * call to server action
   */
  useEffect(() => {
    fetchPurchasesDebounced(page, limit);

    return () => {
      fetchPurchasesDebounced.cancel();
    };
  }, [page, limit, fetchPurchasesDebounced]);

  /**
   * delete purchase by id
   */
  const deletePurchase = useCallback(async () => {
    dispatch({ type: "SET_DELETE_LOADING", payload: true });
    try {
      const data = await deletePurchaseById(selectedId!);
      if (!data?.success && !data?.errors) throw new Error(data.message);
      toast.success(data.message, {
        position: "top-right",
      });
      if (purchases.length === 1 && page > 1)
        dispatch({ type: "SET_PAGE", payload: page - 1 });
      fetchPurchasesDebounced(page, limit);
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
  }, [selectedId, page, limit, fetchPurchasesDebounced, purchases.length]);

  /**
   * bulk delete purchases
   */
  const bulkDelete = async () => {
    dispatch({ type: "TOGGLE_BULK_DELETE_LOADING", payload: true });
    try {
      const response = await bulkDeletePurchases(Array.from(selectedRows));
      if (!response.success) throw new Error(response.message);
      dispatch({ type: "DESELECT_ALL_ROWS" });
      dispatch({ type: "TOGGLE_BULK_DELETE_MODAL" });
      dispatch({ type: "SET_PAGE", payload: 0 });
      fetchPurchasesDebounced(0, limit);
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
  const onSuccess = (paymentStatus: boolean, paidAmount: string) => {
    dispatch({
      type: "SET_PURCHASES",
      payload: purchases.map((p) => ({ ...p, paymentStatus, paidAmount })),
    });
  };

  /**
   * react table column
   */
  const columns = useMemo<ColumnDef<Purchase>[]>(
    () => [
      {
        id: "select",
        header: () => {
          const allSelected =
            state.selectedRows.size === purchases.length &&
            purchases.length > 0;

          return (
            <Checkbox
              checked={allSelected}
              onCheckedChange={() => {
                const allSelected =
                  state.selectedRows.size === purchases.length &&
                  purchases.length > 0;
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
        accessorKey: "purchaseNo",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="px-0"
          >
            Purchase No <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="font-medium">
            {row.getValue("purchaseNo") ?? "N/A"}
          </div>
        ),
      },
      {
        accessorKey: "supplier.id",
        header: () => <div className="text-center">Supplier</div>,
        cell: ({ row }) => (
          <div className="font-medium">
            {row?.original?.supplier?.name ?? "N/A"}
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
        accessorKey: "totalCost",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="px-0"
          >
            Total Cost <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="font-medium">
            {row.getValue("totalCost") ?? "N/A"}
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
        accessorKey: "purchaseStatus",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="px-0"
          >
            Purchase Status <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="font-medium">
            {row.getValue("purchaseStatus") ?? "N/A"}
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
                    <Link href={`/admin/purchases/${row.getValue("id")}`}>
                      <SquarePen />
                      Edit
                    </Link>
                  </DropdownMenuItem>
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
                  <DropdownMenuItem
                    onClick={() =>
                      dispatch({
                        type: "TOGGLE_PURCHASE_PAYMENTS",
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
    [page, limit, purchases.length, state.selectedRows],
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

  const selectedPurchase = purchases.find((p) => p.id === purchaseIdForPayment);

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
                <h2 className="text-xl font-semibold">Purchases</h2>
                <h3 className="text-gray-500">See and manage your purchases</h3>
              </div>
            </div>
            <ButtonGroup>
              <Button variant="default" asChild>
                <Link href="/admin/purchases/add">
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
            <FormFieldFilter
              id="search"
              label="Search"
              placeholder="Type something..."
              onChange={(e) =>
                dispatch({ type: "SET_SEARCH", payload: e.target.value })
              }
            />
            <FormFieldSelectFilter
              label="Status"
              placeholder="Select option"
              groupLabel="Filter by status"
              options={[
                { value: "all", label: "All" },
                { value: "true", label: "Active" },
                { value: "false", label: "Inactive" },
              ]}
              value={status === undefined ? "all" : String(status)}
              onValueChange={(val) => {
                if (val === "all") {
                  dispatch({ type: "SET_STATUS", payload: null });
                } else {
                  dispatch({ type: "SET_STATUS", payload: val === "true" });
                }
              }}
            />
            <UserFilter
              value={createdBy ?? null}
              onChange={(id) =>
                dispatch({ type: "SET_CREATED_BY", payload: id })
              }
            />
            <SupplierFilter
              value={supplierId ?? null}
              onChange={(id) =>
                dispatch({ type: "SET_SUPPLIER_ID", payload: id })
              }
            />
            <div className="col-span-2">
              <WarehouseFilter
                value={warehouseId ?? null}
                onChange={(id) =>
                  dispatch({ type: "SET_WAREHOUSE_ID", payload: id })
                }
              />
            </div>
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
        title="Delete all purchases!"
        description="Are you sure you want to delete all these purchases?"
      />
      <DeleteModal
        open={deleteOpen}
        loading={deleteLoading}
        onOpenChange={() => dispatch({ type: "CLOSE_DELETE_MODAL" })}
        action={deletePurchase}
        title="Delete Purchase!"
        description="Are you sure you want to delete this purchase?"
      />
      {purchaseIdForPayment && selectedPurchase ? (
        <AddPurchasePaymentModal
          purchase={selectedPurchase}
          open={showAddPaymentModal}
          toggleModal={() => dispatch({ type: "TOGGLE_ADD_PAYMENT_MODAL" })}
          onSuccess={onSuccess}
        />
      ) : null}
      {purchaseIdForPayment && selectedPurchase ? (
        <ShowPurchasePaymentModal
          purchase={selectedPurchase}
          open={showPurchasePayments}
          toggleModal={() => dispatch({ type: "TOGGLE_PURCHASE_PAYMENTS" })}
          onDeleteSuccess={onSuccess}
        />
      ) : null}
    </div>
  );
}
