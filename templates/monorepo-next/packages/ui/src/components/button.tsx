import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@workspace/ui/lib/utils"

// Add color variants for each button variant
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
        subtle: "",
        soft: "",
      },
      color: {
        primary: "",
        secondary: "",
        warning: "",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    compoundVariants: [
      // Subtle
      {
        variant: "subtle",
        color: "primary",
        className: "bg-blue-100 text-blue-700 hover:bg-blue-200",
      },
      {
        variant: "subtle",
        color: "secondary",
        className: "bg-gray-100 text-gray-700 hover:bg-gray-200",
      },
      {
        variant: "subtle",
        color: "warning",
        className: "bg-yellow-100 text-yellow-700 hover:bg-yellow-200",
      },
      // Soft
      {
        variant: "soft",
        color: "primary",
        className: "bg-blue-200 text-blue-800 hover:bg-blue-300",
      },
      {
        variant: "soft",
        color: "secondary",
        className: "bg-gray-200 text-gray-800 hover:bg-gray-300",
      },
      {
        variant: "soft",
        color: "warning",
        className: "bg-yellow-200 text-yellow-800 hover:bg-yellow-300",
      },
      // Outline
      {
        variant: "outline",
        color: "primary",
        className:
          "border border-blue-500 text-blue-500 bg-transparent hover:bg-blue-50",
      },
      {
        variant: "outline",
        color: "secondary",
        className:
          "border border-gray-500 text-gray-500 bg-transparent hover:bg-gray-50",
      },
      {
        variant: "outline",
        color: "warning",
        className:
          "border border-yellow-500 text-yellow-500 bg-transparent hover:bg-yellow-50",
      },
    ],
    defaultVariants: {
      variant: "default",
      color: "primary",
      size: "default",
    },
  }
)

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }

function Button({
  className,
  variant,
  color,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, color, size }), className)}
      {...props}
    />
  )
}

export { Button, buttonVariants }
