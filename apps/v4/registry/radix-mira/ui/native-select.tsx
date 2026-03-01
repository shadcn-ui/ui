import * as React from "react"

import { cn } from "@/registry/radix-mira/lib/utils"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

type NativeSelectProps = Omit<React.ComponentProps<"select">, "size"> & {
  size?: "sm" | "default"
}

function NativeSelect({
  className,
  size = "default",
  ...props
}: NativeSelectProps) {
  return (
    <div
      className={cn(
        "group/native-select relative w-fit has-[select:disabled]:opacity-50",
        className
      )}
      data-slot="native-select-wrapper"
      data-size={size}
    >
      <select
        data-slot="native-select"
        data-size={size}
        className="border-input bg-input/20 placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 dark:hover:bg-input/50 focus-visible:border-ring focus-visible:ring-ring/30 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 h-7 w-full min-w-0 appearance-none rounded-md border py-0.5 pr-6 pl-2 text-xs/relaxed transition-colors select-none focus-visible:ring-2 aria-invalid:ring-2 data-[size=sm]:h-6 data-[size=sm]:text-[0.625rem] outline-none disabled:pointer-events-none disabled:cursor-not-allowed"
        {...props}
      />
      <IconPlaceholder
        lucide="ChevronDownIcon"
        tabler="IconSelector"
        hugeicons="UnfoldMoreIcon"
        phosphor="CaretDownIcon"
        remixicon="RiArrowDownSLine"
        className="text-muted-foreground top-1/2 right-1.5 size-3.5 -translate-y-1/2 group-data-[size=sm]/native-select:size-3 group-data-[size=sm]/native-select:-translate-y-[calc(--spacing(1.25))] pointer-events-none absolute select-none"
        aria-hidden="true"
        data-slot="native-select-icon"
      />
    </div>
  )
}

function NativeSelectOption({ ...props }: React.ComponentProps<"option">) {
  return <option data-slot="native-select-option" {...props} />
}

function NativeSelectOptGroup({
  className,
  ...props
}: React.ComponentProps<"optgroup">) {
  return (
    <optgroup
      data-slot="native-select-optgroup"
      className={cn(className)}
      {...props}
    />
  )
}

export { NativeSelect, NativeSelectOptGroup, NativeSelectOption }
