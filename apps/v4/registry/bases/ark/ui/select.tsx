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

// --- Trigger ---

const SelectTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Control>
    <SelectPrimitive.Trigger
      ref={ref}
      data-slot="select-trigger"
      className={cn("cn-select-trigger", className)}
      {...props}
    >
      {children}
      <IconPlaceholder
        lucide="ChevronDownIcon"
        tabler="IconChevronDown"
        hugeicons="ArrowDown01Icon"
        phosphor="CaretDownIcon"
        remixicon="RiArrowDownSLine"
        className="cn-select-trigger-icon"
      />
    </SelectPrimitive.Trigger>
  </SelectPrimitive.Control>
))
SelectTrigger.displayName = "SelectTrigger"

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
  SelectTrigger,
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
