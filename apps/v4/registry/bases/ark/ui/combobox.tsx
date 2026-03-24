"use client"

import * as React from "react"
import { Portal } from "@ark-ui/react/portal"
import { Combobox as ComboboxPrimitive } from "@ark-ui/react/combobox"

import { cn } from "@/registry/bases/ark/lib/utils"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

// --- Root ---

const Combobox = ComboboxPrimitive.Root

// --- Control ---

const ComboboxControl = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof ComboboxPrimitive.Control>
>(({ className, ...props }, ref) => (
  <ComboboxPrimitive.Control
    ref={ref}
    data-slot="combobox-control"
    className={cn("cn-combobox-control relative flex items-center", className)}
    {...props}
  />
))
ComboboxControl.displayName = "ComboboxControl"

// --- Input ---

const ComboboxInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<typeof ComboboxPrimitive.Input>
>(({ className, ...props }, ref) => (
  <ComboboxPrimitive.Input
    ref={ref}
    data-slot="combobox-input"
    className={cn("cn-combobox-input flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", className)}
    {...props}
  />
))
ComboboxInput.displayName = "ComboboxInput"

// --- Trigger ---

const ComboboxTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof ComboboxPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <ComboboxPrimitive.Trigger
    ref={ref}
    data-slot="combobox-trigger"
    className={cn("cn-combobox-trigger", className)}
    {...props}
  >
    {children ?? (
      <IconPlaceholder
        lucide="ChevronDownIcon"
        tabler="IconChevronDown"
        hugeicons="ArrowDown01Icon"
        phosphor="CaretDownIcon"
        remixicon="RiArrowDownSLine"
        className="cn-combobox-trigger-icon pointer-events-none"
      />
    )}
  </ComboboxPrimitive.Trigger>
))
ComboboxTrigger.displayName = "ComboboxTrigger"

// --- Content ---

const ComboboxContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof ComboboxPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <Portal>
    <ComboboxPrimitive.Positioner>
      <ComboboxPrimitive.Content
        ref={ref}
        data-slot="combobox-content"
        className={cn("cn-combobox-content", className)}
        {...props}
      >
        {children}
      </ComboboxPrimitive.Content>
    </ComboboxPrimitive.Positioner>
  </Portal>
))
ComboboxContent.displayName = "ComboboxContent"

// --- Item ---

const ComboboxItem = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof ComboboxPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <ComboboxPrimitive.Item
    ref={ref}
    data-slot="combobox-item"
    className={cn("cn-combobox-item", className)}
    {...props}
  >
    {children}
  </ComboboxPrimitive.Item>
))
ComboboxItem.displayName = "ComboboxItem"

// --- ItemText ---

const ComboboxItemText = ComboboxPrimitive.ItemText
ComboboxItemText.displayName = "ComboboxItemText"

// --- ItemIndicator ---

const ComboboxItemIndicator = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof ComboboxPrimitive.ItemIndicator>
>(({ className, children, ...props }, ref) => (
  <ComboboxPrimitive.ItemIndicator
    ref={ref}
    data-slot="combobox-item-indicator"
    className={cn("cn-combobox-item-indicator", className)}
    {...props}
  >
    {children ?? (
      <IconPlaceholder
        lucide="CheckIcon"
        tabler="IconCheck"
        hugeicons="Tick02Icon"
        phosphor="CheckIcon"
        remixicon="RiCheckLine"
        className="cn-combobox-item-indicator-icon pointer-events-none"
      />
    )}
  </ComboboxPrimitive.ItemIndicator>
))
ComboboxItemIndicator.displayName = "ComboboxItemIndicator"

// --- ItemGroup ---

const ComboboxItemGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof ComboboxPrimitive.ItemGroup>
>(({ className, ...props }, ref) => (
  <ComboboxPrimitive.ItemGroup
    ref={ref}
    data-slot="combobox-item-group"
    className={cn("cn-combobox-group", className)}
    {...props}
  />
))
ComboboxItemGroup.displayName = "ComboboxItemGroup"

// --- ItemGroupLabel ---

const ComboboxItemGroupLabel = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof ComboboxPrimitive.ItemGroupLabel>
>(({ className, ...props }, ref) => (
  <ComboboxPrimitive.ItemGroupLabel
    ref={ref}
    data-slot="combobox-item-group-label"
    className={cn("cn-combobox-label", className)}
    {...props}
  />
))
ComboboxItemGroupLabel.displayName = "ComboboxItemGroupLabel"

// --- Label ---

const ComboboxLabel = React.forwardRef<
  HTMLLabelElement,
  React.ComponentProps<typeof ComboboxPrimitive.Label>
>(({ className, ...props }, ref) => (
  <ComboboxPrimitive.Label
    ref={ref}
    data-slot="combobox-label"
    className={cn("cn-combobox-label", className)}
    {...props}
  />
))
ComboboxLabel.displayName = "ComboboxLabel"

// --- ClearTrigger ---

const ComboboxClearTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof ComboboxPrimitive.ClearTrigger>
>(({ className, children, ...props }, ref) => (
  <ComboboxPrimitive.ClearTrigger
    ref={ref}
    data-slot="combobox-clear-trigger"
    className={cn("cn-combobox-clear", className)}
    {...props}
  >
    {children ?? (
      <IconPlaceholder
        lucide="XIcon"
        tabler="IconX"
        hugeicons="Cancel01Icon"
        phosphor="XIcon"
        remixicon="RiCloseLine"
        className="cn-combobox-clear-icon pointer-events-none"
      />
    )}
  </ComboboxPrimitive.ClearTrigger>
))
ComboboxClearTrigger.displayName = "ComboboxClearTrigger"

// --- List ---

const ComboboxList = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof ComboboxPrimitive.List>
>(({ className, ...props }, ref) => (
  <ComboboxPrimitive.List
    ref={ref}
    data-slot="combobox-list"
    className={cn("cn-combobox-list", className)}
    {...props}
  />
))
ComboboxList.displayName = "ComboboxList"

// --- Context & RootProvider re-exports ---

const ComboboxContext = ComboboxPrimitive.Context
const ComboboxRootProvider = ComboboxPrimitive.RootProvider

export {
  Combobox,
  ComboboxControl,
  ComboboxInput,
  ComboboxTrigger,
  ComboboxContent,
  ComboboxItem,
  ComboboxItemText,
  ComboboxItemIndicator,
  ComboboxItemGroup,
  ComboboxItemGroupLabel,
  ComboboxLabel,
  ComboboxClearTrigger,
  ComboboxList,
  ComboboxContext,
  ComboboxRootProvider,
}

export {
  createListCollection,
  useCombobox,
  useComboboxContext,
  useListCollection,
  type ComboboxInputValueChangeDetails,
  type ComboboxValueChangeDetails,
} from "@ark-ui/react/combobox"

export { useFilter } from "@ark-ui/react/locale"
