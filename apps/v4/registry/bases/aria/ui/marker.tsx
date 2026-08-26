import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/registry/bases/aria/lib/utils"

const markerVariants = cva(
  "cn-marker group/marker relative flex w-full items-center",
  {
    variants: {
      variant: {
        default: "cn-marker-variant-default",
        separator: "cn-marker-variant-separator",
        border: "cn-marker-variant-border",
      },
    },
  }
)

function Marker({
  className,
  variant = "default",
  render,
  children,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof markerVariants> & {
    render?: (props: React.HTMLAttributes<HTMLElement>) => React.ReactNode
  }) {
  if (render) {
    const renderProps = {
      ...props,
      "data-slot": "marker",
      "data-variant": variant,
      className: cn(markerVariants({ variant, className })),
      children,
    }

    return render(renderProps)
  }

  return (
    <div
      {...props}
      data-slot="marker"
      data-variant={variant}
      className={cn(markerVariants({ variant, className }))}
    >
      {children}
    </div>
  )
}

function MarkerIcon({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="marker-icon"
      aria-hidden="true"
      className={cn("cn-marker-icon shrink-0", className)}
      {...props}
    />
  )
}

function MarkerContent({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="marker-content"
      className={cn("cn-marker-content min-w-0 wrap-break-word", className)}
      {...props}
    />
  )
}

export { Marker, MarkerIcon, MarkerContent, markerVariants }
