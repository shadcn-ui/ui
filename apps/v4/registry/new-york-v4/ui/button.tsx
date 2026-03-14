import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-1.5 whitespace-nowrap select-none cursor-pointer font-medium tracking-tight transition-all duration-[150ms] ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--ring)/0.5)] focus-visible:ring-offset-1 focus-visible:ring-offset-[rgb(var(--background))] disabled:pointer-events-none disabled:opacity-40 active:scale-[0.98] aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-[rgb(var(--primary))] text-white shadow-sm hover:bg-[rgb(var(--primary-hover))] active:bg-[rgb(var(--primary-active))]",
        destructive:
          "bg-[rgb(var(--destructive))] text-white shadow-sm hover:bg-[rgb(var(--destructive)/0.88)]",
        outline:
          "bg-transparent border border-[rgb(var(--border)/0.2)] text-[rgb(var(--foreground))] hover:bg-[rgb(var(--foreground)/0.04)]",
        secondary:
          "bg-transparent border border-[rgb(var(--border)/0.2)] text-[rgb(var(--foreground))] hover:bg-[rgb(var(--foreground)/0.05)] hover:border-[rgb(var(--border)/0.32)]",
        ghost:
          "bg-transparent text-[rgb(var(--foreground-muted))] hover:bg-[rgb(var(--foreground)/0.06)] hover:text-[rgb(var(--foreground))]",
        link: "bg-transparent p-0 h-auto text-[rgb(var(--primary))] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 text-sm rounded-[var(--radius-md)] has-[>svg]:px-3",
        xs: "h-7 gap-1 px-2.5 text-xs rounded-[var(--radius-sm)] has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1.5 px-3 text-xs rounded-[var(--radius-md)] has-[>svg]:px-2.5",
        lg: "h-11 px-5 text-sm rounded-[var(--radius-lg)] has-[>svg]:px-4",
        xl: "h-12 px-6 text-base rounded-[var(--radius-lg)]",
        icon: "h-10 w-10 rounded-[var(--radius-md)]",
        "icon-xs": "h-7 w-7 rounded-[var(--radius-sm)] [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "h-8 w-8 rounded-[var(--radius-md)]",
        "icon-lg": "h-10 w-10 rounded-[var(--radius-md)]",
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
