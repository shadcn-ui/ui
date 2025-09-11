"use client"

import * as React from "react"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type Row,
  type SortingState,
  type VisibilityState,
  type Column,
  type FilterFn,
} from "@tanstack/react-table"
import {
  ArrowUpDown,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/new-york-v4/ui/button"
import { Checkbox } from "@/registry/new-york-v4/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/registry/new-york-v4/ui/dropdown-menu"
import { Input } from "@/registry/new-york-v4/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/registry/new-york-v4/ui/table"

interface DataGridColumnMeta {
  className?: string
  headerClassName?: string
  align?: "left" | "center" | "right"
}

export interface DataGridColumn<TData> {
  accessorKey: keyof TData
  header: string | ((props: { column: Column<TData, unknown> }) => React.ReactNode)
  cell?: (props: { row: Row<TData>; getValue: () => unknown }) => React.ReactNode
  enableSorting?: boolean
  enableHiding?: boolean
  filterFn?: FilterFn<TData> | keyof typeof import("@tanstack/react-table").filterFns
  size?: number
  minSize?: number
  maxSize?: number
  meta?: DataGridColumnMeta
}

export interface DataGridProps<TData> {
  data: TData[]
  columns: DataGridColumn<TData>[]
  searchKey?: keyof TData
  searchPlaceholder?: string
  enableRowSelection?: boolean
  enableColumnVisibility?: boolean
  enablePagination?: boolean
  pageSize?: number
  pageSizeOptions?: number[]
  onRowClick?: (row: TData) => void
  onSelectionChange?: (selectedRows: TData[]) => void
  className?: string
  containerClassName?: string
  emptyMessage?: string | React.ReactNode
  loading?: boolean
  error?: Error | null
  errorMessage?: string | React.ReactNode
  toolbar?: React.ReactNode
  stickyHeader?: boolean
  height?: string | number
  // Server-side props
  serverSide?: boolean
  onSearch?: (searchTerm: string) => void | Promise<void>
  searchDebounceMs?: number
  totalCount?: number
  currentPage?: number
  onPageChange?: (page: number, pageSize: number) => void
  onSortChange?: (sorting: SortingState) => void
}

export function DataGrid<TData extends object = object>({
  data,
  columns,
  searchKey,
  searchPlaceholder = "Search...",
  enableRowSelection = false,
  enableColumnVisibility = false,
  enablePagination = true,
  pageSize = 10,
  pageSizeOptions = [10, 20, 30, 40, 50],
  onRowClick,
  onSelectionChange,
  className,
  containerClassName,
  emptyMessage = "No results found.",
  loading = false,
  error = null,
  errorMessage,
  toolbar,
  stickyHeader = false,
  height,
  // Server-side props
  serverSide = false,
  onSearch,
  searchDebounceMs = 300,
  totalCount,
  currentPage,
  onPageChange,
  onSortChange,
}: DataGridProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [pagination, setPagination] = React.useState({
    pageIndex: currentPage || 0,
    pageSize,
  })

  const searchTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)

  // Transform columns to TanStack Table format
  const tableColumns = React.useMemo<ColumnDef<TData>[]>(() => {
    const cols: ColumnDef<TData>[] = []

    // Add selection column if enabled
    if (enableRowSelection) {
      cols.push({
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
        size: 20,
      })
    }

    // Add data columns
    cols.push(
      ...columns.map(
        (column): ColumnDef<TData> => ({
          accessorKey: column.accessorKey as string,
          header: ({ column: col }) => {
            if (typeof column.header === 'function') {
              return column.header({ column: col })
            }
            if (column.enableSorting === false) {
              return <div>{column.header}</div>
            }
            return (
              <Button
                variant="ghost"
                onClick={() => {
                  const newSorting =
                    col.getIsSorted() === "asc" ? "desc" : "asc"
                  col.toggleSorting(col.getIsSorted() === "asc")

                  if (serverSide && onSortChange) {
                    const newSortingState = [
                      { id: col.id, desc: newSorting === "desc" },
                    ]
                    onSortChange(newSortingState)
                  }
                }}
                className="h-auto p-0 hover:bg-transparent"
              >
                {column.header}
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            )
          },
          cell: column.cell || (({ getValue }) => getValue()),
          enableSorting: column.enableSorting !== false,
          enableHiding: column.enableHiding !== false,
          filterFn: column.filterFn,
          meta: column.meta,
        })
      )
    )

    return cols
  }, [columns, enableRowSelection, serverSide, onSortChange])

  const table = useReactTable({
    data,
    columns: tableColumns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: enablePagination
      ? getPaginationRowModel()
      : undefined,
    getSortedRowModel: serverSide ? undefined : getSortedRowModel(),
    getFilteredRowModel: serverSide ? undefined : getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    globalFilterFn: serverSide ? undefined : "includesString",
    manualPagination: serverSide,
    manualSorting: serverSide,
    manualFiltering: serverSide,
    pageCount:
      serverSide && totalCount
        ? Math.ceil(totalCount / pagination.pageSize)
        : undefined,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter: serverSide ? undefined : globalFilter,
      pagination: enablePagination ? pagination : undefined,
    },
  })

  // Handle selection changes
  React.useEffect(() => {
    if (onSelectionChange && enableRowSelection) {
      const selectedRows = table.getSelectedRowModel().rows.map(row => row.original)
      onSelectionChange(selectedRows)
    }
  }, [rowSelection, onSelectionChange, enableRowSelection, table])

  // Handle server-side pagination
  React.useEffect(() => {
    if (serverSide && onPageChange && enablePagination) {
      onPageChange(pagination.pageIndex, pagination.pageSize)
    }
  }, [
    pagination.pageIndex,
    pagination.pageSize,
    serverSide,
    onPageChange,
    enablePagination,
  ])

  // Handle search with debouncing
  React.useEffect(() => {
    if (serverSide && onSearch && searchKey) {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
      searchTimeoutRef.current = setTimeout(() => {
        onSearch(globalFilter)
      }, searchDebounceMs)
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [globalFilter, serverSide, onSearch, searchKey, searchDebounceMs])

  // Update page size when prop changes
  React.useEffect(() => {
    if (enablePagination) {
      setPagination((prev) => ({ ...prev, pageSize }))
    }
  }, [pageSize, enablePagination])

  // Update current page when prop changes (for server-side pagination)
  React.useEffect(() => {
    if (serverSide && currentPage !== undefined) {
      setPagination((prev) => ({ ...prev, pageIndex: currentPage }))
    }
  }, [currentPage, serverSide])

  const handleSearch = (value: string) => {
    setGlobalFilter(value)
    if (serverSide) {
      // Reset to first page when searching
      setPagination((prev) => ({ ...prev, pageIndex: 0 }))
    }
  }

  return (
    <div className={cn("w-full space-y-4", className)}>
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center space-x-2">
          {searchKey && (
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground " />
              <Input
                placeholder={searchPlaceholder}
                value={globalFilter ?? ""}
                onChange={(event) => handleSearch(event.target.value)}
                className="max-w-sm pl-8"
                disabled={loading}
              />
            </div>
          )}
          {toolbar}
        </div>
        {enableColumnVisibility && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto" disabled={loading}>
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Selection info */}
      {enableRowSelection && (
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {serverSide
            ? totalCount || data.length
            : table.getFilteredRowModel().rows.length}{" "}
          row(s) selected.
        </div>
      )}

      {/* Table */}
      <div 
        className={cn(
          "rounded-md border",
          containerClassName,
          height && "relative overflow-auto"
        )}
        style={height ? { height } : undefined}
      >
        <Table>
          <TableHeader className={cn(stickyHeader && "sticky top-0 z-10 bg-background")}>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className={cn(
                        (header.column.columnDef.meta as DataGridColumnMeta)?.headerClassName
                      )}
                      style={{
                        width: header.column.getSize() ? `${header.column.getSize()}px` : undefined,
                        textAlign: (header.column.columnDef.meta as DataGridColumnMeta)?.align
                      }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={tableColumns.length}
                  className="h-24 text-center"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-primary"></div>
                    <span>Loading...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell
                  colSpan={tableColumns.length}
                  className="h-24 text-center"
                >
                  <div className="text-destructive">
                    {errorMessage || "An error occurred while loading data."}
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={onRowClick ? "cursor-pointer" : ""}
                  onClick={() => onRowClick?.(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={(cell.column.columnDef.meta as DataGridColumnMeta)?.className}
                      style={{
                        textAlign: (cell.column.columnDef.meta as DataGridColumnMeta)?.align
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={tableColumns.length}
                  className="h-24 text-center"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {enablePagination && (
        <div className="flex items-center justify-between px-2">
          <div className="flex-1 text-sm text-muted-foreground">
            {enableRowSelection &&
              table.getFilteredSelectedRowModel().rows.length > 0 && (
                <span>
                  {table.getFilteredSelectedRowModel().rows.length} of{" "}
                  {serverSide
                    ? totalCount || data.length
                    : table.getFilteredRowModel().rows.length}{" "}
                  row(s) selected.
                </span>
              )}
          </div>
          <div className="flex items-center space-x-6 lg:space-x-8">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium">Rows per page</p>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" disabled={loading}>
                    {pagination.pageSize}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {pageSizeOptions.map((size) => (
                    <DropdownMenuItem
                      key={size}
                      onClick={() =>
                        setPagination((prev) => ({
                          ...prev,
                          pageSize: size,
                          pageIndex: 0,
                        }))
                      }
                    >
                      {size}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="flex w-[100px] items-center justify-center text-sm font-medium">
              Page {pagination.pageIndex + 1} of{" "}
              {serverSide && totalCount
                ? Math.ceil(totalCount / pagination.pageSize)
                : table.getPageCount()}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() =>
                  setPagination((prev) => ({ ...prev, pageIndex: 0 }))
                }
                disabled={pagination.pageIndex === 0 || loading}
              >
                <span className="sr-only">Go to first page</span>
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() =>
                  setPagination((prev) => ({
                    ...prev,
                    pageIndex: prev.pageIndex - 1,
                  }))
                }
                disabled={pagination.pageIndex === 0 || loading}
              >
                <span className="sr-only">Go to previous page</span>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() =>
                  setPagination((prev) => ({
                    ...prev,
                    pageIndex: prev.pageIndex + 1,
                  }))
                }
                disabled={
                  (serverSide && totalCount
                    ? pagination.pageIndex >=
                      Math.ceil(totalCount / pagination.pageSize) - 1
                    : !table.getCanNextPage()) || loading
                }
              >
                <span className="sr-only">Go to next page</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => {
                  const lastPage =
                    serverSide && totalCount
                      ? Math.ceil(totalCount / pagination.pageSize) - 1
                      : table.getPageCount() - 1
                  setPagination((prev) => ({ ...prev, pageIndex: lastPage }))
                }}
                disabled={
                  (serverSide && totalCount
                    ? pagination.pageIndex >=
                      Math.ceil(totalCount / pagination.pageSize) - 1
                    : !table.getCanNextPage()) || loading
                }
              >
                <span className="sr-only">Go to last page</span>
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
