import { cn } from "@/lib/utils"
import { Field, FieldDescription } from "@/registry/new-york-v4/ui/field"
import { Label } from "@/registry/new-york-v4/ui/label"

function Option({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <Label
      data-slot="option"
      role="option"
      className={cn(
        "has-data-[state=checked]:bg-primary/5 dark:has-data-[state=checked]:bg-primary/10 has-data-[state=checked]:border-ring group/option flex flex-col gap-2 rounded-md border",
        "*:data-[slot=field]:p-4",
        "*:[img]:rounded-t-md",
        "[&>label:not(:first-child)]:row-span-2",
        className
      )}
      {...props}
    />
  )
}

function OptionCover({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="option-cover"
      className={cn("w-full", className)}
      {...props}
    />
  )
}

function OptionField({
  className,
  ...props
}: React.ComponentProps<typeof Field>) {
  return (
    <Field
      data-slot="option-field"
      className={cn("gap-2", className)}
      {...props}
    />
  )
}

function OptionTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="option-title"
      className={cn(
        "group-has-aria-invalid/option:text-destructive font-medium group-has-data-[disabled]/option:opacity-60",
        className
      )}
      {...props}
    />
  )
}

function OptionDescription({
  className,
  ...props
}: React.ComponentProps<typeof FieldDescription>) {
  return (
    <FieldDescription
      data-slot="option-description"
      className={cn(
        "group-has-aria-invalid/option:text-destructive",
        className
      )}
      {...props}
    />
  )
}

function OptionGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="option-group"
      className={cn("flex flex-col gap-3", className)}
      {...props}
    />
  )
}

export {
  Option,
  OptionTitle,
  OptionDescription,
  OptionField,
  OptionGroup,
  OptionCover,
}
