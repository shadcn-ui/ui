import { cn } from "@/lib/utils"
import { Separator } from "@/registry/new-york-v4/ui/separator"

function FieldGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-group"
      className={cn(
        "flex flex-col gap-8 **:data-[slot=field-group]:gap-4",
        className
      )}
      {...props}
    />
  )
}

function Field({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field"
      className={cn(
        "[&:not([class*='items-']):items-start flex flex-col gap-3 [&>[data-slot=input],[data-slot=select-trigger],[data-slot=textarea],[data-slot=toggle-group]]:w-full",
        "*:data-[slot=field-description]:-mt-1",
        "has-data-[slot=slider]:gap-4 has-data-[slot=slider]:*:data-[slot=field-description]:last:mt-0",
        "has-[>*[data-slot=radio-group-item]]:flex-row has-[>*[data-slot=radio-group-item]]:gap-2 [&:not([class*='items-']):has(>*[data-slot=radio-group-item])]:items-center",
        "has-[>*[data-slot=checkbox]]:flex-row has-[>*[data-slot=checkbox]]:gap-2 [&:not([class*='items-']):has(>*[data-slot=checkbox])]:items-center",
        "has-[>*[data-slot=switch]]:flex-row has-[>*[data-slot=switch]]:gap-2.5 [&:not([class*='items-']):has(>*[data-slot=switch])]:items-center",
        "data-[invalid=true]:*:data-[slot=label]:text-destructive data-[invalid=true]:*:data-[slot=field-description]:text-destructive data-[invalid=true]:*:data-[slot=popover-trigger]:border-destructive data-[invalid=true]:*:data-[slot=popover-trigger]:ring-destructive/20 dark:data-[invalid=true]:*:data-[slot=popover-trigger]:ring-destructive/40",
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
        "*:[a]:hover:text-primary text-balance *:[a]:underline *:[a]:underline-offset-4",
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
  if (!children) {
    return <Separator className={cn("-my-4", className)} {...props} />
  }

  return (
    <div className={cn("relative -my-2 text-sm", className)} {...props}>
      <Separator className="absolute inset-0 top-1/2" />
      <div className="relative flex justify-center">
        <span className="bg-background text-muted-foreground px-2">
          {children}
        </span>
      </div>
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
