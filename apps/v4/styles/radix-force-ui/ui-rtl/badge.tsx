import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-4xl border border-transparent px-2 py-0.5 text-xs font-medium tracking-wide whitespace-nowrap uppercase transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pe-1.5 has-data-[icon=inline-start]:ps-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3.5!",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground [a]:hover:bg-primary-hover",
        secondary:
          "bg-secondary text-secondary-foreground [a]:hover:bg-primary-subtle",
        destructive: "bg-error-subtle text-error",
        warning: "bg-warning-subtle text-warning",
        success: "bg-success-subtle text-success", // [FORCE-UI]
        info: "bg-info-subtle text-info", // [FORCE-UI]
        "success-solid": "bg-success-solid text-on-success", // [FORCE-UI]
        "warning-solid":
          "bg-warning-solid text-on-warning dark:text-on-warning", // [FORCE-UI]
        "info-solid": "bg-info-solid text-on-info", // [FORCE-UI]
        "error-solid": "bg-destructive text-on-error", // [FORCE-UI]
        outline: "border-border text-foreground [a]:hover:bg-primary-subtle",
        ghost: "hover:bg-primary-subtle hover:text-foreground",
        link: "text-link underline-offset-4 hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
