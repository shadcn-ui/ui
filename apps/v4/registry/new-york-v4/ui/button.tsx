import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import { LoaderCircleIcon } from "lucide-react"
import { Slot } from "radix-ui"

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-md font-sans font-medium whitespace-nowrap transition-all outline-none focus-visible:ring-[3px] focus-visible:ring-focus active:opacity-60 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-focus-destructive data-[loading=true]:pointer-events-none data-[loading=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary-hover",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive focus-visible:ring-focus-destructive",
        outline:
          "border border-primary bg-background text-primary shadow-xs hover:bg-accent",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary-hover",
        ghost:
          "bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground",
        link: "bg-transparent text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 text-sm",
        xs: "h-6 gap-1 rounded-md px-2 py-1 text-xs [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 rounded-md px-3 py-2 text-xs",
        lg: "h-10 rounded-md px-6 py-2 text-sm",
        icon: "size-9",
        "icon-xs":
          "size-6 rounded-md text-xs [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8",
        "icon-lg": "size-10 text-sm",
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
  loading = false,
  disabled = false,
  children,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    loading?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"
  const buttonChildren = loading ? (
    asChild &&
    React.isValidElement<{ children?: React.ReactNode }>(children) ? (
      React.cloneElement(
        children,
        {},
        <>
          <LoaderCircleIcon aria-hidden="true" className="animate-spin" />
          {children.props.children}
        </>
      )
    ) : (
      <>
        <LoaderCircleIcon aria-hidden="true" className="animate-spin" />
        {children}
      </>
    )
  ) : (
    children
  )

  return (
    <Comp
      {...props}
      disabled={disabled || loading}
      aria-busy={loading ? true : props["aria-busy"]}
      aria-disabled={loading ? true : props["aria-disabled"]}
      data-slot="button"
      data-variant={variant}
      data-size={size}
      data-loading={loading ? "true" : undefined}
      className={cn(buttonVariants({ variant, size, className }))}
    >
      {buttonChildren}
    </Comp>
  )
}

export { Button, buttonVariants }
