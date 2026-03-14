import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap select-none transition-colors duration-[100ms] [&>svg]:pointer-events-none [&>svg]:size-3",
  {
    variants: {
      variant: {
        default:
          "border-[rgb(var(--border)/0.18)] bg-[rgb(var(--foreground)/0.06)] text-[rgb(var(--foreground-muted))]",
        primary:
          "border-[rgb(var(--primary)/0.25)] bg-[rgb(var(--primary)/0.08)] text-[rgb(var(--primary))]",
        success:
          "border-[rgb(var(--success)/0.25)] bg-[rgb(var(--success)/0.08)] text-[rgb(var(--success))]",
        warning:
          "border-[rgb(var(--warning)/0.25)] bg-[rgb(var(--warning)/0.08)] text-[rgb(var(--warning))]",
        destructive:
          "border-[rgb(var(--destructive)/0.25)] bg-[rgb(var(--destructive)/0.08)] text-[rgb(var(--destructive))]",
        secondary:
          "border-[rgb(var(--border)/0.18)] bg-[rgb(var(--foreground)/0.06)] text-[rgb(var(--foreground-muted))]",
        outline:
          "border-[rgb(var(--border)/0.2)] bg-transparent text-[rgb(var(--foreground-muted))]",
        ghost: "[a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        link: "text-[rgb(var(--primary))] underline-offset-4 [a&]:hover:underline",
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
