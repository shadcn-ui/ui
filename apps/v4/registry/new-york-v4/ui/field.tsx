import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Separator } from "@/registry/new-york-v4/ui/separator"

const fieldGroupVariants = cva("group/field-group flex flex-col gap-7", {
  variants: {
    variant: {
      default: "*:data-[slot=field-group]:gap-4",
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
        "group [&:not([class*='items-']):items-start flex flex-col gap-3",
        "[&>[data-slot=input],[data-slot=select-trigger],[data-slot=textarea],[data-slot=toggle-group]]:w-full",
        "*:data-[slot=label]:w-fit",
        "*:data-[slot=field-description]:-mt-1",
        "has-data-[slot=slider]:gap-4 has-data-[slot=slider]:*:data-[slot=field-description]:last:mt-0",
        "has-[>*[data-slot=radio-group-item]]:flex-row has-[>*[data-slot=radio-group-item]]:gap-2 [&:not([class*='items-']):has(>*[data-slot=radio-group-item])]:items-center",
        "has-[>*[data-slot=checkbox]]:flex-row has-[>*[data-slot=checkbox]]:gap-2 [&:not([class*='items-']):has(>*[data-slot=checkbox])]:items-center",
        "has-[>*[data-slot=switch]]:flex-row has-[>*[data-slot=switch]]:gap-2.5 [&:not([class*='items-']):has(>*[data-slot=switch])]:items-center",
        "data-[invalid=true]:*:data-[slot=label]:text-destructive data-[invalid=true]:*:data-[slot=field-description]:text-destructive data-[invalid=true]:*:data-[slot=popover-trigger]:border-destructive data-[invalid=true]:*:data-[slot=popover-trigger]:ring-destructive/20 dark:data-[invalid=true]:*:data-[slot=popover-trigger]:ring-destructive/40",
        "*:data-[slot=switch]:last:ml-auto",
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
        "text-muted-foreground text-sm",
        "[[data-slot=label]+&]:-mt-2 [[data-slot=label]+&]:mb-1",
        "has-[+[data-slot=slider]]:-mt-2",
        "*:[a]:hover:text-primary *:[a]:underline *:[a]:underline-offset-4",
        className
      )}
      {...props}
    />
  )
}

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

export {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLegend,
  FieldSeparator,
  FieldSet,
}
