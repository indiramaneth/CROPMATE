"use client";

import { useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
  ColumnFiltersState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/lib/hooks/use-media-query";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey?: string;
  filters?: {
    id: string;
    title: string;
    options: { label: string; value: string }[];
  }[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  filters,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [searchValue, setSearchValue] = useState("");
  const isMobile = useMediaQuery("(max-width: 640px)");

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    state: {
      columnFilters,
    },
  });

  const handleSearch = (value: string) => {
    setSearchValue(value);
    if (searchKey) {
      table.getColumn(searchKey)?.setFilterValue(value);
    }
  };

  const clearSearch = () => {
    setSearchValue("");
    if (searchKey) {
      table.getColumn(searchKey)?.setFilterValue("");
    }
  };

  return (
    <div className="space-y-4">
      {/* Search and filters */}
      {searchKey && (
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={`Search by ${searchKey.split(".").pop()}`}
              value={searchValue}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-8 h-9 sm:h-10 text-sm w-full"
            />
            {searchValue && (
              <Button
                size="sm"
                variant="ghost"
                className="absolute right-1 top-1 h-7 w-7 p-0"
                onClick={clearSearch}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {filters && filters.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => (
                <select
                  key={filter.id}
                  className="h-9 sm:h-10 rounded-md border border-input px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  onChange={(e) => {
                    const value = e.target.value;
                    table
                      .getColumn(filter.id)
                      ?.setFilterValue(value || undefined);
                  }}
                  defaultValue=""
                >
                  <option value="">{filter.title}: All</option>
                  {filter.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Mobile card view */}
      <div className="sm:hidden">
        {table.getRowModel().rows?.length ? (
          <div className="space-y-3">
            {table.getRowModel().rows.map((row) => (
              <div
                key={row.id}
                className="bg-white dark:bg-gray-800 border rounded-lg p-3 shadow-sm"
              >
                <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                  {row.getVisibleCells().map((cell) => {
                    // Skip rendering cells that have the hidden class
                    const meta = cell.column.columnDef.meta as
                      | { className?: string }
                      | undefined;

                    if (meta?.className?.includes("hidden")) {
                      return null;
                    }

                    // Safely extract the header text
                    const header =
                      typeof cell.column.columnDef.header === "string"
                        ? cell.column.columnDef.header
                        : cell.column.id;

                    return (
                      <div key={cell.id} className="py-1">
                        <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
                          {header}
                        </div>
                        <div className="text-sm">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-4 border rounded-lg bg-white dark:bg-gray-800">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No results found.
            </p>
          </div>
        )}
      </div>

      {/* Desktop table view */}
      <div className="hidden sm:block rounded-md border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    // Get the meta info from the column definition
                    const meta = header.column.columnDef.meta as
                      | { className?: string }
                      | undefined;

                    return (
                      <TableHead
                        key={header.id}
                        className={cn(meta?.className)}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => {
                  return (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => {
                        // Get the meta info from the column definition
                        const meta = cell.column.columnDef.meta as
                          | { className?: string }
                          | undefined;

                        return (
                          <TableCell
                            key={cell.id}
                            className={cn(meta?.className)}
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
