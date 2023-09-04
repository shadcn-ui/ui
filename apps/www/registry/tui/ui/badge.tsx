import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center font-medium",
  {
    variants: {
      variant: {
        default:
          "gap-x-1.5 rounded-md bg-primary text-primary-foreground ring-1 ring-inset",
        flat:
          "rounded-md bg-primary text-primary-foreground",
        borderPill: "rounded-full bg-primary text-primary-foreground ring-1 ring-inset",
        flatPill: "rounded-full bg-primary text-primary-foreground",
        outline: "rounded-md ring-1 ring-inset ring-gray-200",
        dot: "gap-x-1.5 rounded-md ring-1 ring-inset ring-gray-200"
      },
      fontSize: {
        xs: 'text-xs',
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
        xl: 'text-xl',
      },
      size: {
        default: "px-2 py-1",
        sm: "px-1.5 py-0.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      fontSize: "xs",
    },
  }
)


export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof badgeVariants> {
  prefixIcon?: any;
  suffixIcon?: any;
}

function Badge({ children, className, variant, fontSize, size, prefixIcon, suffixIcon, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, fontSize, size }), className)} {...props}>
      {prefixIcon && prefixIcon()}
      {children}
      {suffixIcon ? suffixIcon() : null}
    </div>
  )
}

export { Badge, badgeVariants }
