"use client";

import { useCallback, useEffect, useMemo, useReducer } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  ColumnSort,
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
  Menu as MenuIcon,
  BadgeCheck,
  CircleX,
  Trash,
  SquarePen,
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
import { ActionType } from "@/@types/reducer.types";
import TableAlert from "@/components/common/TableAlert";
import DeleteModal from "../../../../components/common/DeleteModal";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { InititalPermissionState, Permission } from "@/@types/permission.types";
import {
  deletePermissionById,
  getPermissions,
} from "@/actions/PermissionAction";
import CreatePermissionModal from "./CreatePermissionModal";
import EditPermissionModal from "./EditPermissionModal";

/**
 * initial state
 */
const initialState: InititalPermissionState = {
  isLoading: true,
  sorting: [],
  isError: false,
  error: null,
  permissions: [],
  totalCount: 0,
  page: 0,
  limit: 10,
  deleteOpen: false,
  selectedId: null,
  deleteLoading: false,
  createModal: false,
  editModal: false,
};

/**
 * reducer function
 * @param state
 * @param action
 * @returns state
 */
const reducer = (
  state: InititalPermissionState,
  action: ActionType,
): InititalPermissionState => {
  switch (action.type) {
    case "SET_SORTING":
      return {
        ...state,
        sorting: action.payload as ColumnSort[],
        page: 0,
      };
    case "SET_ERROR":
      return {
        ...state,
        isError: true,
        error: action.payload as string,
      };
    case "REMOVE_ERROR":
      return {
        ...state,
        isError: false,
        error: null,
      };
    case "SET_COUNT":
      return {
        ...state,
        totalCount: action.payload as number,
      };
    case "SET_PAGE":
      return {
        ...state,
        page: action.payload as number,
      };
    case "SET_PAGE_SIZE":
      return {
        ...state,
        limit: action.payload as number,
      };
    case "SET_PERMISSIONS":
      return {
        ...state,
        permissions: action.payload as Permission[],
      };
    case "REFRESH":
      const newPermissions = action.payload as Permission[];
      const combined = [...newPermissions, ...state.permissions];

      const limited = combined.slice(0, state.limit);

      return {
        ...state,
        permissions: limited,
      };

    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload as boolean,
      };
    case "OPEN_DELETE_MODAL":
      return {
        ...state,
        deleteOpen: !state.deleteOpen,
        selectedId: action.payload as number,
      };
    case "CLOSE_DELETE_MODAL":
      return {
        ...state,
        deleteOpen: false,
        selectedId: null,
      };
    case "SET_DELETE_LOADING":
      return {
        ...state,
        deleteLoading: action.payload as boolean,
      };
    case "TOGGLE_MODAL":
      return {
        ...state,
        createModal: !state.createModal,
      };
    case "OPEN_EDIT_MODAL":
      return {
        ...state,
        editModal: !state.editModal,
        selectedId: action.payload as number,
      };
    case "CLOSE_EDIT_MODAL":
      return {
        ...state,
        editModal: false,
        selectedId: null,
      };
    case "UPDATE_SUCCESS":
      const payload = action.payload as Permission;
      const updatedPermissions = state.permissions.map(
        (permission: Permission) => {
          if (permission.id === payload?.id) return payload;
          return permission;
        },
      );
      return {
        ...state,
        permissions: updatedPermissions,
      };

    default:
      return state;
  }
};

