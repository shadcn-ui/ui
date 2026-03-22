"use client"

import * as React from "react"
import { ark } from "@ark-ui/react/factory"
import { Select as SelectPrimitive } from "@ark-ui/react/select"

import { cn } from "@/examples/ark/lib/utils"
import { ChevronsUpDownIcon, XIcon, CheckIcon } from "lucide-react"

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
      "flex w-full items-center gap-2 rounded-md border border-input bg-transparent py-2 pe-10 ps-3 text-sm transition-colors select-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 data-invalid:border-destructive data-invalid:focus-visible:border-destructive data-invalid:focus-visible:ring-destructive/20 data-placeholder:text-muted-foreground data-placeholder-shown:text-muted-foreground data-[size=default]:h-8 data-[size=sm]:h-7 data-[size=sm]:rounded-[min(var(--radius-md),10px)] *:data-[slot=select-value]:flex *:data-[slot=select-value]:gap-1.5 dark:bg-input/30 dark:hover:bg-input/50 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 data-disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-muted-foreground [&_svg:not([class*='size-'])]:size-4",
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
    className={cn(
      "flex shrink-0 items-center justify-center text-muted-foreground [&_svg]:size-4",
      className
    )}
    {...props}
  >
    {children ?? (
      <ChevronsUpDownIcon
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
      "pointer-events-auto flex shrink-0 items-center justify-center text-muted-foreground transition-colors hover:text-foreground [&_svg]:size-4",
      className
    )}
    {...props}
  >
    {children ?? (
      <XIcon
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
    className={cn("line-clamp-1 flex-1 text-start", className)}
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
    className={cn(
      "flex max-h-[min(var(--available-height,300px),300px)] min-w-(--reference-width) flex-col gap-1 overflow-y-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 outline-none data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
      className
    )}
    {...props}
  >
    {children}
  </SelectPrimitive.Content>
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
      "relative flex items-center gap-2 rounded-sm px-2 py-1.5 pe-8 text-sm select-none focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:opacity-50 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
      className
    )}
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
    className={cn(
      "pointer-events-none absolute end-2 flex size-4 shrink-0 items-center justify-center",
      className
    )}
    {...props}
  >
    {children ?? (
      <CheckIcon
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
    className={cn("scroll-my-1 p-1", className)}
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
    className={cn("px-1.5 py-1 text-xs text-muted-foreground", className)}
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
    className={cn("px-1.5 py-1 text-xs text-muted-foreground", className)}
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
    className={cn("-mx-1 my-1 h-px bg-border", className)}
    {...props}
  />
))
SelectSeparator.displayName = "SelectSeparator"

const SelectIndicatorGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof ark.div>
>(({ className, children, ...props }, ref) => (
  <ark.div
    ref={ref}
    data-slot="select-indicator-group"
    className={cn(
      "pointer-events-none absolute inset-y-0 end-0 flex items-center gap-1 px-3",
      className
    )}
    {...props}
  >
    {children}
  </ark.div>
))
SelectIndicatorGroup.displayName = "SelectIndicatorGroup"

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
