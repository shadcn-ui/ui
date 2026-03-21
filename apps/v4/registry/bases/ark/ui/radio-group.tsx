"use client"

import * as React from "react"
import { RadioGroup as RadioGroupPrimitive } from "@ark-ui/react/radio-group"

import { cn } from "@/registry/bases/ark/lib/utils"

function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn("cn-radio-group", className)}
      {...props}
    />
  )
}

function RadioGroupItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn("cn-radio-group-item", className)}
      {...props}
    >
      <RadioGroupPrimitive.ItemControl className="cn-radio-group-item-control">
        <RadioGroupPrimitive.ItemIndicator className="cn-radio-group-item-indicator" />
      </RadioGroupPrimitive.ItemControl>
      <RadioGroupPrimitive.ItemHiddenInput />
      {children}
    </RadioGroupPrimitive.Item>
  )
}

const RadioGroupContext = RadioGroupPrimitive.Context
const RadioGroupRootProvider = RadioGroupPrimitive.RootProvider

export { RadioGroup, RadioGroupItem, RadioGroupContext, RadioGroupRootProvider }
export {
  useRadioGroup,
  useRadioGroupContext,
  type RadioGroupValueChangeDetails,
} from "@ark-ui/react/radio-group"
