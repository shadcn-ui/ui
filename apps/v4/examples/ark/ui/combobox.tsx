"use client"

import * as React from "react"
import { cn } from "@/examples/ark/lib/utils"
import { Combobox as ComboboxPrimitive } from "@ark-ui/react/combobox"
import { Portal } from "@ark-ui/react/portal"
import { CheckIcon, ChevronDownIcon, XIcon } from "lucide-react"

// --- Root ---

const Combobox = ComboboxPrimitive.Root

// --- Control ---

function ComboboxControl({
  className,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.Control>) {
  return (
    <ComboboxPrimitive.Control
      data-slot="combobox-control"
      className={cn(
        "relative flex h-8 w-full items-center rounded-lg border border-input bg-transparent shadow-xs transition-[color,box-shadow] focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50 data-disabled:bg-input/50 data-disabled:opacity-50 data-invalid:border-destructive data-invalid:ring-[3px] data-invalid:ring-destructive/20 dark:bg-input/30 dark:data-disabled:bg-input/80 dark:data-invalid:border-destructive/50 dark:data-invalid:ring-destructive/40",
        className
      )}
      {...props}
    />
  )
}

// --- Input ---

function ComboboxInput({
  className,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.Input>) {
  return (
    <ComboboxPrimitive.Input
      data-slot="combobox-input"
      className={cn(
        "flex h-full w-full min-w-0 bg-transparent px-2.5 py-1 text-base outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed md:text-sm",
        className
      )}
      {...props}
    />
  )
}

// --- Trigger ---

function ComboboxTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.Trigger>) {
  return (
    <ComboboxPrimitive.Trigger
      data-slot="combobox-trigger"
      className={cn(
        "flex shrink-0 cursor-default items-center justify-center pe-2 text-muted-foreground/80 transition-colors hover:text-foreground data-disabled:pointer-events-none data-disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children ?? (
        <ChevronDownIcon className="size-4 pointer-events-none" />
      )}
    </ComboboxPrimitive.Trigger>
  )
}

// --- ClearTrigger ---

function ComboboxClearTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.ClearTrigger>) {
  return (
    <ComboboxPrimitive.ClearTrigger
      data-slot="combobox-clear-trigger"
      className={cn(
        "flex shrink-0 cursor-default items-center justify-center px-1 text-muted-foreground/80 transition-colors hover:text-foreground",
        className
      )}
      {...props}
    >
      {children ?? <XIcon className="size-3.5 pointer-events-none" />}
    </ComboboxPrimitive.ClearTrigger>
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
            "group/combobox-content z-50 max-h-72 min-w-[--reference-width] overflow-hidden rounded-lg bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
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
        "relative flex w-full cursor-default items-center gap-2 rounded-md py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      {children}
      <ComboboxPrimitive.ItemIndicator className="pointer-events-none absolute right-2 flex size-4 items-center justify-center">
        <CheckIcon className="size-4 pointer-events-none" />
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
        "max-h-[min(calc(--spacing(72)---spacing(2)),calc(var(--available-height)---spacing(2)))] scroll-py-1 overflow-y-auto overscroll-contain p-1 data-empty:p-0",
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

// --- TagsControl ---

function ComboboxTagsControl({
  className,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.Control>) {
  return (
    <ComboboxPrimitive.Control
      data-slot="combobox-tags-control"
      className={cn(
        "flex min-h-8 w-full flex-wrap items-center gap-1.5 rounded-lg border border-input bg-transparent px-2.5 py-1.5 shadow-xs transition-[color,box-shadow] focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50 has-data-[slot=combobox-tag]:px-1.5 data-disabled:bg-input/50 data-disabled:opacity-50 data-invalid:border-destructive data-invalid:ring-[3px] data-invalid:ring-destructive/20 dark:bg-input/30 dark:data-disabled:bg-input/80 dark:data-invalid:border-destructive/50 dark:data-invalid:ring-destructive/40",
        className
      )}
      {...props}
    />
  )
}

// --- Tag ---

function ComboboxTag({
  className,
  children,
  value,
  onRemove,
  ...props
}: React.ComponentProps<"span"> & {
  value: string
  onRemove?: (value: string) => void
}) {
  return (
    <span
      data-slot="combobox-tag"
      className={cn(
        "flex h-[calc(--spacing(5.5))] w-fit items-center justify-center gap-1 rounded-sm bg-muted px-1.5 text-xs font-medium whitespace-nowrap text-foreground",
        onRemove && "pr-0",
        className
      )}
      {...props}
    >
      {children}
      {onRemove && (
        <button
          type="button"
          aria-label={`Remove ${children}`}
          onClick={() => onRemove(value)}
          className="-ml-1 flex size-5.5 items-center justify-center rounded-sm opacity-50 hover:opacity-100"
        >
          <XIcon className="size-3 pointer-events-none" />
        </button>
      )}
    </span>
  )
}

// --- TagsInput ---

function ComboboxTagsInput({
  className,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.Input>) {
  return (
    <ComboboxPrimitive.Input
      data-slot="combobox-tags-input"
      className={cn(
        "min-w-16 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed md:text-sm",
        className
      )}
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
  ComboboxTagsControl,
  ComboboxTag,
  ComboboxTagsInput,
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
