import React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonGroupVariants = cva(
  "flex [&>*:not(:last-child):not(:first-child)]:rounded-none",
  {
    variants: {
      orientation: {
        horizontal:
          "flex-row [&>*:first-child]:rounded-e-none [&>*:last-child]:rounded-s-none [&>*]:mr-[-1px]",
        vertical:
          "flex-col [&>*:first-child]:rounded-b-none [&>*:last-child]:rounded-t-none [&>*]:mb-[-1px]",
      },
      variants: {
        line: "[&.flex-col>*:not(:first-child)]:border-t [&.flex-row>*:not(:first-child)]:border-s",
      },
    },
    defaultVariants: {
      orientation: "horizontal",
    },
  }
)

const ButtonGroupItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center rounded border bg-accent px-4", className)}
    {...props}
  />
))
ButtonGroupItem.displayName = "ButtonGroupItem"

export interface ButtonGroupProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof buttonGroupVariants> {}

const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({ className, orientation, variants, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        buttonGroupVariants({
          orientation,
          variants,
          className,
        })
      )}
      {...props}
    />
  )
)
ButtonGroup.displayName = "ButtonGroup"

export { ButtonGroup, ButtonGroupItem }
