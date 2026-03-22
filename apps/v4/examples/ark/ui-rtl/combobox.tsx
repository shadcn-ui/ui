"use client"

import * as React from "react"
import {
  Combobox as ComboboxPrimitive,
  type CollectionItem,
} from "@ark-ui/react/combobox"
import { ark } from "@ark-ui/react/factory"
import { Portal } from "@ark-ui/react/portal"

import { cn } from "@/examples/ark/lib/utils"
import { ChevronDownIcon, CheckIcon, XIcon } from "lucide-react"

// --- Root ---

const Combobox = React.forwardRef(function Combobox<T extends CollectionItem>(
  props: ComboboxPrimitive.RootProps<T> & { children: React.ReactNode },
  ref: React.Ref<HTMLDivElement>
) {
  const { children, ...rest } = props
  return (
    <ComboboxPrimitive.Root<T> ref={ref} data-slot="combobox" {...rest}>
      {children}
    </ComboboxPrimitive.Root>
  )
}) as <T extends CollectionItem>(
  props: ComboboxPrimitive.RootProps<T> & {
    children: React.ReactNode
    ref?: React.Ref<HTMLDivElement>
  }
) => React.ReactElement
;(Combobox as { displayName?: string }).displayName = "Combobox"

// --- Control ---

const ComboboxControl = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof ComboboxPrimitive.Control>
>(({ className, ...props }, ref) => (
  <ComboboxPrimitive.Control
    ref={ref}
    data-slot="combobox-control"
    className={cn("relative flex items-center", className)}
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
    className={cn(
      "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
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
    className={cn("[&_svg:not([class*='size-'])]:size-4", className)}
    {...props}
  >
    {children ?? (
      <ChevronDownIcon className="pointer-events-none size-4 text-muted-foreground" />
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
        className={cn(
          "max-h-72 min-w-36 overflow-hidden rounded-lg bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 *:data-[slot=input-group]:m-1 *:data-[slot=input-group]:mb-0 *:data-[slot=input-group]:h-8 *:data-[slot=input-group]:border-input/30 *:data-[slot=input-group]:bg-input/30 *:data-[slot=input-group]:shadow-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
          className
        )}
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
    className={cn(
      "gap-2 rounded-md py-1 pe-8 ps-1.5 text-sm data-highlighted:bg-accent data-highlighted:text-accent-foreground not-data-[variant=destructive]:data-highlighted:**:text-accent-foreground [&_svg:not([class*='size-'])]:size-4",
      className
    )}
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
    className={cn(
      "pointer-events-none absolute end-2 flex size-4 items-center justify-center",
      className
    )}
    {...props}
  >
    {children ?? (
      <CheckIcon className="pointer-events-none" />
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
    className={cn(className)}
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
    className={cn("px-2 py-1.5 text-xs text-muted-foreground", className)}
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
    className={cn("px-2 py-1.5 text-xs text-muted-foreground", className)}
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
    className={cn(className)}
    {...props}
  >
    {children ?? (
      <XIcon className="pointer-events-none" />
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
    className={cn(
      "no-scrollbar max-h-[min(calc(--spacing(72)---spacing(9)),calc(var(--available-height)---spacing(9)))] scroll-py-1 overflow-y-auto p-1 data-empty:p-0",
      className
    )}
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
