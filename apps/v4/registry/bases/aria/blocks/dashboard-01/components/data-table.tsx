"use client"

import * as React from "react"
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table"
import {
  DropIndicator,
  useDragAndDrop,
  useListData,
} from "react-aria-components"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { toast } from "sonner"
import { z } from "zod"

import { useIsMobile } from "@/registry/bases/aria/hooks/use-mobile"
import { Badge } from "@/registry/bases/aria/ui/badge"
import { Button } from "@/registry/bases/aria/ui/button"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/registry/bases/aria/ui/chart"
import { Checkbox } from "@/registry/bases/aria/ui/checkbox"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/registry/bases/aria/ui/drawer"
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/registry/bases/aria/ui/dropdown-menu"
import { Input } from "@/registry/bases/aria/ui/input"
import { Label } from "@/registry/bases/aria/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/bases/aria/ui/select"
import { Separator } from "@/registry/bases/aria/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/registry/bases/aria/ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/registry/bases/aria/ui/tabs"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export const schema = z.object({
  id: z.number(),
  header: z.string(),
  type: z.string(),
  status: z.string(),
  target: z.string(),
  limit: z.string(),
  reviewer: z.string(),
})

// Create a separate component for the drag handle
function DragHandle() {
  return (
    <Button
      slot="drag"
      variant="ghost"
      size="icon"
      className="size-7 text-muted-foreground hover:bg-transparent"
    >
      <IconPlaceholder
        lucide="GripVerticalIcon"
        tabler="IconGripVertical"
        hugeicons="DragDropVerticalIcon"
        phosphor="DotsSixVerticalIcon"
        remixicon="RiDraggable"
        className="size-3 text-muted-foreground"
      />
    </Button>
  )
}
const columns: ColumnDef<z.infer<typeof schema>>[] = [
  {
    id: "drag",
    header: () => null,
    cell: ({ row }) => <DragHandle />,
  },
  {
    id: "select",
    header: () => (
      <div className="flex items-center justify-center">
        <Checkbox slot="selection" />
      </div>
    ),
    cell: () => (
      <div className="flex items-center justify-center">
        <Checkbox slot="selection" />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "header",
    header: "Header",
    cell: ({ row }) => {
      return <TableCellViewer item={row.original} />
    },
    enableHiding: false,
  },
  {
    accessorKey: "type",
    header: "Section Type",
    cell: ({ row }) => (
      <div className="w-32">
        <Badge variant="outline" className="px-1.5 text-muted-foreground">
          {row.original.type}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant="outline" className="px-1.5 text-muted-foreground">
        {row.original.status === "Done" ? (
          <IconPlaceholder
            lucide="CircleCheckIcon"
            tabler="IconCircleCheckFilled"
            hugeicons="CheckmarkCircle01Icon"
            phosphor="CheckCircleIcon"
            remixicon="RiCheckboxCircleFill"
            className="fill-green-500 dark:fill-green-400"
          />
        ) : (
          <IconPlaceholder
            lucide="LoaderIcon"
            tabler="IconLoader"
            hugeicons="Loading03Icon"
            phosphor="SpinnerIcon"
            remixicon="RiLoader4Line"
          />
        )}
        {row.original.status}
      </Badge>
    ),
  },
  {
    accessorKey: "target",
    header: () => <div className="w-full text-right">Target</div>,
    cell: ({ row }) => (
      <form
        onSubmit={(e) => {
          e.preventDefault()
          toast.promise(new Promise((resolve) => setTimeout(resolve, 1000)), {
            loading: `Saving ${row.original.header}`,
            success: "Done",
            error: "Error",
          })
        }}
      >
        <Label htmlFor={`${row.original.id}-target`} className="sr-only">
          Target
        </Label>
        <Input
          className="h-8 w-16 border-transparent bg-transparent text-right shadow-none hover:bg-input/30 focus-visible:border focus-visible:bg-background dark:bg-transparent dark:hover:bg-input/30 dark:focus-visible:bg-input/30"
          defaultValue={row.original.target}
          id={`${row.original.id}-target`}
        />
      </form>
    ),
  },
  {
    accessorKey: "limit",
    header: () => <div className="w-full text-right">Limit</div>,
    cell: ({ row }) => (
      <form
        onSubmit={(e) => {
          e.preventDefault()
          toast.promise(new Promise((resolve) => setTimeout(resolve, 1000)), {
            loading: `Saving ${row.original.header}`,
            success: "Done",
            error: "Error",
          })
        }}
      >
        <Label htmlFor={`${row.original.id}-limit`} className="sr-only">
          Limit
        </Label>
        <Input
          className="h-8 w-16 border-transparent bg-transparent text-right shadow-none hover:bg-input/30 focus-visible:border focus-visible:bg-background dark:bg-transparent dark:hover:bg-input/30 dark:focus-visible:bg-input/30"
          defaultValue={row.original.limit}
          id={`${row.original.id}-limit`}
        />
      </form>
    ),
  },
  {
    accessorKey: "reviewer",
    header: "Reviewer",
    cell: ({ row }) => {
      const isAssigned = row.original.reviewer !== "Assign reviewer"
      if (isAssigned) {
        return row.original.reviewer
      }
      return (
        <>
          <Label htmlFor={`${row.original.id}-reviewer`} className="sr-only">
            Reviewer
          </Label>
          <Select placeholder="Assign reviewer">
            <SelectTrigger
              className="w-38 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate"
              size="sm"
              id={`${row.original.id}-reviewer`}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent placement="bottom end">
              <SelectGroup>
                <SelectItem id="Eddie Lake">Eddie Lake</SelectItem>
                <SelectItem id="Jamik Tashpulatov">
                  Jamik Tashpulatov
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </>
      )
    },
  },
  {
    id: "actions",
    cell: () => (
      <DropdownMenuTrigger>
        <Button
          variant="ghost"
          className="flex size-8 text-muted-foreground aria-expanded:bg-muted"
          size="icon"
        >
          <IconPlaceholder
            lucide="EllipsisVerticalIcon"
            tabler="IconDotsVertical"
            hugeicons="MoreVerticalCircle01Icon"
            phosphor="DotsThreeVerticalIcon"
            remixicon="RiMore2Line"
          />
          <span className="sr-only">Open menu</span>
        </Button>
        <DropdownMenu placement="bottom end" className="w-32">
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuItem>Make a copy</DropdownMenuItem>
          <DropdownMenuItem>Favorite</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
        </DropdownMenu>
      </DropdownMenuTrigger>
    ),
  },
]

export function DataTable({
  data: initialData,
}: {
  data: z.infer<typeof schema>[]
}) {
  const list = useListData({
    initialItems: initialData,
    getKey: (item) => String(item.id),
  })
  const data = list.items
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })
  const { dragAndDropHooks } = useDragAndDrop({
    getItems: (keys, items: z.infer<typeof schema>[]) =>
      items.map((item) => ({
        "text/plain": item.header,
      })),
    onReorder(e) {
      if (e.target.dropPosition === "before") {
        list.moveBefore(e.target.key, e.keys)
      } else if (e.target.dropPosition === "after") {
        list.moveAfter(e.target.key, e.keys)
      }
    },
    renderDropIndicator(target) {
      return (
        <DropIndicator
          target={target}
          className="outline-blue-400 data-drop-target:outline-1"
        />
      )
    },
  })

  return (
    <Tabs
      defaultSelectedKey="outline"
      className="w-full flex-col justify-start gap-6"
    >
      <div className="flex items-center justify-between px-4 lg:px-6">
        <Label htmlFor="view-selector" className="sr-only">
          View
        </Label>
        {/* <Select placeholder="Select a view" defaultValue="outline">
          <SelectTrigger
            className="flex w-fit @4xl/main:hidden"
            size="sm"
            id="view-selector"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem id="outline">Outline</SelectItem>
              <SelectItem id="past-performance">Past Performance</SelectItem>
              <SelectItem id="key-personnel">Key Personnel</SelectItem>
              <SelectItem id="focus-documents">Focus Documents</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select> */}
        <TabsList className="hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:bg-muted-foreground/30 **:data-[slot=badge]:px-1 @4xl/main:flex">
          <TabsTrigger id="outline">Outline</TabsTrigger>
          <TabsTrigger id="past-performance">
            Past Performance <Badge variant="secondary">3</Badge>
          </TabsTrigger>
          <TabsTrigger id="key-personnel">
            Key Personnel <Badge variant="secondary">2</Badge>
          </TabsTrigger>
          <TabsTrigger id="focus-documents">Focus Documents</TabsTrigger>
        </TabsList>
        <div className="flex items-center gap-2">
          {/* <DropdownMenuTrigger>
            <Button variant="outline" size="sm">
              <IconPlaceholder
                lucide="Columns3Icon"
                tabler="IconLayoutColumns"
                hugeicons="LeftToRightListBulletIcon"
                phosphor="ColumnsIcon"
                remixicon="RiLayoutColumnLine"
                data-icon="inline-start"
              />
              Columns
              <IconPlaceholder
                lucide="ChevronDownIcon"
                tabler="IconChevronDown"
                hugeicons="ArrowDown01Icon"
                phosphor="CaretDownIcon"
                remixicon="RiArrowDownSLine"
                data-icon="inline-end"
              />
            </Button>
            <DropdownMenu
              align="end"
              className="w-32"
              selectionMode="multiple"
              selectedKeys={
                table
                  .getVisibleFlatColumns()
                  .filter((column) => column.getCanHide())
                  .map(column => column.id)
              }
              onSelectionChange={(keys) => {
                table.setColumnVisibility(
                  Object.fromEntries(
                    table
                      .getAllFlatColumns()
                      .map((c) => [
                        c.id,
                        !c.getCanHide() || keys === "all" || keys.has(c.id),
                      ])
                  )
                )
              }}
            >
              {table
                .getAllColumns()
                .filter(
                  (column) =>
                    typeof column.accessorFn !== "undefined" &&
                    column.getCanHide()
                )
                .map((column) => {
                  return (
                    <DropdownMenuItem
                      key={column.id}
                      id={column.id}
                      className="capitalize"
                    >
                      {column.id}
                    </DropdownMenuItem>
                  )
                })}
            </DropdownMenu>
          </DropdownMenuTrigger> */}

          <Button variant="outline" size="sm">
            <IconPlaceholder
              lucide="PlusIcon"
              tabler="IconPlus"
              hugeicons="Add01Icon"
              phosphor="PlusIcon"
              remixicon="RiAddLine"
            />
            <span className="hidden lg:inline">Add Section</span>
          </Button>
        </div>
      </div>
      <TabsContent
        id="outline"
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
      >
        <div className="overflow-hidden rounded-lg border">
          <Table
            aria-label="Tasks"
            dragAndDropHooks={dragAndDropHooks}
            selectionMode="multiple"
            onSelectionChange={(selection) => {
              if (selection === "all") {
                table.toggleAllRowsSelected()
              } else {
                table.setRowSelection(
                  Object.fromEntries([...selection].map((key) => [key, true]))
                )
              }
            }}
            sortDescriptor={
              sorting.length
                ? {
                    column: sorting[0].id,
                    direction: sorting[0].desc ? "descending" : "ascending",
                  }
                : undefined
            }
            onSortChange={(sortDescriptor) => {
              table.setSorting([
                {
                  id: "" + sortDescriptor.column,
                  desc: sortDescriptor.direction === "descending",
                },
              ])
            }}
          >
            <TableHeader className="sticky top-0 z-10 bg-muted">
              {table.getFlatHeaders().map((header) => (
                <TableHead
                  key={header.id}
                  id={header.id}
                  isRowHeader={header.index === 1}
                  allowsSorting={header.column.getCanSort()}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableHeader>
            <TableBody
              className="data-empty:h-24 data-empty:text-center **:data-[slot=table-cell]:first:w-8"
              renderEmptyState={() => "No results."}
            >
              {table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  id={row.id}
                  value={row.original}
                  className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
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
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between px-4">
          <div className="hidden flex-1 text-sm text-muted-foreground lg:flex">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="flex w-full items-center gap-8 lg:w-fit">
            <div className="hidden items-center gap-2 lg:flex">
              <Label htmlFor="rows-per-page" className="text-sm font-medium">
                Rows per page
              </Label>
              <Select
                aria-label="Rows per page"
                placeholder={`${table.getState().pagination.pageSize}`}
                value={`${table.getState().pagination.pageSize}`}
                onChange={(value) => {
                  table.setPageSize(Number(value))
                }}
              >
                <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent placement="top">
                  <SelectGroup>
                    {[10, 20, 30, 40, 50].map((pageSize) => (
                      <SelectItem key={pageSize} id={`${pageSize}`}>
                        {pageSize}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-fit items-center justify-center text-sm font-medium">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </div>
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onPress={() => table.setPageIndex(0)}
                isDisabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to first page</span>
                <IconPlaceholder
                  lucide="ChevronsLeftIcon"
                  tabler="IconChevronsLeft"
                  hugeicons="ArrowLeftDoubleIcon"
                  phosphor="CaretDoubleLeftIcon"
                  remixicon="RiSkipLeftLine"
                />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onPress={() => table.previousPage()}
                isDisabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to previous page</span>
                <IconPlaceholder
                  lucide="ChevronLeftIcon"
                  tabler="IconChevronLeft"
                  hugeicons="ArrowLeft01Icon"
                  phosphor="CaretLeftIcon"
                  remixicon="RiArrowLeftSLine"
                />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onPress={() => table.nextPage()}
                isDisabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to next page</span>
                <IconPlaceholder
                  lucide="ChevronRightIcon"
                  tabler="IconChevronRight"
                  hugeicons="ArrowRight01Icon"
                  phosphor="CaretRightIcon"
                  remixicon="RiArrowRightSLine"
                />
              </Button>
              <Button
                variant="outline"
                className="hidden size-8 lg:flex"
                size="icon"
                onPress={() => table.setPageIndex(table.getPageCount() - 1)}
                isDisabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to last page</span>
                <IconPlaceholder
                  lucide="ChevronsRightIcon"
                  tabler="IconChevronsRight"
                  hugeicons="ArrowRightDoubleIcon"
                  phosphor="CaretDoubleRightIcon"
                  remixicon="RiSkipRightLine"
                />
              </Button>
            </div>
          </div>
        </div>
      </TabsContent>
      <TabsContent id="past-performance" className="flex flex-col px-4 lg:px-6">
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
      </TabsContent>
      <TabsContent id="key-personnel" className="flex flex-col px-4 lg:px-6">
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
      </TabsContent>
      <TabsContent id="focus-documents" className="flex flex-col px-4 lg:px-6">
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
      </TabsContent>
    </Tabs>
  )
}
const chartData = [
  {
    month: "January",
    desktop: 186,
    mobile: 80,
  },
  {
    month: "February",
    desktop: 305,
    mobile: 200,
  },
  {
    month: "March",
    desktop: 237,
    mobile: 120,
  },
  {
    month: "April",
    desktop: 73,
    mobile: 190,
  },
  {
    month: "May",
    desktop: 209,
    mobile: 130,
  },
  {
    month: "June",
    desktop: 214,
    mobile: 140,
  },
]
const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--primary)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--primary)",
  },
} satisfies ChartConfig
function TableCellViewer({ item }: { item: z.infer<typeof schema> }) {
  const isMobile = useIsMobile()
  return (
    <Drawer swipeDirection={isMobile ? "down" : "right"}>
      <DrawerTrigger
        render={
          <Button
            variant="link"
            className="w-fit px-0 text-left text-foreground"
          />
        }
      >
        {item.header}
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="gap-1">
          <DrawerTitle>{item.header}</DrawerTitle>
          <DrawerDescription>
            Showing total visitors for the last 6 months
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
          {!isMobile && (
            <>
              <ChartContainer config={chartConfig}>
                <AreaChart
                  accessibilityLayer
                  data={chartData}
                  margin={{
                    left: 0,
                    right: 10,
                  }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value.slice(0, 3)}
                    hide
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dot" />}
                  />
                  <Area
                    dataKey="mobile"
                    type="natural"
                    fill="var(--color-mobile)"
                    fillOpacity={0.6}
                    stroke="var(--color-mobile)"
                    stackId="a"
                  />
                  <Area
                    dataKey="desktop"
                    type="natural"
                    fill="var(--color-desktop)"
                    fillOpacity={0.4}
                    stroke="var(--color-desktop)"
                    stackId="a"
                  />
                </AreaChart>
              </ChartContainer>
              <Separator />
              <div className="grid gap-2">
                <div className="flex gap-2 leading-none font-medium">
                  Trending up by 5.2% this month{" "}
                  <IconPlaceholder
                    lucide="TrendingUpIcon"
                    tabler="IconTrendingUp"
                    hugeicons="ChartUpIcon"
                    phosphor="TrendUpIcon"
                    remixicon="RiArrowUpLine"
                    className="size-4"
                  />
                </div>
                <div className="text-muted-foreground">
                  Showing total visitors for the last 6 months. This is just
                  some random text to test the layout. It spans multiple lines
                  and should wrap around.
                </div>
              </div>
              <Separator />
            </>
          )}
          <form className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              <Label htmlFor="header">Header</Label>
              <Input id="header" defaultValue={item.header} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="type">Type</Label>
                <Select
                  placeholder="Select a type"
                  aria-label="Type"
                  defaultValue={item.type}
                >
                  <SelectTrigger id="type" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem id="Table of Contents">
                        Table of Contents
                      </SelectItem>
                      <SelectItem id="Executive Summary">
                        Executive Summary
                      </SelectItem>
                      <SelectItem id="Technical Approach">
                        Technical Approach
                      </SelectItem>
                      <SelectItem id="Design">Design</SelectItem>
                      <SelectItem id="Capabilities">Capabilities</SelectItem>
                      <SelectItem id="Focus Documents">
                        Focus Documents
                      </SelectItem>
                      <SelectItem id="Narrative">Narrative</SelectItem>
                      <SelectItem id="Cover Page">Cover Page</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="status">Status</Label>
                <Select
                  aria-label="Status"
                  placeholder="Select a status"
                  defaultValue={item.status}
                >
                  <SelectTrigger id="status" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem id="Done">Done</SelectItem>
                      <SelectItem id="In Progress">In Progress</SelectItem>
                      <SelectItem id="Not Started">Not Started</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="target">Target</Label>
                <Input id="target" defaultValue={item.target} />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="limit">Limit</Label>
                <Input id="limit" defaultValue={item.limit} />
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="reviewer">Reviewer</Label>
              <Select
                aria-label="Reviewer"
                placeholder="Select a reviewer"
                defaultValue={item.reviewer}
              >
                <SelectTrigger id="reviewer" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem id="Eddie Lake">Eddie Lake</SelectItem>
                    <SelectItem id="Jamik Tashpulatov">
                      Jamik Tashpulatov
                    </SelectItem>
                    <SelectItem id="Emily Whalen">Emily Whalen</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </form>
        </div>
        <DrawerFooter>
          <Button>Submit</Button>
          <DrawerClose render={<Button variant="outline" />}>Done</DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
