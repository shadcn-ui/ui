import * as React from "react"
import { ark } from "@ark-ui/react/factory"
import { Field } from "@ark-ui/react/field"

import { cn } from "@/registry/bases/ark/lib/utils"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

type NativeSelectProps = Omit<
  React.ComponentProps<typeof Field.Select>,
  "size"
> & {
  size?: "sm" | "default"
}

function NativeSelect({
  className,
  size = "default",
  ...props
}: NativeSelectProps) {
  return (
    <ark.div
      className={cn(
        "cn-native-select-wrapper group/native-select relative w-fit has-[select:disabled]:opacity-50",
        className
      )}
      data-slot="native-select-wrapper"
      data-size={size}
    >
      <Field.Select
        data-slot="native-select"
        data-size={size}
        className="cn-native-select outline-none disabled:pointer-events-none disabled:cursor-not-allowed"
        {...props}
      />
      <IconPlaceholder
        lucide="ChevronDownIcon"
        tabler="IconSelector"
        hugeicons="UnfoldMoreIcon"
        phosphor="CaretDownIcon"
        remixicon="RiArrowDownSLine"
        className="cn-native-select-icon pointer-events-none absolute select-none"
        aria-hidden="true"
        data-slot="native-select-icon"
      />
    </ark.div>
  )
}

function NativeSelectOption({
  ...props
}: React.ComponentProps<typeof ark.option>) {
  return <ark.option data-slot="native-select-option" {...props} />
}

function NativeSelectOptGroup({
  className,
  ...props
}: React.ComponentProps<typeof ark.optgroup>) {
  return (
    <ark.optgroup
      data-slot="native-select-optgroup"
      className={cn(className)}
      {...props}
    />
  )
}

export { NativeSelect, NativeSelectOptGroup, NativeSelectOption }
