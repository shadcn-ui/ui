import * as React from "react"
import { VariantProps, cva } from "class-variance-authority"

import { cn } from "@/lib/utils"

const tableVariants = cva(
  "bg-secondary [&>tbody>*:not(:first-child)]:border-t-[1px]",
  {
    variants: {
      size: {
        sm: "[&_th]:p-3",
        md: "[&_td]:p-3 [&_th]:p-5",
        lg: "[&_td]:p-5 [&_th]:p-7",
        xl: "[&_td]:p-7 [&_th]:p-9",
      },
      striped: {
        true: "[&>tbody>*:nth-child(odd)]:bg-ring",
        false: "",
      },
      fullWidth: {
        false: "",
        true: "w-full",
      },
      hover: {
        true: "[&>tbody>*:hover]:bg-primary [&>tbody>*:hover]:text-primary-foreground",
        false: "",
      },
      shadow: {
        none: "",
        sm: "shadow-sm",
        md: "shadow-md",
        lg: "shadow-lg",
        xl: "shadow-xl",
        "2xl": "shadow-2xl",
      },
      rounded: {
        true: "overflow-hidden rounded-lg",
        false: "",
      },
    },
    defaultVariants: {
      size: "md",
      striped: false,
      fullWidth: false,
      hover: false,
      shadow: "none",
      rounded: true,
    },
  }
)

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement> & VariantProps<typeof tableVariants>
>(
  (
    { className, size, striped, fullWidth, hover, shadow, rounded, ...props },
    ref
  ) => (
    <table
      ref={ref}
      className={cn(
        tableVariants({ size, striped, fullWidth, hover, shadow, rounded }),
        className
      )}
      {...props}
    />
  )
)
Table.displayName = "Table"

const Thead = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn("bg-primary font-bold text-primary-foreground", className)}
    {...props}
  />
))
Thead.displayName = "Thead"

const Tbody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody ref={ref} className={cn("", className)} {...props} />
))
Tbody.displayName = "Tbody"

const Tfoot = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn("bg-primary font-bold text-primary-foreground", className)}
    {...props}
  />
))
Tfoot.displayName = "Tfoot"

const Th = React.forwardRef<
  HTMLTableCellElement,
  React.HTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th ref={ref} className={cn("font-bold", className)} {...props} />
))
Th.displayName = "Th"

const Tr = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr ref={ref} className={cn("", className)} {...props} />
))
Tr.displayName = "Tr"

const Td = React.forwardRef<
  HTMLTableCellElement,
  React.HTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td ref={ref} className={cn("", className)} {...props} />
))
Td.displayName = "Td"

export { Table, Thead, Tbody, Tfoot, Tr, Td, Th }
