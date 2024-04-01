"use client"

import * as React from "react"
import { Product } from "@prisma/client"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { Label } from "@/registry/new-york/ui/label"
import { Switch } from "@/registry/new-york/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/registry/new-york/ui/table"

import { DataTablePagination } from "../components/data-table-pagination"
import { DataTableToolbar } from "../components/data-table-toolbar"
import { CreateProductForm } from "./createProductForm"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  setProducts: (products: Product[]) => void
}

export function DataTable<TData, TValue>({
  columns,
  data,
  setProducts,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [sorting, setSorting] = React.useState<SortingState>([])

  // const [myData, setMyData] = React.useState(data)

  const [includeHiddenProducts, setIncludeHiddenProducts] =
    React.useState(false)

  const deleteById = (id: string) => {
    // const newData = [...myData]
    // newData.splice(
    //   //@ts-ignore
    //   newData.findIndex((c) => c.id === id),
    //   1
    // )
    // setMyData(newData)
  }

  const updateById = (id: string, key: string, value: any) => {
    // const newData = [...myData]
    // //@ts-ignore
    // const newElement = newData.find((c) => c.id === id)
    // newData.splice(
    //   //@ts-ignore
    //   newData.findIndex((c) => c.id === id),
    //   1
    // )
    // //@ts-ignore
    // newElement[key] = value
    // //@ts-ignore
    // newData.push(newElement)
    // console.log(newData)
    // setMyData(newData)
  }

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    meta: { deleteById, updateById, setProducts },
  })

  return (
    <div className="space-y-4">
      <DataTableToolbar table={table} />
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Switch
            id="display-mode"
            onClick={() => setIncludeHiddenProducts(!includeHiddenProducts)}
          />

          <Label htmlFor="display-mode">
            {includeHiddenProducts
              ? "Exclude hidden products"
              : "Include hidden products"}
          </Label>
        </div>
        {/* 
// @ts-ignore */}
        <CreateProductForm setProducts={setProducts}></CreateProductForm>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
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
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(
                (row) =>
                  //@ts-ignore
                  (row.original.hidden === includeHiddenProducts ||
                    //@ts-ignore
                    !row.original.hidden) && (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  )
              )
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  )
}
