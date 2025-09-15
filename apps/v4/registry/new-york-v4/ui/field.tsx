import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Label } from "@/registry/new-york-v4/ui/label"
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

// const fieldVariants = cva(
//   [
//     "group flex w-full gap-3",
//     "has-[>*[data-slot=checkbox],>*[data-slot=radio-group-item],>*[data-slot=switch]]:flex-row",
//     // Direct children.
//     "*:data-[slot=label]:w-fit",
//     "*:data-[slot=toggle-group]:w-full",
//     "*:data-[slot=switch]:last:ml-auto",
//     "*:data-[slot=checkbox]:last:ml-auto",
//     "*:data-[slot=radio-group-item]:last:ml-auto",
//     "*:data-[slot=select-trigger]:w-full *:data-[slot=select-trigger]:last:ml-auto",
//     "*:data-[slot=radio-group]:w-full",
//     "*:data-[slot=slider]:w-full *:data-[slot=slider]:last:ml-auto",
//     "*:data-[slot=input]:last:ml-auto",
//     // Conditional classes based on children.
//     "has-data-[slot=slider]:gap-4 has-data-[slot=slider]:*:data-[slot=field-description]:last:mt-0",
//     // "has-[>*[data-slot=radio-group-item]]:gap-3 [&:not([class*='items-']):has(>*[data-slot=radio-group-item])]:items-center",
//     // "has-[>*[data-slot=checkbox]]:gap-3 [&:not([class*='items-']):has(>*[data-slot=checkbox])]:items-center",
//     // "has-[>*[data-slot=switch]]:gap-2.5 [&:not([class*='items-']):has(>*[data-slot=switch])]:items-center",
//     // Invalid state.
//     "data-[invalid=true]:*:data-[slot=label]:text-destructive data-[invalid=true]:*:data-[slot=field-description]:text-destructive data-[invalid=true]:*:data-[slot=popover-trigger]:border-destructive data-[invalid=true]:*:data-[slot=popover-trigger]:ring-destructive/20 dark:data-[invalid=true]:*:data-[slot=popover-trigger]:ring-destructive/40",
//   ],
//   {
//     variants: {
//       orientation: {
//         vertical: ["flex-col", "*:data-[slot=input]:w-full"],
//         horizontal: [
//           "grid grid-cols-[1fr_auto] items-center gap-3 grid-rows-1 *:row-span-2",
//           "*:data-[slot=input]:w-fit",
//           "*:data-[slot=select-trigger]:w-fit",
//           "*:data-[slot=slider]:w-32",
//           "*:data-[slot=field-description]:col-start-2 *:data-[slot=field-description]:row-start-2 *:data-[slot=field-description]:mb-0",
//           "has-[[data-slot=label]:nth-child(2),[data-slot=field-title]:nth-child(2)]:grid-cols-[auto_1fr] has-[[data-slot=label]:nth-child(2),[data-slot=field-title]:nth-child(2)]:*:row-span-1",
//           "has-data-[slot=field-description]:items-start has-data-[slot=field-description]:grid-rows-2",
//           "has-[label:first-child]:has-[*[data-slot=field-description]]:*:data-[slot=field-description]:col-start-1",
//           // "has-[label:first-child]:has-[*[data-slot=field-description]]:*:data-[slot=field-description]:col-start-1 has-[label:first-child]:has-[*[data-slot=field-description]]:*:last:row-span-2 has-[label:first-child]:has-[*[data-slot=field-description]]:*:last:self-start has-[label:first-child]:has-[*[data-slot=field-description]]:gap-x-4 has-[label:first-child]:has-[*[data-slot=field-description]]:*:first:row-span-1 ",
//         ],
//       },
//     },
//     defaultVariants: {
//       orientation: "vertical",
//     },
//   }
// )

function Field({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field"
      className={cn(
        "group/field flex w-full flex-col gap-3",
        "has-[>*[data-slot=checkbox],>*[data-slot=radio-group-item],>*[data-slot=switch]]:flex-row",
        "has-[label+[data-slot=checkbox],label+[data-slot=radio-group-item],label+[data-slot=switch]]:*:first:flex-1",
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
        "text-muted-foreground text-sm font-normal",
        "[[data-slot=label]+&]:-mt-0.5",
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

function FieldOption({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <Label
      data-slot="option"
      role="option"
      className={cn(
        "has-data-[state=checked]:bg-primary/5 dark:has-data-[state=checked]:bg-primary/10 has-data-[state=checked]:border-ring group/option flex flex-col gap-2 rounded-md border",
        "*:data-[slot=field]:p-4",
        "*:[img]:rounded-t-md",
        className
      )}
      {...props}
    />
  )
}

export {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLegend,
  FieldOption,
  FieldSeparator,
  FieldSet,
  FieldTitle,
}
