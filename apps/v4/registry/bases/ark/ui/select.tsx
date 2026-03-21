"use client"

import * as React from "react"
import { ark } from "@ark-ui/react/factory"
import { Portal } from "@ark-ui/react/portal"
import {
  Select as SelectPrimitive,
  type CollectionItem,
} from "@ark-ui/react/select"

import { cn } from "@/registry/bases/ark/lib/utils"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

// --- Root ---

const Select = React.forwardRef(function Select<T extends CollectionItem>(
  props: SelectPrimitive.RootProps<T> & { children: React.ReactNode },
  ref: React.Ref<HTMLDivElement>
) {
  const { children, ...rest } = props
  return (
    <SelectPrimitive.Root<T> ref={ref} data-slot="select" {...rest}>
      {children}
      <SelectPrimitive.HiddenSelect />
    </SelectPrimitive.Root>
  )
}) as <T extends CollectionItem>(
  props: SelectPrimitive.RootProps<T> & {
    children: React.ReactNode
    ref?: React.Ref<HTMLDivElement>
  }
) => React.ReactElement
;(Select as { displayName?: string }).displayName = "Select"

// --- Control ---

const SelectControl = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof SelectPrimitive.Control>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Control
    ref={ref}
    data-slot="select-control"
    className={cn("cn-select-control", className)}
    {...props}
  />
))
SelectControl.displayName = "SelectControl"

// --- Trigger ---

const SelectTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    data-slot="select-trigger"
    className={cn("cn-select-trigger", className)}
    {...props}
  >
    {children}
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = "SelectTrigger"

// --- Indicator (chevron) ---

const SelectIndicator = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof SelectPrimitive.Indicator>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Indicator
    ref={ref}
    data-slot="select-indicator"
    className={cn("cn-select-trigger-icon", className)}
    {...props}
  >
    {children ?? (
      <IconPlaceholder
        lucide="ChevronDownIcon"
        tabler="IconChevronDown"
        hugeicons="ArrowDown01Icon"
        phosphor="CaretDownIcon"
        remixicon="RiArrowDownSLine"
      />
    )}
  </SelectPrimitive.Indicator>
))
SelectIndicator.displayName = "SelectIndicator"

// --- ClearTrigger ---

const SelectClearTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof SelectPrimitive.ClearTrigger>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ClearTrigger
    ref={ref}
    data-slot="select-clear-trigger"
    className={cn("cn-select-clear-trigger", className)}
    {...props}
  />
))
SelectClearTrigger.displayName = "SelectClearTrigger"

// --- Value ---

const SelectValue = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<typeof SelectPrimitive.ValueText>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ValueText
    ref={ref}
    data-slot="select-value"
    className={cn("cn-select-value", className)}
    {...props}
  />
))
SelectValue.displayName = "SelectValue"

// --- Content ---

const SelectContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof SelectPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <Portal>
    <SelectPrimitive.Positioner>
      <SelectPrimitive.Content
        ref={ref}
        data-slot="select-content"
        className={cn("cn-select-content", className)}
        {...props}
      >
        {children}
      </SelectPrimitive.Content>
    </SelectPrimitive.Positioner>
  </Portal>
))
SelectContent.displayName = "SelectContent"

// --- Item ---

const SelectItem = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    data-slot="select-item"
    className={cn("cn-select-item", className)}
    {...props}
  >
    {children}
  </SelectPrimitive.Item>
))
SelectItem.displayName = "SelectItem"

// --- ItemText ---

const SelectItemText = SelectPrimitive.ItemText
SelectItemText.displayName = "SelectItemText"

// --- ItemIndicator ---

const SelectItemIndicator = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof SelectPrimitive.ItemIndicator>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.ItemIndicator
    ref={ref}
    data-slot="select-item-indicator"
    className={cn("cn-select-item-indicator", className)}
    {...props}
  >
    {children ?? (
      <IconPlaceholder
        lucide="CheckIcon"
        tabler="IconCheck"
        hugeicons="Tick02Icon"
        phosphor="CheckIcon"
        remixicon="RiCheckLine"
      />
    )}
  </SelectPrimitive.ItemIndicator>
))
SelectItemIndicator.displayName = "SelectItemIndicator"

// --- ItemGroup ---

const SelectItemGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof SelectPrimitive.ItemGroup>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ItemGroup
    ref={ref}
    data-slot="select-item-group"
    className={cn("cn-select-group", className)}
    {...props}
  />
))
SelectItemGroup.displayName = "SelectItemGroup"

// --- ItemGroupLabel ---

const SelectItemGroupLabel = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof SelectPrimitive.ItemGroupLabel>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ItemGroupLabel
    ref={ref}
    data-slot="select-item-group-label"
    className={cn("cn-select-label", className)}
    {...props}
  />
))
SelectItemGroupLabel.displayName = "SelectItemGroupLabel"

// --- Label ---

const SelectLabel = React.forwardRef<
  HTMLLabelElement,
  React.ComponentProps<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    data-slot="select-label"
    className={cn("cn-select-label", className)}
    {...props}
  />
))
SelectLabel.displayName = "SelectLabel"

// --- Separator ---

const SelectSeparator = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof ark.div>
>(({ className, ...props }, ref) => (
  <ark.div
    ref={ref}
    data-slot="select-separator"
    className={cn("cn-select-separator", className)}
    {...props}
  />
))
SelectSeparator.displayName = "SelectSeparator"

// --- Context & RootProvider re-exports ---

const SelectContext = SelectPrimitive.Context
const SelectRootProvider = SelectPrimitive.RootProvider

export {
  Select,
  SelectControl,
  SelectTrigger,
  SelectIndicator,
  SelectClearTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectItemText,
  SelectItemIndicator,
  SelectItemGroup,
  SelectItemGroupLabel,
  SelectLabel,
  SelectSeparator,
  SelectContext,
  SelectRootProvider,
}

export {
  createListCollection,
  useSelect,
  useSelectContext,
  type SelectValueChangeDetails,
  type CollectionItem,
  type ListCollection,
} from "@ark-ui/react/select"
