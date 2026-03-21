"use client"

import * as React from "react"
import { ark } from "@ark-ui/react/factory"
import { Portal } from "@ark-ui/react/portal"
import {
  Select as SelectPrimitive,
  type CollectionItem,
} from "@ark-ui/react/select"

import { cn } from "@/examples/ark/lib/utils"
import { ChevronDownIcon, CheckIcon } from "lucide-react"

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
      className={cn(
        "gap-1.5 rounded-lg border border-input bg-transparent py-2 pr-2 pl-2.5 text-sm transition-colors select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 data-placeholder:text-muted-foreground data-[size=default]:h-8 data-[size=sm]:h-7 data-[size=sm]:rounded-[min(var(--radius-md),10px)] *:data-[slot=select-value]:flex *:data-[slot=select-value]:gap-1.5 dark:bg-input/30 dark:hover:bg-input/50 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDownIcon className="size-4 text-muted-foreground" />
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
    className={cn("flex flex-1 text-left", className)}
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
        className={cn(
          "min-w-36 rounded-lg bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
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

// --- Item ---

const SelectItem = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    data-slot="select-item"
    className={cn(
      "gap-1.5 rounded-md py-1 pr-8 pl-1.5 text-sm focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
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
      "pointer-events-none absolute right-2 flex size-4 items-center justify-center",
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
