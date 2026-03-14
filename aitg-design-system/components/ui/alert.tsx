import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-[var(--radius-lg)] border border-[rgb(var(--border)/0.1)] border-l-2 p-4 text-sm has-[>svg]:grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] has-[>svg]:gap-x-3 [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg+div]:pl-7",
  {
    variants: {
      variant: {
        default:
          "border-l-[rgb(var(--border)/0.3)] bg-[rgb(var(--foreground)/0.03)]",
        info:
          "border-l-[rgb(var(--primary))] bg-[rgb(var(--primary)/0.05)] [&>svg]:text-[rgb(var(--primary))]",
        success:
          "border-l-[rgb(var(--success))] bg-[rgb(var(--success)/0.05)] [&>svg]:text-[rgb(var(--success))]",
        warning:
          "border-l-[rgb(var(--warning))] bg-[rgb(var(--warning)/0.05)] [&>svg]:text-[rgb(var(--warning))]",
        destructive:
          "border-l-[rgb(var(--destructive))] bg-[rgb(var(--destructive)/0.05)] [&>svg]:text-[rgb(var(--destructive))]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  )
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "col-start-2 font-medium leading-none tracking-tight mb-1",
        className
      )}
      {...props}
    />
  )
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "col-start-2 text-sm text-[rgb(var(--foreground-muted))] leading-relaxed [&_p]:leading-relaxed",
        className
      )}
      {...props}
    />
  )
}

export { Alert, AlertTitle, AlertDescription }
