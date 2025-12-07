import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/registry/bases/radix/lib/utils"

const buttonVariants = cva(
  "gap-2 rounded-lg border border-transparent bg-clip-padding text-sm font-medium inset-shadow-2xs inset-shadow-white/25 disabled:grayscale [&_svg:not([class*='size-'])]:size-4 inline-flex items-center justify-center whitespace-nowrap transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none shrink-0 [&_svg]:shrink-0 outline-none group/button",
  {
    variants: {
      variant: {
        default: "text-primary-foreground bg-linear-to-b from-[color-mix(in_oklch,var(--primary)_85%,var(--background))] to-(--primary) hover:bg-linear-to-t",
        outline: "border-border hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 bg-transparent inset-shadow-none",
        secondary: "border-border bg-linear-to-b from-[color-mix(in_oklch,var(--accent)_25%,var(--background))] to-(--accent) shadow-none hover:bg-linear-to-t",
        ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 aria-expanded:bg-accent aria-expanded:text-accent-foreground inset-shadow-none",
        destructive: "bg-linear-to-b from-[color-mix(in_oklch,var(--destructive)_85%,var(--background))] to-(--destructive) text-white hover:bg-linear-to-t",
        link: "text-primary underline-offset-4 inset-shadow-none hover:underline",
      },
      size: {
        default: "h-8 px-3 has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5",
        xs: "h-6 gap-1 rounded-md px-2 text-xs has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 px-3 has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5",
        lg: "h-9 px-3 has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5",
        icon: "size-9",
        "icon-xs": "size-6 rounded-md [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
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
