import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "border border-transparent text-sm [&_svg:not([class*='size-'])]:size-3.5 inline-flex items-center justify-center whitespace-nowrap transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "text-primary-foreground bg-primary hover:bg-primary/90",
        outline: "border-border bg-background hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        destructive: "bg-destructive hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60 text-white",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-7 gap-1.5 px-2 has-[>svg:first-child]:pl-1.5 has-[>svg:last-child]:pr-1.5",
        sm: "h-6 gap-1 px-2 has-[>svg:first-child]:pl-1.5 has-[>svg:last-child]:pr-1.5 [&_svg:not([class*='size-'])]:size-3",
        lg: "h-8 gap-1.5 px-2.5 has-[>svg:first-child]:pl-2 has-[>svg:last-child]:pr-2 [&_svg:not([class*='size-'])]:size-4",
        icon: "size-7",
        "icon-sm": "size-6",
        "icon-lg": "size-8",
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
