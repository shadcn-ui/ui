import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "rounded-lg border border-transparent text-sm inset-shadow-2xs inset-shadow-white/25 [&_svg:not([class*='size-'])]:size-4 inline-flex items-center justify-center whitespace-nowrap transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "text-primary-foreground bg-linear-to-b from-[color-mix(in_oklch,var(--primary)_85%,var(--background))] to-(--primary) hover:bg-linear-to-t",
        outline: "border-border bg-linear-to-b from-[color-mix(in_oklch,var(--accent)_25%,var(--background))] to-(--accent) shadow-none hover:bg-linear-to-t",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        destructive: "bg-linear-to-b from-[color-mix(in_oklch,var(--destructive)_85%,var(--background))] to-(--destructive) text-white hover:bg-linear-to-t",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-8 gap-1.5 px-3 has-[>svg]:px-2.5",
        sm: "h-7 gap-1 px-2.5 has-[>svg]:px-2.5",
        lg: "h-9 gap-2 px-4 has-[>svg]:px-3",
        icon: "size-8",
        "icon-sm": "size-7",
        "icon-lg": "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
