import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Label } from "@/registry/new-york-v4/ui/label"
import { Separator } from "@/registry/new-york-v4/ui/separator"

function FieldSet({ className, ...props }: React.ComponentProps<"fieldset">) {
  return (
    <fieldset
      data-slot="field-set"
      className={cn("flex flex-col gap-6", className)}
      {...props}
    />
  )
}

function FieldLegend({ className, ...props }: React.ComponentProps<"legend">) {
  return (
    <legend
      data-slot="field-legend"
      className={cn(
        "mb-6 text-base font-medium has-[+[data-slot=field-description]]:mb-1",
        className
      )}
      {...props}
    />
  )
}

const fieldGroupVariants = cva("group/field-group flex flex-col gap-7", {
  variants: {
    variant: {
      default: "[&>[data-slot=field-group]]:gap-4",
      outline: "border border-input rounded-lg p-6 gap-6 bg-background",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

function FieldGroup({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof fieldGroupVariants>) {
  return (
    <div
      data-slot="field-group"
      data-variant={variant}
      className={cn(fieldGroupVariants({ variant, className }))}
      {...props}
    />
  )
}

function Field({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field"
      className={cn(
        "group/field flex w-full flex-col items-start gap-3",

        // Label + input alignment
        "has-[>[data-slot=checkbox]]:flex-row",
        "has-[>[data-slot=radio-group-item]]:flex-row",
        "has-[>[data-slot=switch]]:flex-row",

        "has-[label+[data-slot=checkbox]]:[&>:first-child]:flex-1",
        "has-[label+[data-slot=radio-group-item]]:[&>:first-child]:flex-1",
        "has-[label+[data-slot=switch]]:[&>:first-child]:flex-1",

        "has-[[data-slot=field-title]+[data-slot=checkbox]]:[&>:first-child]:flex-1",
        "has-[[data-slot=field-title]+[data-slot=radio-group-item]]:[&>:first-child]:flex-1",
        "has-[[data-slot=field-title]+[data-slot=switch]]:[&>:first-child]:flex-1",

        // Child inputs (direct children only)
        "[&>[data-slot=label]]:w-fit",
        "[&>[data-slot=toggle-group]]:w-full",
        "[&>[data-slot=input]]:w-full",
        "[&>[data-slot=select-trigger]]:w-full",
        "[&>[data-slot=slider]]:w-full",
        "[&>[data-slot=radio-group]]:w-full",

        // Invalid state handling
        "data-[invalid=true]:[&>[data-slot=field-label]]:text-destructive",
        "data-[invalid=true]:[&>[data-slot=field-description]]:text-destructive",
        "data-[invalid=true]:[&>[data-slot=popover-trigger]]:border-destructive",
        "data-[invalid=true]:[&>[data-slot=popover-trigger]]:ring-destructive/20",
        "dark:data-[invalid=true]:[&>[data-slot=popover-trigger]]:ring-destructive/40",

        className
      )}
      {...props}
    />
  )
}

function FieldContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-content"
      className={cn(
        "flex flex-1 flex-col gap-2 [[data-slot=field-label]_&]:gap-1.5",
        className
      )}
      {...props}
    />
  )
}

function FieldLabel({
  className,
  ...props
}: React.ComponentProps<typeof Label>) {
  return (
    <Label
      data-slot="field-label"
      className={cn(
        "group/field-label flex items-start gap-2",

        // Direct Children.
        "*:data-[slot=field]:p-4",
        "*:[img]:rounded-t-md",

        // Child field variations.
        "has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col has-[>[data-slot=field]]:rounded-md has-[>[data-slot=field]]:border",

        // Check state.
        "has-data-[state=checked]:bg-primary/5 has-data-[state=checked]:border-ring dark:has-data-[state=checked]:bg-primary/10",
        className
      )}
      {...props}
    />
  )
}

function FieldTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-title"
      className={cn(
        "group-has-aria-invalid/field:text-destructive flex items-center gap-2 text-sm leading-none font-medium select-none group-has-data-[disabled]/field:opacity-60",
        className
      )}
      {...props}
    />
  )
}

function FieldDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="field-description"
      className={cn(
        "text-muted-foreground text-sm font-normal has-[+[data-slot=slider]]:-mt-2 [[data-slot=label]+&]:-mt-0.5",
        "[&>a:hover]:text-primary [&>a]:underline [&>a]:underline-offset-4",
        className
      )}
      {...props}
    />
  )
}

function FieldSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  children?: React.ReactNode
}) {
  return (
    <div
      data-slot="field-separator"
      data-content={!!children}
      className={cn(
        "relative -my-4 h-5 text-sm group-data-[variant=outline]/field-group:-mb-2 data-[content=true]:-my-2",
        className
      )}
      {...props}
    >
      <Separator className="absolute inset-0 top-1/2" />
      {children && (
        <span className="bg-background text-muted-foreground relative mx-auto block w-fit px-2">
          {children}
        </span>
      )}
    </div>
  )
}

function FieldError({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      role="alert"
      data-slot="field-error"
      className={cn("text-destructive text-sm font-normal", className)}
      {...props}
    />
  )
}

export {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldContent,
  FieldTitle,
}
