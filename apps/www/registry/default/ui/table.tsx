import * as React from "react"

import { cn } from "@/lib/utils"

const Table: React.FC<React.ComponentProps<"table">> = ({
  className,
  ...props
}) => (
  <div className="relative w-full overflow-auto">
    <table
      className={cn("w-full caption-bottom text-sm", className)}
      {...props}
    />
  </div>
)
Table.displayName = "Table"

const TableHeader: React.FC<React.ComponentProps<"thead">> = ({
  className,
  ...props
}) => <thead className={cn("[&_tr]:border-b", className)} {...props} />
TableHeader.displayName = "TableHeader"

const TableBody: React.FC<React.ComponentProps<"tbody">> = ({
  className,
  ...props
}) => (
  <tbody className={cn("[&_tr:last-child]:border-0", className)} {...props} />
)
TableBody.displayName = "TableBody"

const TableFooter: React.FC<React.ComponentProps<"tfoot">> = ({
  className,
  ...props
}) => (
  <tfoot
    className={cn(
      "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
      className
    )}
    {...props}
  />
)
TableFooter.displayName = "TableFooter"

const TableRow: React.FC<React.ComponentProps<"tr">> = ({
  className,
  ...props
}) => (
  <tr
    className={cn(
      "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
      className
    )}
    {...props}
  />
)
TableRow.displayName = "TableRow"

const TableHead: React.FC<React.ComponentProps<"th">> = ({
  className,
  ...props
}) => (
  <th
    className={cn(
      "h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
      className
    )}
    {...props}
  />
)
TableHead.displayName = "TableHead"

const TableCell: React.FC<React.ComponentProps<"td">> = ({
  className,
  ...props
}) => (
  <td
    className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)}
    {...props}
  />
)
TableCell.displayName = "TableCell"

const TableCaption: React.FC<React.ComponentProps<"caption">> = ({
  className,
  ...props
}) => (
  <caption
    className={cn("mt-4 text-sm text-muted-foreground", className)}
    {...props}
  />
)
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
