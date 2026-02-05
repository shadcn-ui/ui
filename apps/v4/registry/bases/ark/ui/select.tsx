"use client"

import * as React from "react"
import { Select as SelectPrimitive } from "@ark-ui/react/select"
import { Portal } from "@ark-ui/react/portal"

import { cn } from "@/registry/bases/ark/lib/utils"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

function Select<T extends SelectPrimitive.CollectionItem>({
  ...props
}: SelectPrimitive.RootProps<T>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />
}

function SelectTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger>) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      className={cn("cn-select-trigger", className)}
      {...props}
    >
      {children}
      <SelectPrimitive.Indicator>
        <IconPlaceholder
          lucide="ChevronDownIcon"
          tabler="IconChevronDown"
          hugeicons="ArrowDown01Icon"
          phosphor="CaretDownIcon"
          remixicon="RiArrowDownSLine"
          className="cn-select-trigger-icon"
        />
      </SelectPrimitive.Indicator>
    </SelectPrimitive.Trigger>
  )
}

function SelectValue({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ValueText>) {
  return (
    <SelectPrimitive.ValueText
      data-slot="select-value"
      className={cn("cn-select-value", className)}
      {...props}
    />
  )
}

function SelectContent({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <Portal>
      <SelectPrimitive.Positioner>
        <SelectPrimitive.Content
          data-slot="select-content"
          className={cn("cn-select-content", className)}
          {...props}
        />
      </SelectPrimitive.Positioner>
    </Portal>
  )
}

function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn("cn-select-label", className)}
      {...props}
    />
  )
}

function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn("cn-select-item", className)}
      {...props}
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator className="cn-select-item-indicator">
        <IconPlaceholder
          lucide="CheckIcon"
          tabler="IconCheck"
          hugeicons="Tick02Icon"
          phosphor="CheckIcon"
          remixicon="RiCheckLine"
        />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  )
}

function SelectItemGroup({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ItemGroup>) {
  return (
    <SelectPrimitive.ItemGroup
      data-slot="select-item-group"
      className={cn("cn-select-item-group", className)}
      {...props}
    />
  )
}

function SelectItemGroupLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ItemGroupLabel>) {
  return (
    <SelectPrimitive.ItemGroupLabel
      data-slot="select-item-group-label"
      className={cn("cn-select-item-group-label", className)}
      {...props}
    />
  )
}

function SelectSeparator({ className }: { className?: string }) {
  return (
    <div
      data-slot="select-separator"
      className={cn("cn-select-separator", className)}
    />
  )
}

export {
  Select,
  SelectContent,
  SelectItem,
  SelectItemGroup,
  SelectItemGroupLabel,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}
