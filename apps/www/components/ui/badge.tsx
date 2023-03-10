import * as React from "react"
import { VariantProps, cva } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center border border-transparent rounded-full px-2.5 py-0.5 text-xs font-semibold text-slate-900 transition-colors",
  {
    variants: {
      variant: {
        default:
          "bg-slate-900 text-slate-100 dark:bg-slate-200 dark:text-slate-800",
        subtle:
          "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100",
        desctructive: "bg-red-500 text-white",
        outline:
          "bg-transparent border-slate-200 text-slate-900 dark:text-slate-100",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
