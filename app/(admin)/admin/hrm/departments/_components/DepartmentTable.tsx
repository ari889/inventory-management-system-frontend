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
  CircleCheckBig,
  CircleX,
  SquarePen,
  Trash,
  CreditCard,
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
import { departmentReducer } from "@/reducers/departmentReducer";
import { initialDepartmentState } from "@/reducerStates/departmentState";
import {
  bulkDeleteDepartments,
  deleteDepartmentById,
  getDepartments,
} from "@/actions/DepartmentAction";
import { Department } from "@/@types/department.types";
import UpdateDepartmentModal from "./UpdateDepartmentModal";
import CreateDepartment from "./CreateDepartment";
import FormFieldFilter from "@/components/common/filter/FormFieldFilter";
import FormFieldSelectFilter from "@/components/common/filter/FormFieldSelectFilter";
import UserFilter from "@/components/common/filter/UserFilter";

export default function DepartmentTable() {
  const [state, dispatch] = useReducer(
    departmentReducer,
    initialDepartmentState,
  );

  const {
    open,
    isLoading,
    sorting,
    isError,
    error,
    departments,
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
    createdBy,
  } = state;

  const totalPages = Math.ceil(totalCount / limit);

  /**
   * fetch data from server by payload
   */
  const fetchDepartmentsDebounced = useCallback(
    debounce(async (page: number, limit: number) => {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "REMOVE_ERROR" });
      try {
        const order = sorting[0]?.id ?? "id";
        const direction =
          sorting.length === 0 ? "desc" : sorting[0].desc ? "desc" : "asc";
        const data = await getDepartments({
          page,
          limit,
          order,
          direction,
          search,
          status,
          createdBy,
        });
        if (!data?.success && !data?.errors) throw new Error(data.message);
        dispatch({ type: "SET_DEPARTMENTS", payload: data.data.items });
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
    [page, limit, sorting, search, status, createdBy],
  );

  /**
   * call to server action
   */
  useEffect(() => {
    fetchDepartmentsDebounced(page, limit);

    return () => {
      fetchDepartmentsDebounced.cancel();
    };
  }, [page, limit, fetchDepartmentsDebounced]);

  /**
   * delete department by id
   */
  const deleteDepartment = useCallback(async () => {
    dispatch({ type: "SET_DELETE_LOADING", payload: true });
    try {
      const data = await deleteDepartmentById(selectedId!);
      if (!data?.success && !data?.errors) throw new Error(data.message);
      toast.success(data.message, {
        position: "top-right",
      });
      if (departments.length === 1 && page > 1)
        dispatch({ type: "SET_PAGE", payload: page - 1 });
      fetchDepartmentsDebounced(page, limit);
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
  }, [selectedId, page, limit, fetchDepartmentsDebounced, departments.length]);

  /**
   * bulk delete department
   */
  const bulkDelete = async () => {
    dispatch({ type: "TOGGLE_BULK_DELETE_LOADING", payload: true });
    try {
      const response = await bulkDeleteDepartments(Array.from(selectedRows));
      if (!response.success) throw new Error(response.message);
      dispatch({ type: "DESELECT_ALL_ROWS" });
      dispatch({ type: "TOGGLE_BULK_DELETE_MODAL" });
      dispatch({ type: "SET_PAGE", payload: 0 });
      fetchDepartmentsDebounced(0, limit);
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
  const columns = useMemo<ColumnDef<Department>[]>(
    () => [
      {
        id: "select",
        header: () => {
          const allSelected =
            state.selectedRows.size === departments.length &&
            departments.length > 0;

          return (
            <Checkbox
              checked={allSelected}
              onCheckedChange={() => {
                const allSelected =
                  state.selectedRows.size === departments.length &&
                  departments.length > 0;
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
        accessorKey: "name",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="px-0"
          >
            Name <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="font-medium">{row.getValue("name") ?? "N/A"}</div>
        ),
      },
      {
        accessorKey: "status",
        header: () => <div className="text-center">Status</div>,
        cell: ({ row }) => (
          <div className="font-medium">
            {row?.getValue("status") ? (
              <Badge variant="default">
                <CircleCheckBig />
                Active
              </Badge>
            ) : (
              <Badge variant="destructive">
                <CircleX />
                Inactive
              </Badge>
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
                  <DropdownMenuItem
                    onClick={() =>
                      dispatch({
                        type: "TOGGLE_UPDATE_MODAL",
                        payload: row.getValue("id"),
                      })
                    }
                  >
                    <SquarePen />
                    Edit
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
    [page, limit, departments.length, state.selectedRows],
  );

  /**
   * define react table by it's hook
   */
  const table = useReactTable({
    data: departments,
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
   * When department create a new department then close the modal and add the new item to the table
   * @param data
   */
  const onSuccess = (data: Department) => {
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

  /**
   * Trigger when department update
   * @param data Department
   */
  const onUpdateSuccess = (data: Department) => {
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
  if (!isLoading && !isError && !departments?.length)
    content = (
      <TableAlert
        message="No data found!"
        colspan={table.getAllColumns().length}
        heading="Info!"
        className="w-full"
      />
    );
  if (!isLoading && !isError && departments?.length)
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
              <CreditCard className="mr-2 border rounded border-gray-300 p-2 w-12 h-12" />
              <div>
                <h2 className="text-xl font-semibold">Departments</h2>
                <h3 className="text-gray-500">
                  See and manage your departments
                </h3>
              </div>
            </div>
            <ButtonGroup>
              <CreateDepartment
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
            <UserFilter
              value={createdBy ?? null}
              onChange={(id) =>
                dispatch({ type: "SET_CREATED_BY", payload: id })
              }
            />
          </div>
          <div className="rounded-xl border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="px-4 py-3 font-medium text-center"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>{content}</tbody>
            </table>
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
        <UpdateDepartmentModal
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
        title="Delete all departments!"
        description="Are you sure you want to delete all these departments?"
      />
      <DeleteModal
        open={deleteOpen}
        loading={deleteLoading}
        onOpenChange={() => dispatch({ type: "CLOSE_DELETE_MODAL" })}
        action={deleteDepartment}
        title="Delete Brand!"
        description="Are you sure you want to delete this brand?"
      />
    </div>
  );
}
