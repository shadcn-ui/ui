import * as React from "react"

import { cn } from "@/lib/utils"

const Table = (
  {
    ref,
    className,
    ...props
  }: React.HTMLAttributes<HTMLTableElement> & {
    ref: React.RefObject<HTMLTableElement>;
  }
) => (<div className="relative w-full overflow-auto">
  <table
    ref={ref}
    className={cn("w-full caption-bottom text-sm", className)}
    {...props}
  />
</div>)
Table.displayName = "Table"

const TableHeader = (
  {
    ref,
    className,
    ...props
  }: React.HTMLAttributes<HTMLTableSectionElement> & {
    ref: React.RefObject<HTMLTableSectionElement>;
  }
) => (<thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />)
TableHeader.displayName = "TableHeader"

const TableBody = (
  {
    ref,
    className,
    ...props
  }: React.HTMLAttributes<HTMLTableSectionElement> & {
    ref: React.RefObject<HTMLTableSectionElement>;
  }
) => (<tbody
  ref={ref}
  className={cn("[&_tr:last-child]:border-0", className)}
  {...props}
/>)
TableBody.displayName = "TableBody"

const TableFooter = (
  {
    ref,
    className,
    ...props
  }: React.HTMLAttributes<HTMLTableSectionElement> & {
    ref: React.RefObject<HTMLTableSectionElement>;
  }
) => (<tfoot
  ref={ref}
  className={cn(
    "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
    className
  )}
  {...props}
/>)
TableFooter.displayName = "TableFooter"

const TableRow = (
  {
    ref,
    className,
    ...props
  }: React.HTMLAttributes<HTMLTableRowElement> & {
    ref: React.RefObject<HTMLTableRowElement>;
  }
) => (<tr
  ref={ref}
  className={cn(
    "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
    className
  )}
  {...props}
/>)
TableRow.displayName = "TableRow"

const TableHead = (
  {
    ref,
    className,
    ...props
  }: React.ThHTMLAttributes<HTMLTableCellElement> & {
    ref: React.RefObject<HTMLTableCellElement>;
  }
) => (<th
  ref={ref}
  className={cn(
    "h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
    className
  )}
  {...props}
/>)
TableHead.displayName = "TableHead"

const TableCell = (
  {
    ref,
    className,
    ...props
  }: React.TdHTMLAttributes<HTMLTableCellElement> & {
    ref: React.RefObject<HTMLTableCellElement>;
  }
) => (<td
  ref={ref}
  className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)}
  {...props}
/>)
TableCell.displayName = "TableCell"

const TableCaption = (
  {
    ref,
    className,
    ...props
  }: React.HTMLAttributes<HTMLTableCaptionElement> & {
    ref: React.RefObject<HTMLTableCaptionElement>;
  }
) => (<caption
  ref={ref}
  className={cn("mt-4 text-sm text-muted-foreground", className)}
  {...props}
/>)
TableCaption.displayName = "TableCaption"

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
