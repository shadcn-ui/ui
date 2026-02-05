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
    </RadioGroupPrimitive.Item>
  )
}

function RadioGroupItemText({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.ItemText>) {
  return (
    <RadioGroupPrimitive.ItemText
      data-slot="radio-group-item-text"
      className={cn("cn-radio-group-item-text", className)}
      {...props}
    />
  )
}

function RadioGroupLabel({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Label>) {
  return (
    <RadioGroupPrimitive.Label
      data-slot="radio-group-label"
      className={cn("cn-radio-group-label", className)}
      {...props}
    />
  )
}

export { RadioGroup, RadioGroupItem, RadioGroupItemText, RadioGroupLabel }
