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
  PackageSearch,
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
import { Badge } from "@/components/ui/badge";
import DeleteModal from "@/components/common/DeleteModal";
import { productReducer } from "@/reducers/productReducer";
import { initialProductState } from "@/reducerStates/productState";
import {
  bulkDeleteProducts,
  deleteProductById,
  getProducts,
} from "@/actions/ProductAction";
import { Product } from "@/@types/product.types";
import CreateProduct from "./CreateProduct";
import UpdateProductModal from "./UpdateProductModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import FormFieldFilter from "@/components/common/filter/FormFieldFilter";
import FormFieldSelectFilter from "@/components/common/filter/FormFieldSelectFilter";
import UserFilter from "@/components/common/filter/UserFilter";
import BrandFilter from "@/components/common/filter/BrandFilter";
import ProductCategoryFilter from "@/components/common/filter/ProductCategoryFilter";
import UnitFilter from "@/components/common/filter/UnitFilter";
import TaxFilter from "@/components/common/filter/TaxFilter";

export default function ProductTable() {
  const [state, dispatch] = useReducer(productReducer, initialProductState);

  const {
    open,
    isLoading,
    sorting,
    isError,
    error,
    products,
    totalCount,
    page,
    limit,
    deleteOpen,
    selectedId,
    deleteLoading,
    selectedRows,
    bulkDeleteLoader,
    bulkDeleteOpen,
    showUpdateModal,
    search,
    status,
    taxMethod,
    createdBy,
    brandId,
    categoryId,
    unitId,
    purchaseUnitId,
    saleUnitId,
    taxId,
  } = state;

  const totalPages = Math.ceil(totalCount / limit);

  /**
   * fetch data from server by payload
   */
  const fetchProducts = useCallback(
    async (page: number, limit: number) => {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "REMOVE_ERROR" });
      try {
        const order = sorting[0]?.id ?? "id";
        const direction =
          sorting.length === 0 ? "desc" : sorting[0].desc ? "desc" : "asc";
        const data = await getProducts({
          page,
          limit,
          order,
          direction,
          search,
          status,
          taxMethod,
          createdBy,
          brandId,
          categoryId,
          unitId,
          purchaseUnitId,
          saleUnitId,
          taxId,
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
    },
    [
      sorting,
      search,
      status,
      taxMethod,
      createdBy,
      brandId,
      categoryId,
      unitId,
      purchaseUnitId,
      saleUnitId,
      taxId,
    ],
  );

  const fetchProductsDebounced = useMemo(
    () => debounce(fetchProducts, 500),
    [fetchProducts],
  );

  /**
   * call to server action
   */
  useEffect(() => {
    fetchProductsDebounced(page, limit);

    return () => {
      fetchProductsDebounced.cancel();
    };
  }, [page, limit, fetchProductsDebounced]);

  /**
   * delete product by id
   */
  const deleteProduct = useCallback(async () => {
    dispatch({ type: "SET_DELETE_LOADING", payload: true });
    try {
      const data = await deleteProductById(selectedId!);
      if (!data?.success && !data?.errors) throw new Error(data.message);
      toast.success(data.message, {
        position: "top-right",
      });
      if (products.length === 1 && page > 1)
        dispatch({ type: "SET_PAGE", payload: page - 1 });
      fetchProductsDebounced(page, limit);
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
  }, [selectedId, page, limit, fetchProductsDebounced, products.length]);

  /**
   * bulk delete products
   */
  const bulkDelete = async () => {
    dispatch({ type: "TOGGLE_BULK_DELETE_LOADING", payload: true });
    try {
      const response = await bulkDeleteProducts(Array.from(selectedRows));
      if (!response.success) throw new Error(response.message);
      dispatch({ type: "DESELECT_ALL_ROWS" });
      dispatch({ type: "TOGGLE_BULK_DELETE_MODAL" });
      dispatch({ type: "SET_PAGE", payload: 0 });
      fetchProductsDebounced(0, limit);
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
   * react table column
   */
  const columns = useMemo<ColumnDef<Product>[]>(
    () => [
      {
        id: "select",
        header: () => {
          const allSelected =
            state.selectedRows.size === products.length && products.length > 0;
          return (
            <Checkbox
              checked={allSelected}
              onCheckedChange={() =>
                dispatch({
                  type: allSelected ? "DESELECT_ALL_ROWS" : "SELECT_ALL_ROWS",
                })
              }
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
        cell: ({ row }) => (
          <div className="text-center">{page * limit + row.index + 1}</div>
        ),
        size: 50,
      },
      {
        accessorKey: "name",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="px-0"
          >
            Product <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={`${process.env.NEXT_PUBLIC_API_URL}${row.original.image}`}
                alt={row.original.name}
              />
              <AvatarFallback>{row.original.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{row.original.name}</div>
              <div className="text-xs text-muted-foreground">
                {row.original.code ?? "N/A"}
              </div>
            </div>
          </div>
        ),
      },
      {
        id: "category_brand",
        header: () => <div className="text-center">Category / Brand</div>,
        cell: ({ row }) => (
          <div className="text-center text-sm">
            <div>{row.original.category?.name ?? "N/A"}</div>
            <div className="text-xs text-muted-foreground">
              {row.original.brand?.title ?? "N/A"}
            </div>
          </div>
        ),
      },
      {
        id: "price",
        header: ({ column }) => (
          <div className="text-center">
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="px-0"
            >
              Cost / Price <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-center text-sm">
            <div className="font-medium">{row.original.price ?? "N/A"}</div>
            <div className="text-xs text-muted-foreground">
              Cost: {row.original.cost ?? "N/A"}
            </div>
          </div>
        ),
      },
      {
        id: "qty",
        header: ({ column }) => (
          <div className="text-center">
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="px-0"
            >
              Stock <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-center text-sm">
            <div className="font-medium">{row.original.qty ?? "N/A"}</div>
            <div className="text-xs text-muted-foreground">
              Alert: {row.original.alertQty ?? "N/A"}
            </div>
          </div>
        ),
      },
      {
        id: "tax",
        header: () => <div className="text-center">Tax</div>,
        cell: ({ row }) => (
          <div className="text-center text-sm">
            <div>{row.original.tax?.name ?? "N/A"}</div>
            <Badge
              variant={row.original.taxMethod ? "default" : "destructive"}
              className="text-xs mt-1"
            >
              {row.original.taxMethod ? "Exclusive" : "Inclusive"}
            </Badge>
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: ({ column }) => (
          <div className="text-center">
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="px-0"
            >
              Status <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-center">
            <Badge variant={row.original.status ? "default" : "destructive"}>
              {row.original.status ? "Active" : "Inactive"}
            </Badge>
          </div>
        ),
      },
      {
        id: "actions",
        header: () => <div className="text-center">Actions</div>,
        cell: ({ row }) => (
          <div className="flex justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-2xl">
                <DropdownMenuItem
                  onClick={() =>
                    dispatch({
                      type: "TOGGLE_UPDATE_MODAL",
                      payload: row.getValue("id"),
                    })
                  }
                >
                  <SquarePen /> Edit
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
                  <Trash /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ),
      },
    ],
    [page, limit, products.length, state.selectedRows],
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
   * When product create a new product then close the modal and add the new item to the table
   * @param data
   */
  const onSuccess = (data: Product) => {
    if (page === 0) {
      dispatch({
        type: "REFRESH",
        payload: data,
      });
    } else {
      dispatch({
        type: "SET_PAGE",
        payload: 0,
      });
    }
    dispatch({
      type: "SET_COUNT",
      payload: totalCount + 1,
    });
    dispatch({ type: "TOGGLE_MODAL" });
  };

  const onUpdateSuccess = (data: Product) => {
    dispatch({
      type: "UPDATE_SUCCESS",
      payload: data,
    });
  };

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
      <TableRow key={row.id}>
        {row.getVisibleCells().map((cell) => (
          <TableCell key={cell.id}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        ))}
      </TableRow>
    ));

  return (
    <div className="p-6 w-full min-w-0 overflow-x-hidden">
      <Card className="rounded-2xl shadow-sm w-full min-w-0 overflow-hidden">
        <CardContent className="min-w-0">
          <div className="flex flex-row justify-between items-center my-3">
            <div className="flex flex-row justify-start items-center">
              <PackageSearch className="mr-2 border rounded border-gray-300 p-2 w-12 h-12" />
              <div>
                <h2 className="text-xl font-semibold">Products</h2>
                <h3 className="text-gray-500">See and manage your products</h3>
              </div>
            </div>
            <ButtonGroup>
              <CreateProduct
                open={open}
                onSuccess={onSuccess}
                toggleModal={() => dispatch({ type: "TOGGLE_MODAL" })}
              />
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
          <div className="grid grid-cols-3 gap-4 mb-3">
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
            <FormFieldSelectFilter
              label="Tax Methode"
              placeholder="Select option"
              groupLabel="Filter by tax method"
              options={[
                { value: "all", label: "All" },
                { value: "true", label: "Inclusive" },
                { value: "false", label: "Exclusive" },
              ]}
              value={taxMethod === undefined ? "all" : String(taxMethod)}
              onValueChange={(val) => {
                if (val === "all") {
                  dispatch({ type: "SET_TAX_METHOD", payload: null });
                } else {
                  dispatch({ type: "SET_TAX_METHOD", payload: val === "true" });
                }
              }}
            />
            <UserFilter
              value={createdBy ?? null}
              onChange={(id) =>
                dispatch({ type: "SET_CREATED_BY", payload: id })
              }
            />
            <BrandFilter
              value={brandId ?? null}
              onChange={(id) => dispatch({ type: "SET_BRAND_ID", payload: id })}
            />
            <ProductCategoryFilter
              value={categoryId ?? null}
              onChange={(id) =>
                dispatch({ type: "SET_CATEGORY_ID", payload: id })
              }
            />
            <UnitFilter
              value={unitId ?? null}
              onChange={(id) => dispatch({ type: "SET_UNIT_ID", payload: id })}
            />
            <UnitFilter
              value={purchaseUnitId ?? null}
              onChange={(id) =>
                dispatch({ type: "SET_PURCHASE_UNIT_ID", payload: id })
              }
              label="Purchase Unit"
            />
            <UnitFilter
              value={saleUnitId ?? null}
              onChange={(id) =>
                dispatch({ type: "SET_SALE_UNIT_ID", payload: id })
              }
              label="Sale Unit"
            />
            <TaxFilter
              value={taxId ?? null}
              onChange={(id) => dispatch({ type: "SET_TAX_ID", payload: id })}
            />
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
      {selectedId && showUpdateModal && (
        <UpdateProductModal
          id={selectedId as number}
          open={showUpdateModal}
          toggleModal={() =>
            dispatch({ type: "TOGGLE_UPDATE_MODAL", payload: null })
          }
          onSuccess={onUpdateSuccess}
        />
      )}
      <DeleteModal
        open={bulkDeleteOpen}
        loading={bulkDeleteLoader}
        onOpenChange={() => dispatch({ type: "TOGGLE_BULK_DELETE_MODAL" })}
        action={bulkDelete}
        title="Delete all products!"
        description="Are you sure you want to delete all these products?"
      />
      <DeleteModal
        open={deleteOpen}
        loading={deleteLoading}
        onOpenChange={() => dispatch({ type: "CLOSE_DELETE_MODAL" })}
        action={deleteProduct}
        title="Delete Product!"
        description="Are you sure you want to delete this product?"
      />
    </div>
  );
}
