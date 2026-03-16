"use client"

import * as React from "react"
import { Portal } from "@ark-ui/react/portal"
import { Select as SelectPrimitive } from "@ark-ui/react/select"

import { cn } from "@/examples/ark/lib/utils"
import { ChevronDownIcon, CheckIcon } from "lucide-react"

function Select<T extends SelectPrimitive.CollectionItem>({
  ...props
}: SelectPrimitive.RootProps<T>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />
}

function SelectTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger>) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      className={cn(
        "gap-1.5 rounded-lg border border-input bg-transparent py-2 pr-2 pl-2.5 text-sm transition-colors select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 data-placeholder:text-muted-foreground data-[size=default]:h-8 data-[size=sm]:h-7 data-[size=sm]:rounded-[min(var(--radius-md),10px)] *:data-[slot=select-value]:flex *:data-[slot=select-value]:gap-1.5 dark:bg-input/30 dark:hover:bg-input/50 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Indicator>
        <ChevronDownIcon className="size-4 text-muted-foreground" />
      </SelectPrimitive.Indicator>
    </SelectPrimitive.Trigger>
  )
}

function SelectValue({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ValueText>) {
  return (
    <SelectPrimitive.ValueText
      data-slot="select-value"
      className={cn("flex flex-1 text-left", className)}
      {...props}
    />
  )
}

function SelectContent({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <Portal>
      <SelectPrimitive.Positioner>
        <SelectPrimitive.Content
          data-slot="select-content"
          className={cn(
            "min-w-36 rounded-lg bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
            className
          )}
          {...props}
        />
      </SelectPrimitive.Positioner>
    </Portal>
  )
}

function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn("px-1.5 py-1 text-xs text-muted-foreground", className)}
      {...props}
    />
  )
}

function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "gap-1.5 rounded-md py-1 pr-8 pl-1.5 text-sm focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
        className
      )}
      {...props}
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator className="pointer-events-none absolute right-2 flex size-4 items-center justify-center">
        <CheckIcon
        />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  )
}

function SelectItemGroup({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ItemGroup>) {
  return (
    <SelectPrimitive.ItemGroup
      data-slot="select-item-group"
      className={cn(className)}
      {...props}
    />
  )
}

function SelectItemGroupLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ItemGroupLabel>) {
  return (
    <SelectPrimitive.ItemGroupLabel
      data-slot="select-item-group-label"
      className={cn(className)}
      {...props}
    />
  )
}

function SelectSeparator({ className }: { className?: string }) {
  return (
    <div
      data-slot="select-separator"
      className={cn("-mx-1 my-1 h-px bg-border", className)}
    />
  )
}

export {
  Select,
  SelectContent,
  SelectItem,
  SelectItemGroup,
  SelectItemGroupLabel,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}
