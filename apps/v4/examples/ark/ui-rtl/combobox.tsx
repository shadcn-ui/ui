"use client"

import * as React from "react"
import { cn } from "@/examples/ark/lib/utils"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/examples/ark/ui-rtl/input-group"
import { Combobox as ComboboxPrimitive } from "@ark-ui/react/combobox"
import { Portal } from "@ark-ui/react/portal"
import { CheckIcon, ChevronDownIcon, XIcon } from "lucide-react"

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
    className={cn("relative flex items-center", className)}
    {...props}
  />
))
ComboboxControl.displayName = "ComboboxControl"

// --- Trigger ---

function ComboboxTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.Trigger>) {
  return (
    <ComboboxPrimitive.Trigger
      data-slot="combobox-trigger"
      className={cn("[&_svg:not([class*='size-'])]:size-4", className)}
      {...props}
    >
      {children}
      <ChevronDownIcon className="pointer-events-none size-4 text-muted-foreground" />
    </ComboboxPrimitive.Trigger>
  )
}

// --- ClearTrigger ---

function ComboboxClearTrigger({
  className,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.ClearTrigger>) {
  return (
    <ComboboxPrimitive.ClearTrigger
      asChild
      data-slot="combobox-clear-trigger"
      {...props}
    >
      <InputGroupButton
        variant="ghost"
        size="icon-xs"
        className={cn(className)}
      >
        <XIcon className="pointer-events-none" />
      </InputGroupButton>
    </ComboboxPrimitive.ClearTrigger>
  )
}

// --- Input ---

function ComboboxInput({
  className,
  children,
  disabled = false,
  showTrigger = true,
  showClear = false,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.Input> & {
  showTrigger?: boolean
  showClear?: boolean
}) {
  return (
    <ComboboxPrimitive.Control data-slot="combobox-control" asChild>
      <InputGroup className={cn("w-auto", className)}>
        <ComboboxPrimitive.Input asChild disabled={disabled} {...props}>
          <InputGroupInput />
        </ComboboxPrimitive.Input>
        <InputGroupAddon align="inline-end">
          {showTrigger && (
            <ComboboxPrimitive.Trigger asChild>
              <InputGroupButton
                size="icon-xs"
                variant="ghost"
                data-slot="input-group-button"
                className="group-has-data-[slot=combobox-clear-trigger]/input-group:hidden data-pressed:bg-transparent"
                disabled={disabled}
              >
                <ChevronDownIcon className="pointer-events-none size-4 text-muted-foreground" />
              </InputGroupButton>
            </ComboboxPrimitive.Trigger>
          )}
          {showClear && <ComboboxClearTrigger disabled={disabled} />}
        </InputGroupAddon>
        {children}
      </InputGroup>
    </ComboboxPrimitive.Control>
  )
}

// --- Content ---

function ComboboxContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.Content>) {
  return (
    <Portal>
      <ComboboxPrimitive.Positioner>
        <ComboboxPrimitive.Content
          data-slot="combobox-content"
          className={cn(
            "z-50 max-h-72 min-w-36 overflow-hidden rounded-lg bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 *:data-[slot=input-group]:m-1 *:data-[slot=input-group]:mb-0 *:data-[slot=input-group]:h-8 *:data-[slot=input-group]:border-input/30 *:data-[slot=input-group]:bg-input/30 *:data-[slot=input-group]:shadow-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
            className
          )}
          {...props}
        >
          {children}
        </ComboboxPrimitive.Content>
      </ComboboxPrimitive.Positioner>
    </Portal>
  )
}

// --- Item ---

function ComboboxItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.Item>) {
  return (
    <ComboboxPrimitive.Item
      data-slot="combobox-item"
      className={cn(
        "relative flex w-full cursor-default items-center gap-2 rounded-md py-1 ps-1.5 pe-8 text-sm outline-hidden select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground not-data-[variant=destructive]:data-highlighted:**:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      {children}
      <ComboboxPrimitive.ItemIndicator className="pointer-events-none absolute end-2 flex size-4 items-center justify-center">
        <CheckIcon className="pointer-events-none" />
      </ComboboxPrimitive.ItemIndicator>
    </ComboboxPrimitive.Item>
  )
}

// --- ItemText ---

const ComboboxItemText = ComboboxPrimitive.ItemText
const ComboboxItemIndicator = ComboboxPrimitive.ItemIndicator

// --- ItemGroup ---

function ComboboxItemGroup({
  className,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.ItemGroup>) {
  return (
    <ComboboxPrimitive.ItemGroup
      data-slot="combobox-item-group"
      className={cn(className)}
      {...props}
    />
  )
}

// --- ItemGroupLabel ---

function ComboboxItemGroupLabel({
  className,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.ItemGroupLabel>) {
  return (
    <ComboboxPrimitive.ItemGroupLabel
      data-slot="combobox-item-group-label"
      className={cn("px-2 py-1.5 text-xs text-muted-foreground", className)}
      {...props}
    />
  )
}

// --- Label ---

function ComboboxLabel({
  className,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.Label>) {
  return (
    <ComboboxPrimitive.Label
      data-slot="combobox-label"
      className={cn("px-2 py-1.5 text-xs text-muted-foreground", className)}
      {...props}
    />
  )
}

// --- List ---

function ComboboxList({
  className,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.List>) {
  return (
    <ComboboxPrimitive.List
      data-slot="combobox-list"
      className={cn(
        "no-scrollbar max-h-[min(calc(--spacing(72)---spacing(9)),calc(var(--available-height)---spacing(9)))] scroll-py-1 overflow-y-auto overscroll-contain p-1 data-empty:p-0",
        className
      )}
      {...props}
    />
  )
}

// --- Empty ---

function ComboboxEmpty({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="combobox-empty"
      className={cn(
        "hidden w-full justify-center py-2 text-center text-sm text-muted-foreground group-data-empty/combobox-content:flex",
        className
      )}
      {...props}
    />
  )
}

// --- Separator ---

function ComboboxSeparator({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="combobox-separator"
      className={cn("-mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  )
}

// --- Context & RootProvider re-exports ---

const ComboboxContext = ComboboxPrimitive.Context
const ComboboxRootProvider = ComboboxPrimitive.RootProvider

export {
  Combobox,
  ComboboxControl,
  ComboboxInput,
  ComboboxTrigger,
  ComboboxClearTrigger,
  ComboboxContent,
  ComboboxItem,
  ComboboxItemText,
  ComboboxItemIndicator,
  ComboboxItemGroup,
  ComboboxItemGroupLabel,
  ComboboxLabel,
  ComboboxList,
  ComboboxEmpty,
  ComboboxSeparator,
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
