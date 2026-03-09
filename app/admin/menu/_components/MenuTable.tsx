"use client";

import { useCallback, useEffect, useMemo, useReducer } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  useReactTable,
  ColumnSort,
} from "@tanstack/react-table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  ArrowUpDown,
  CirclePlus,
  Menu as MenuIcon,
} from "lucide-react";
import { InitialMenuState, Menu } from "@/@types/menu.types";
import { getMenus } from "@/actions/MenuAction";
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
import { Input } from "@/components/ui/input";

/**
 * initial state
 */
const initialState: InitialMenuState = {
  isLoading: true,
  search: "",
  sorting: [],
  isError: false,
  error: null,
  menus: [],
  totalCount: 0,
  page: 1,
  limit: 10,
};

/**
 * reducer function
 * @param state
 * @param action
 * @returns state
 */
const reducer = (
  state: InitialMenuState,
  action: ActionType,
): InitialMenuState => {
  switch (action.type) {
    case "SET_SORTING":
      return {
        ...state,
        sorting: action.payload as ColumnSort[],
        page: 1,
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
    case "SET_MENUS":
      return {
        ...state,
        menus: action.payload as Menu[],
      };
    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload as boolean,
      };
    case "SET_SEARCH":
      return {
        ...state,
        search: action.payload as string,
        page: 1,
      };

    default:
      return state;
  }
};

export default function MenuTable() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const {
    isLoading,
    sorting,
    isError,
    error,
    menus,
    totalCount,
    page,
    limit,
    search,
  } = state;

  /**
   * fetch data from server by payload
   */
  const fetchMenusDebounced = useCallback(
    debounce(async (page: number, limit: number) => {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "REMOVE_ERROR" });
      try {
        const order = sorting[0]?.id ?? "id";
        const direction =
          sorting.length === 0 ? "desc" : sorting[0].desc ? "desc" : "asc";
        const data = await getMenus({ page, limit, order, direction, search });
        if (!data.success) throw new Error(data.message);
        dispatch({ type: "SET_MENUS", payload: data.data.items });
        dispatch({ type: "SET_COUNT", payload: data.data.totalCount });
      } catch (error) {
        if (error instanceof Error)
          dispatch({ type: "SET_ERROR", payload: error.message });

        dispatch({ type: "SET_ERROR", payload: "Something went wrong" });
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    }, 300),
    [page, limit, search, sorting],
  );

  /**
   * call to server action
   */
  useEffect(() => {
    fetchMenusDebounced(page, limit);

    return () => {
      fetchMenusDebounced.cancel();
    };
  }, [page, limit, search, fetchMenusDebounced]);

  /**
   * react table column
   */
  const columns = useMemo<ColumnDef<Menu>[]>(
    () => [
      {
        accessorKey: "menuName",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="px-0"
          >
            Menu Name <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="font-medium">{row.getValue("menuName")}</div>
        ),
      },
      {
        accessorKey: "deletable",
        header: () => <div className="text-center">Deletable</div>,
        cell: ({ row }) => (
          <div className="text-center text-sm text-muted-foreground">
            {row.getValue("deletable") ? "Yes" : "No"}
          </div>
        ),
      },
      {
        id: "actions",
        header: () => <div className="text-center">Actions</div>,
        cell: () => {
          return (
            <div className="flex justify-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-2xl">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>View</DropdownMenuItem>
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
      },
    ],
    [],
  );

  /**
   * define react table by it's hook
   */
  const table = useReactTable({
    data: menus,
    columns,
    state: { sorting },
    manualPagination: true,
    onSortingChange: (updater) => {
      const newSorting =
        typeof updater === "function" ? updater(sorting) : updater;

      dispatch({
        type: "SET_SORTING",
        payload: newSorting,
      });
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageIndex: page, pageSize: limit } },
  });

  /**
   * decide what to be rendered
   */
  let content = null;

  if (isLoading) content = <TableLoading columns={3} />;
  if (!isLoading && isError)
    content = (
      <TableAlert
        message={error as string}
        colspan={3}
        variant="destructive"
        heading="Failed to fetch!"
        className="w-full"
      />
    );
  if (!isLoading && !isError && !menus?.length)
    content = (
      <TableAlert
        message="No data found!"
        colspan={3}
        heading="Info!"
        className="w-full"
      />
    );
  if (!isLoading && !isError && menus?.length)
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
                <h2 className="text-xl font-semibold">Menus</h2>
                <h3 className="text-gray-500">See and manage your menus</h3>
              </div>
            </div>
            <Button>
              <CirclePlus />
              Create New
            </Button>
          </div>
          <div className="flex flex-row justify-between items-center mb-4">
            <Field className="w-1/3">
              <FieldLabel htmlFor="search">Search</FieldLabel>
              <Input
                id="search"
                type="text"
                placeholder="Type menu name..."
                onChange={(e) =>
                  dispatch({ type: "SET_SEARCH", payload: e.target.value })
                }
              />
            </Field>
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
                      page > 1 &&
                      dispatch({ type: "SET_PAGE", payload: page - 1 })
                    }
                    isActive={page > 1}
                  />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      page < Math.ceil(totalCount / limit) - 1 &&
                      dispatch({
                        type: "SET_PAGE",
                        payload: page + 1,
                      })
                    }
                    isActive={page < Math.ceil(totalCount / limit) - 1}
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
