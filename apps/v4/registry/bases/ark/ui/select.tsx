"use client"

import * as React from "react"
import { ark } from "@ark-ui/react/factory"
import { Portal } from "@ark-ui/react/portal"
import {
  Select as SelectPrimitive,
} from "@ark-ui/react/select"

import { cn } from "@/registry/bases/ark/lib/utils"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

function Select(props: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root lazyMount unmountOnExit {...props} />
}

const SelectControl = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof SelectPrimitive.Control>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Control
    ref={ref}
    data-slot="select-control"
    className={cn("relative flex w-full items-center", className)}
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
      "flex h-9 w-full items-center gap-2 rounded-md border border-input bg-transparent py-2 pr-10 pl-3 text-sm shadow-xs transition-[border-color,box-shadow] duration-150 ease-in-out outline-none",
      "data-placeholder-shown:text-muted-foreground",
      "hover:border-ring/50",
      "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/20",
      "data-disabled:cursor-not-allowed data-disabled:opacity-50",
      "data-invalid:border-destructive data-invalid:focus-visible:ring-destructive/20",
      className
    )}
    {...props}
  >
    {children}
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = "SelectTrigger"

const SelectIndicatorGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof ark.div>
>(({ className, children, ...props }, ref) => (
  <ark.div
    ref={ref}
    data-slot="select-indicator-group"
    className={cn(
      "pointer-events-none absolute inset-y-0 right-0 flex items-center gap-1 px-2.5",
      className
    )}
    {...props}
  >
    {children}
  </ark.div>
))
SelectIndicatorGroup.displayName = "SelectIndicatorGroup"

const SelectIndicator = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof SelectPrimitive.Indicator>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Indicator
    ref={ref}
    data-slot="select-indicator"
    className={cn(
      "flex shrink-0 items-center justify-center text-muted-foreground/60 [&_svg]:size-4",
      className
    )}
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
    className={cn(
      "pointer-events-auto flex shrink-0 items-center justify-center rounded-sm text-muted-foreground/60 transition-colors hover:text-foreground [&_svg]:size-3.5",
      className
    )}
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
    className={cn("flex-1 text-left line-clamp-1", className)}
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
    className={cn("outline-none", className)}
    {...props}
  />
))
SelectPositioner.displayName = "SelectPositioner"

const SelectContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof SelectPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <Portal>
    <SelectPrimitive.Positioner data-slot="select-positioner" className="outline-none">
      <SelectPrimitive.Content
        ref={ref}
        data-slot="select-content"
        className={cn(
          "z-50 flex flex-col gap-0.5 rounded-lg border bg-popover p-1 text-popover-foreground shadow-lg outline-none",
          "min-w-(--reference-width)",
          "max-h-[min(var(--available-height,300px),300px)] overflow-y-auto",
          "origin-(--transform-origin)",
          "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-[98%]",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-[98%]",
          className
        )}
        {...props}
      >
        {children}
      </SelectPrimitive.Content>
    </SelectPrimitive.Positioner>
  </Portal>
))
SelectContent.displayName = "SelectContent"

const SelectHiddenSelect = SelectPrimitive.HiddenSelect

const SelectItem = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    data-slot="select-item"
    className={cn(
      "relative flex w-full cursor-default items-center gap-2 rounded-md px-2 py-1.5 pr-8 text-sm outline-none select-none",
      "data-highlighted:bg-accent data-highlighted:text-accent-foreground",
      "data-[state=checked]:font-medium",
      "data-disabled:pointer-events-none data-disabled:opacity-50",
      className
    )}
    {...props}
  >
    {children}
  </SelectPrimitive.Item>
))
SelectItem.displayName = "SelectItem"

const SelectItemText = SelectPrimitive.ItemText

const SelectItemIndicator = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof SelectPrimitive.ItemIndicator>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.ItemIndicator
    ref={ref}
    data-slot="select-item-indicator"
    className={cn(
      "absolute right-2 flex size-4 items-center justify-center",
      className
    )}
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

const SelectItemGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof SelectPrimitive.ItemGroup>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ItemGroup
    ref={ref}
    data-slot="select-item-group"
    className={cn("flex flex-col", className)}
    {...props}
  />
))
SelectItemGroup.displayName = "SelectItemGroup"

const SelectItemGroupLabel = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof SelectPrimitive.ItemGroupLabel>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ItemGroupLabel
    ref={ref}
    data-slot="select-item-group-label"
    className={cn(
      "px-2 py-1.5 text-xs font-semibold text-muted-foreground tracking-wide",
      className
    )}
    {...props}
  />
))
SelectItemGroupLabel.displayName = "SelectItemGroupLabel"

const SelectLabel = React.forwardRef<
  HTMLLabelElement,
  React.ComponentProps<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    data-slot="select-label"
    className={cn(
      "text-sm font-medium leading-none select-none data-disabled:opacity-50",
      className
    )}
    {...props}
  />
))
SelectLabel.displayName = "SelectLabel"

const SelectSeparator = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof ark.div>
>(({ className, ...props }, ref) => (
  <ark.div
    ref={ref}
    data-slot="select-separator"
    className={cn("-mx-1 my-1 h-px bg-border", className)}
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
  SelectIndicatorGroup,
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
