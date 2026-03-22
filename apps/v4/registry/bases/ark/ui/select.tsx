"use client"

import * as React from "react"
import { ark } from "@ark-ui/react/factory"
import {
  Select as SelectPrimitive,
} from "@ark-ui/react/select"

import { cn } from "@/registry/bases/ark/lib/utils"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"


const Select = SelectPrimitive.Root

const SelectControl = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof SelectPrimitive.Control>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Control
    ref={ref}
    data-slot="select-control"
    className={cn("relative flex w-full items-center gap-2", className)}
    {...props}
  >
    {children}
  </SelectPrimitive.Control>
))
SelectControl.displayName = "SelectControl"

const SelectTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    data-slot="select-trigger"
    className={cn(
      "cn-select-trigger flex w-full items-center gap-2 border border-input rounded-md bg-transparent py-2 pr-10 pl-3 text-sm select-none transition-colors focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1 data-placeholder-shown:text-muted-foreground data-disabled:opacity-50 data-invalid:border-destructive data-invalid:focus-visible:border-destructive data-invalid:focus-visible:ring-destructive/20 [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-muted-foreground",
      className
    )}
    {...props}
  >
    {children}
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = "SelectTrigger"

const SelectIndicator = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof SelectPrimitive.Indicator>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Indicator
    ref={ref}
    data-slot="select-indicator"
    className={cn("flex shrink-0 items-center justify-center text-muted-foreground [&_svg]:size-4", className)}
    {...props}
  >
    {children ?? (
      <IconPlaceholder
        lucide="ChevronsUpDownIcon"
        tabler="IconSelector"
        hugeicons="UnfoldMoreIcon"
        phosphor="CaretUpDownIcon"
        remixicon="RiExpandUpDownLine"
      />
    )}
  </SelectPrimitive.Indicator>
))
SelectIndicator.displayName = "SelectIndicator"

const SelectClearTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof SelectPrimitive.ClearTrigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.ClearTrigger
    ref={ref}
    data-slot="select-clear-trigger"
    className={cn("pointer-events-auto flex shrink-0 items-center justify-center text-muted-foreground transition-colors hover:text-foreground [&_svg]:size-4", className)}
    {...props}
  >
    {children ?? (
      <IconPlaceholder
        lucide="XIcon"
        tabler="IconX"
        hugeicons="Cancel01Icon"
        phosphor="XIcon"
        remixicon="RiCloseLine"
      />
    )}
  </SelectPrimitive.ClearTrigger>
))
SelectClearTrigger.displayName = "SelectClearTrigger"

const SelectValue = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<typeof SelectPrimitive.ValueText>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ValueText
    ref={ref}
    data-slot="select-value"
    className={cn("flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-left", className)}
    {...props}
  />
))
SelectValue.displayName = "SelectValue"

const SelectPositioner = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof SelectPrimitive.Positioner>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Positioner
    ref={ref}
    data-slot="select-positioner"
    className={cn("z-50", className)}
    {...props}
  />
))
SelectPositioner.displayName = "SelectPositioner"

const SelectContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof SelectPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Content
    ref={ref}
    data-slot="select-content"
    className={cn("cn-select-content flex flex-col gap-1 rounded-md border bg-popover p-1 shadow-md outline-none min-w-(--reference-width) data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 max-h-[min(var(--available-height,300px),300px)] overflow-y-auto", className)}
    {...props}
  >
    {children}
  </SelectPrimitive.Content>
))
SelectContent.displayName = "SelectContent"

// --- HiddenSelect ---

const SelectHiddenSelect = SelectPrimitive.HiddenSelect

// --- Item ---

const SelectItem = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    data-slot="select-item"
    className={cn("cn-select-item relative flex items-center gap-2 rounded-sm px-2 py-1.5 pr-8 text-sm select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:opacity-50", className)}
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
    className={cn("cn-select-item-indicator flex shrink-0 items-center justify-center", className)}
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

const SelectContext = SelectPrimitive.Context
const SelectRootProvider = SelectPrimitive.RootProvider

export {
  Select,
  SelectControl,
  SelectTrigger,
  SelectIndicator,
  SelectClearTrigger,
  SelectValue,
  SelectPositioner,
  SelectContent,
  SelectHiddenSelect,
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
