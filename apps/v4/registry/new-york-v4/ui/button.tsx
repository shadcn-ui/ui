import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "",
        destructive: "",
        outline: "",
        secondary: "",
        ghost: "",
        link: "",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
      color: {
        primary: "",
        green: "",
        blue: "",
        red: "",
        // Add more colors as needed
      },
    },
    compoundVariants: [
      {
        variant: "default",
        color: "primary",
        className: "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
      },
      {
        variant: "default",
        color: "green",
        className: "bg-green-600 text-white shadow-xs hover:bg-green-700",
      },
      {
        variant: "default",
        color: "blue",
        className: "bg-blue-600 text-white shadow-xs hover:bg-blue-700",
      },
      {
        variant: "default",
        color: "red",
        className: "bg-red-600 text-white shadow-xs hover:bg-red-700",
      },
      {
        variant: "secondary",
        color: "primary",
        className: "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
      },
      {
        variant: "secondary",
        color: "green",
        className: "bg-green-100 text-green-800 shadow-xs hover:bg-green-200",
      },
      {
        variant: "secondary",
        color: "blue",
        className: "bg-blue-100 text-blue-800 shadow-xs hover:bg-blue-200",
      },
      {
        variant: "secondary",
        color: "red",
        className: "bg-red-100 text-red-800 shadow-xs hover:bg-red-200",
      },
      {
        variant: "destructive",
        color: "primary",
        className: "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
      },
      {
        variant: "outline",
        color: "primary",
        className: "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
      },
      {
        variant: "ghost",
        color: "primary",
        className: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
      },
      {
        variant: "link",
        color: "primary",
        className: "text-primary underline-offset-4 hover:underline",
      },
      // Add more compoundVariants as needed for other variant+color combos
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
      color: "primary",
    },
  }
)

function Button({
  className,
  variant,
  size,
  color = "primary",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    color?: "primary" | "green" | "blue" | "red" // extend as needed
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, color, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
