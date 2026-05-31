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
import { ArrowUpDown, Bell, User } from "lucide-react";
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
import { getProductQuantityAlertReport } from "@/actions/ReportAction";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { productQuantityAlertReportReducer } from "@/reducers/productQuantityAlertReducer";
import { initialProductQuantityAlertReportState } from "@/reducerStates/productQuantityAlertState";
import ProductCategoryFilter from "@/components/common/filter/CategoryFilter";
import BrandFilter from "@/components/common/filter/BrandFilter";
import { Product } from "@/@types/product.types";

export default function ProductQuantityAlertReportTable() {
  const [state, dispatch] = useReducer(
    productQuantityAlertReportReducer,
    initialProductQuantityAlertReportState,
  );

  const {
    isLoading,
    sorting,
    isError,
    error,
    products,
    totalCount,
    page,
    limit,
    name,
    code,
    brandId,
    categoryId,
  } = state;

  const totalPages = Math.ceil(totalCount / limit);

  /**
   * fetch data from server by payload
   */
  const fetchProductQuantityAlertReportsDebounced = useCallback(
    debounce(async (page: number, limit: number) => {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "REMOVE_ERROR" });
      try {
        const order = sorting[0]?.id ?? "id";
        const direction =
          sorting.length === 0 ? "desc" : sorting[0].desc ? "desc" : "asc";
        const data = await getProductQuantityAlertReport({
          page,
          limit,
          order,
          direction,
          name,
          code,
          brandId,
          categoryId,
        });
        if (!data?.success && !data?.errors) throw new Error(data.message);
        dispatch({ type: "SET_PRODUCTS", payload: data.data.items });
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
    [page, limit, sorting, name, code, brandId, categoryId],
  );

  /**
   * call to server action
   */
  useEffect(() => {
    fetchProductQuantityAlertReportsDebounced(page, limit);

    return () => {
      fetchProductQuantityAlertReportsDebounced.cancel();
    };
  }, [page, limit, fetchProductQuantityAlertReportsDebounced]);

  /**
   * react table column
   */
  const columns = useMemo<ColumnDef<Product>[]>(
    () => [
      {
        accessorKey: "id",
        header: ({ column }) => (
          <div className="text-center">
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="px-0"
            >
              SL <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        ),
        cell: ({ row }) => page * limit + row.index + 1,
      },
      {
        accessorKey: "name",
        header: ({ column }) => (
          <div className="text-left">
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="px-0"
            >
              Name <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        ),
        cell: ({ row }) => (
          <div className="font-medium text-left">
            {row?.getValue("name") ?? "N/A"}
          </div>
        ),
      },
      {
        accessorKey: "code",
        header: ({ column }) => (
          <div className="text-left">
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="px-0"
            >
              Code <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        ),
        cell: ({ row }) => (
          <div className="font-medium text-left">
            {row?.getValue("code") ?? "N/A"}
          </div>
        ),
      },
      {
        accessorKey: "brandId",
        header: ({ column }) => (
          <div className="text-left">
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="px-0"
            >
              Brand <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        ),
        cell: ({ row }) => (
          <div className="font-medium text-left">
            {row?.original?.brand?.title ?? "N/A"}
          </div>
        ),
      },
      {
        accessorKey: "categoryId",
        header: ({ column }) => (
          <div className="text-left">
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="px-0"
            >
              Category <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        ),
        cell: ({ row }) => (
          <div className="font-medium text-left">
            {row?.original?.category?.name ?? "N/A"}
          </div>
        ),
      },
      {
        accessorKey: "qty",
        header: ({ column }) => (
          <div className="text-left">
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="px-0"
            >
              Quantity <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        ),
        cell: ({ row }) => (
          <div className="font-medium text-left">
            {row?.getValue("qty") ?? "N/A"}
          </div>
        ),
      },
      {
        accessorKey: "alertQty",
        header: ({ column }) => (
          <div className="text-left">
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="px-0"
            >
              Quantity <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        ),
        cell: ({ row }) => (
          <div className="font-medium text-left">
            {row?.getValue("alertQty") ?? "N/A"}
          </div>
        ),
      },
    ],
    [limit, page],
  );

  /**
   * define react table by it's hook
   */
  const table = useReactTable({
    data: products,
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
  if (!isLoading && !isError && !products?.length)
    content = (
      <TableAlert
        message="No data found!"
        colspan={table.getAllColumns().length}
        heading="Info!"
        className="w-full"
      />
    );
  if (!isLoading && !isError && products?.length)
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
              <Bell className="mr-2 border rounded border-gray-300 p-2 w-12 h-12" />
              <div>
                <h2 className="text-xl font-semibold">
                  Product Quantity Alert Reports
                </h2>
                <h3 className="text-gray-500">
                  See and manage your product quantity alert reports
                </h3>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-3">
            <Field className="flex flex-col gap-1.5">
              <FieldLabel
                htmlFor="name"
                className="text-sm font-medium leading-none"
              >
                Name
              </FieldLabel>
              <Input
                id="name"
                type="text"
                placeholder="Eg: Product Name"
                onChange={(e) =>
                  dispatch({ type: "SET_NAME", payload: e.target.value })
                }
              />
            </Field>
            <Field className="flex flex-col gap-1.5">
              <FieldLabel
                htmlFor="code"
                className="text-sm font-medium leading-none"
              >
                Code
              </FieldLabel>
              <Input
                id="code"
                type="text"
                placeholder="Eg: #1234"
                onChange={(e) =>
                  dispatch({ type: "SET_CODE", payload: e.target.value })
                }
              />
            </Field>
            <BrandFilter
              value={brandId ?? null}
              onChange={(id) => dispatch({ type: "SET_BRAND_ID", payload: id })}
              label="Select brand"
            />
            <ProductCategoryFilter
              value={brandId ?? null}
              onChange={(id) =>
                dispatch({ type: "SET_CATEGORY_ID", payload: id })
              }
              label="Select category"
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