export default function PermissionTable() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const {
    isLoading,
    sorting,
    isError,
    error,
    permissions,
    totalCount,
    page,
    limit,
    deleteOpen,
    selectedId,
    deleteLoading,
    createModal,
    editModal,
  } = state;

  const totalPages = Math.ceil(totalCount / limit);

  /**
   * fetch data from server by payload
   */
  const fetchPermissionsDebounced = useCallback(
    debounce(async (page: number, limit: number) => {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "REMOVE_ERROR" });
      try {
        const order = sorting[0]?.id ?? "id";
        const direction =
          sorting.length === 0 ? "desc" : sorting[0].desc ? "desc" : "asc";
        const data = await getPermissions({
          page,
          limit,
          order,
          direction,
        });
        if (!data.success) throw new Error(data.message);
        dispatch({ type: "SET_PERMISSIONS", payload: data.data.items });
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
   * delete permission by id
   */
  const deletePermission = useCallback(async () => {
    dispatch({ type: "SET_DELETE_LOADING", payload: true });
    try {
      const data = await deletePermissionById(selectedId!);
      if (!data.success) throw new Error(data.message);
      toast.success(data.message, {
        position: "top-right",
      });
      if (permissions.length === 1 && page > 1)
        dispatch({ type: "SET_PAGE", payload: page - 1 });
      fetchPermissionsDebounced(page, limit);
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
  }, [selectedId, page, limit, fetchPermissionsDebounced, permissions.length]);

  /**
   * call to server action
   */
  useEffect(() => {
    fetchPermissionsDebounced(page, limit);

    return () => {
      fetchPermissionsDebounced.cancel();
    };
  }, [page, limit, fetchPermissionsDebounced]);

  /**
   * react table column
   */
  const columns = useMemo<ColumnDef<Permission>[]>(
    () => [
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
        accessorKey: "module.moduleName",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="px-0 text-left"
          >
            Module Name <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="font-medium">{row.original.module?.moduleName}</div>
        ),
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
          <div className="font-medium">{row.getValue("name")}</div>
        ),
      },
      {
        accessorKey: "slug",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="px-0"
          >
            Slug <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="font-medium">{row.getValue("slug")}</div>
        ),
      },
      {
        accessorKey: "deletable",
        header: () => <div className="text-center">Deletable</div>,
        cell: ({ row }) => (
          <div className="text-center text-sm text-muted-foreground">
            {row.getValue("deletable") ? (
              <Badge>
                <BadgeCheck data-icon="inline-start" />
                Yes
              </Badge>
            ) : (
              <Badge variant="destructive">
                <CircleX data-icon="inline-start" />
                No
              </Badge>
            )}
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
                        type: "OPEN_EDIT_MODAL",
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
    [page, limit],
  );

  /**
   * define react table by it's hook
   */
  const table = useReactTable({
    data: permissions,
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
   * When user create a new permission then close the modal and add the new item to the table
   * @param data
   */
  const onSuccess = (data: Permission) => {
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
   * When user update a permission then close the modal and add the new item to the table
   */
  const onUpdateSuccess = (data: Permission) => {
    dispatch({
      type: "CLOSE_EDIT_MODAL",
    });
    dispatch({
      type: "UPDATE_SUCCESS",
      payload: data,
    });
  };

  /**
   * decide what to be rendered
   */
  let content = null;

  if (isLoading) content = <TableLoading columns={4} />;
  if (!isLoading && isError)
    content = (
      <TableAlert
        message={error as string}
        colspan={4}
        variant="destructive"
        heading="Failed to fetch!"
        className="w-full"
      />
    );
  if (!isLoading && !isError && !permissions?.length)
    content = (
      <TableAlert
        message="No data found!"
        colspan={4}
        heading="Info!"
        className="w-full"
      />
    );
  if (!isLoading && !isError && permissions?.length)
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
              <MenuIcon className="mr-2 border rounded border-gray-300 p-2 w-12 h-12" />
              <div>
                <h2 className="text-xl font-semibold">Permissions</h2>
                <h3 className="text-gray-500">
                  See and manage your Permissions
                </h3>
              </div>
            </div>
            <CreatePermissionModal
              open={createModal}
              toggleModal={() => dispatch({ type: "TOGGLE_MODAL" })}
              onSuccess={onSuccess}
            />
          </div>
          <div className="flex flex-row justify-between items-center mb-4">
            {/* add filter here */}
          </div>
          <div className="rounded-xl border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th key={header.id} className="px-4 py-3 font-medium">
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
      <DeleteModal
        open={deleteOpen}
        loading={deleteLoading}
        onOpenChange={() => dispatch({ type: "CLOSE_DELETE_MODAL" })}
        action={deletePermission}
        title="Delete Menu!"
        description="Are you sure you want to delete this menu?"
      />
      {editModal && selectedId && (
        <EditPermissionModal
          id={selectedId as number}
          open={editModal}
          toggleModal={() => dispatch({ type: "CLOSE_EDIT_MODAL" })}
          onSuccess={onUpdateSuccess}
        />
      )}
    </div>
  );
}
