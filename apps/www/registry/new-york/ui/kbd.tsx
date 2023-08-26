import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const kbdVariants = cva(
  "h-4 rounded border-x-[1px] border-b-[3px] border-t-[1px] px-1 font-mono text-xs font-semibold",
  {
    variants: {
      variant: {
        default: "bg-muted",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface KbdProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof kbdVariants> {}

function Kbd({ className, variant, ...props }: KbdProps) {
  return <kbd className={cn(kbdVariants({ variant }), className)} {...props} />
}

export { Kbd, kbdVariants }
