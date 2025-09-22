import { useMemo } from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Label } from "@/registry/new-york-v4/ui/label"
import { Separator } from "@/registry/new-york-v4/ui/separator"

function FieldSet({ className, ...props }: React.ComponentProps<"fieldset">) {
  return (
    <fieldset
      data-slot="field-set"
      data-field="field-set"
      className={cn(
        "flex flex-col gap-6",
        "[&>[data-slot=radio-group]]:-mt-2",
        className
      )}
      {...props}
    />
  )
}

function FieldLegend({ className, ...props }: React.ComponentProps<"legend">) {
  return (
    <legend
      data-slot="field-legend"
      data-field="field-legend"
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
      data-field="field-group"
      data-variant={variant}
      className={cn(fieldGroupVariants({ variant, className }))}
      {...props}
    />
  )
}

function Field({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      role="group"
      data-slot="field"
      data-field="field"
      className={cn(
        "group/field flex w-full flex-col items-start gap-3",

        // Label + input alignment.
        "has-[>[data-slot=field-content]]:!items-start",
        "has-[>[role=checkbox]]:flex-row has-[>[role=checkbox]]:items-center",
        "has-[>[role=radio]]:flex-row has-[>[role=radio]]:items-center",
        "has-[>[role=switch]]:flex-row has-[>[role=switch]]:items-center",
        "has-[[data-field=label]+[role=checkbox]]:[&>:first-child]:flex-1",
        "has-[[data-field=label]+[role=radio]]:[&>:first-child]:flex-1",
        "has-[[data-field=label]+[role=switch]]:[&>:first-child]:flex-1",

        // Child inputs (direct children only).
        "[&>[data-slot=input]]:w-full",
        "[&>[data-slot=slider]]:w-full",
        "[&>[data-slot=popover-trigger]]:w-full",
        "[&>[role=combobox]]:w-full",
        "[&>[role=radiogroup]]:w-full",
        "[&>[role=group]]:w-full",
        "[&>[role=toolbar]]:w-full",

        // Invalid state handling
        "data-[invalid=true]:[&>label]:text-destructive",
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
      data-field="field-content"
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
      data-field="label"
      className={cn(
        "group/field-label flex w-fit items-start gap-2 *:data-[slot=field]:p-4",

        // Child field variations.
        "has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col has-[>[data-slot=field]]:rounded-md has-[>[data-slot=field]]:border",
        "has-[>[data-slot=badge]]:w-full has-[>[data-slot=badge]]:items-center",

        // Check state.
        "has-data-[state=checked]:bg-primary/5 has-data-[state=checked]:border-ring dark:has-data-[state=checked]:bg-primary/10",

        // Invalid state.
        "group-data-[invalid=true]/field:text-destructive",
        "group-data-[disabled=true]/field:opacity-50",
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
      data-field="label"
      className={cn(
        "group-data-[invalid=true]/field:text-destructive flex w-fit items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]/field:opacity-50",
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
      data-field="field-description"
      className={cn(
        "text-muted-foreground text-sm font-normal",
        "[&>a:hover]:text-primary [&>a]:underline [&>a]:underline-offset-4",
        "has-[+[data-slot=slider]]:-mt-1",
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
      data-field="field-separator"
      data-content={!!children}
      className={cn(
        "relative -my-2 h-5 text-sm group-data-[variant=outline]/field-group:-mb-2",
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

function FieldError({
  className,
  children,
  errors,
  ...props
}: React.ComponentProps<"div"> & {
  errors?: Array<{ message?: string } | undefined>
}) {
  const content = useMemo(() => {
    if (children) {
      return children
    }

    if (!errors) {
      return null
    }

    if (errors?.length === 1 && errors[0]?.message) {
      return errors[0].message
    }

    return (
      <ul className="ml-4 flex list-disc flex-col gap-1">
        {errors.map(
          (error, index) =>
            error?.message && <li key={index}>{error.message}</li>
        )}
      </ul>
    )
  }, [children, errors])

  if (!content) {
    return null
  }

  return (
    <div
      role="alert"
      data-slot="field-error"
      data-field="field-error"
      className={cn("text-destructive text-sm font-normal", className)}
      {...props}
    >
      {content}
    </div>
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
