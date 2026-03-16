"use client"

import * as React from "react"
import { Combobox as ComboboxPrimitive } from "@ark-ui/react/combobox"
import { Portal } from "@ark-ui/react/portal"

import { cn } from "@/registry/bases/ark/lib/utils"
import { Button } from "@/registry/bases/ark/ui/button"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/registry/bases/ark/ui/input-group"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

function Combobox<T extends ComboboxPrimitive.CollectionItem>({
  ...props
}: ComboboxPrimitive.RootProps<T>) {
  return <ComboboxPrimitive.Root data-slot="combobox" {...props} />
}

function ComboboxValue({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="combobox-value"
      className={className}
      {...props}
    />
  )
}

function ComboboxTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.Trigger>) {
  return (
    <ComboboxPrimitive.Trigger
      data-slot="combobox-trigger"
      className={cn("cn-combobox-trigger", className)}
      {...props}
    >
      {children}
      <IconPlaceholder
        lucide="ChevronDownIcon"
        tabler="IconChevronDown"
        hugeicons="ArrowDown01Icon"
        phosphor="CaretDownIcon"
        remixicon="RiArrowDownSLine"
        className="cn-combobox-trigger-icon pointer-events-none"
      />
    </ComboboxPrimitive.Trigger>
  )
}

function ComboboxClear({
  className,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.ClearTrigger>) {
  return (
    <ComboboxPrimitive.ClearTrigger
      data-slot="combobox-clear"
      asChild
      {...props}
    >
      <InputGroupButton
        variant="ghost"
        size="icon-xs"
        className={cn("cn-combobox-clear", className)}
      >
        <IconPlaceholder
          lucide="XIcon"
          tabler="IconX"
          hugeicons="Cancel01Icon"
          phosphor="XIcon"
          remixicon="RiCloseLine"
          className="cn-combobox-clear-icon pointer-events-none"
        />
      </InputGroupButton>
    </ComboboxPrimitive.ClearTrigger>
  )
}

function ComboboxInput({
  className,
  children,
  disabled = false,
  showTrigger = true,
  showClear = false,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.Input> & {
  children?: React.ReactNode
  showTrigger?: boolean
  showClear?: boolean
}) {
  return (
    <ComboboxPrimitive.Control>
      <InputGroup className={cn("cn-combobox-input w-auto", className)}>
        <ComboboxPrimitive.Input
          asChild
          {...props}
        >
          <InputGroupInput disabled={disabled} />
        </ComboboxPrimitive.Input>
        <InputGroupAddon align="inline-end">
          {showTrigger && (
            <InputGroupButton
              size="icon-xs"
              variant="ghost"
              asChild
              data-slot="input-group-button"
              className="group-has-data-[slot=combobox-clear]/input-group:hidden data-pressed:bg-transparent"
              disabled={disabled}
            >
              <ComboboxTrigger />
            </InputGroupButton>
          )}
          {showClear && <ComboboxClear disabled={disabled} />}
        </InputGroupAddon>
        {children}
      </InputGroup>
    </ComboboxPrimitive.Control>
  )
}

function ComboboxContent({
  className,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.Content>) {
  return (
    <Portal>
      <ComboboxPrimitive.Positioner>
        <ComboboxPrimitive.Content
          data-slot="combobox-content"
          className={cn(
            "cn-combobox-content cn-combobox-content-logical cn-menu-target cn-menu-translucent group/combobox-content",
            className
          )}
          {...props}
        />
      </ComboboxPrimitive.Positioner>
    </Portal>
  )
}

function ComboboxList({
  className,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.List>) {
  return (
    <ComboboxPrimitive.List
      data-slot="combobox-list"
      className={cn(
        "cn-combobox-list overflow-y-auto overscroll-contain",
        className
      )}
      {...props}
    />
  )
}

function ComboboxItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.Item>) {
  return (
    <ComboboxPrimitive.Item
      data-slot="combobox-item"
      className={cn(
        "cn-combobox-item relative flex w-full cursor-default items-center outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className
      )}
      {...props}
    >
      <ComboboxPrimitive.ItemText>{children}</ComboboxPrimitive.ItemText>
      <ComboboxPrimitive.ItemIndicator className="cn-combobox-item-indicator">
        <IconPlaceholder
          lucide="CheckIcon"
          tabler="IconCheck"
          hugeicons="Tick02Icon"
          phosphor="CheckIcon"
          remixicon="RiCheckLine"
          className="cn-combobox-item-indicator-icon pointer-events-none"
        />
      </ComboboxPrimitive.ItemIndicator>
    </ComboboxPrimitive.Item>
  )
}

function ComboboxGroup({
  className,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.ItemGroup>) {
  return (
    <ComboboxPrimitive.ItemGroup
      data-slot="combobox-group"
      className={cn("cn-combobox-group", className)}
      {...props}
    />
  )
}

function ComboboxLabel({
  className,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.ItemGroupLabel>) {
  return (
    <ComboboxPrimitive.ItemGroupLabel
      data-slot="combobox-label"
      className={cn("cn-combobox-label", className)}
      {...props}
    />
  )
}

function ComboboxCollection({
  children,
  ...props
}: {
  children: React.ReactNode
  [key: string]: unknown
}) {
  return (
    <div data-slot="combobox-collection" {...props}>
      {children}
    </div>
  )
}

function ComboboxEmpty({
  className,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.Empty>) {
  return (
    <ComboboxPrimitive.Empty
      data-slot="combobox-empty"
      className={cn("cn-combobox-empty", className)}
      {...props}
    />
  )
}

function ComboboxSeparator({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="combobox-separator"
      className={cn("cn-combobox-separator", className)}
      {...props}
    />
  )
}

function ComboboxChips({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="combobox-chips"
      className={cn("cn-combobox-chips", className)}
      {...props}
    >
      {children}
    </div>
  )
}

function ComboboxChip({
  className,
  children,
  showRemove = true,
  value,
  ...props
}: React.ComponentProps<"div"> & {
  showRemove?: boolean
  value?: string
}) {
  return (
    <div
      data-slot="combobox-chip"
      className={cn(
        "cn-combobox-chip has-disabled:pointer-events-none has-disabled:cursor-not-allowed has-disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
      {showRemove && (
        <ComboboxPrimitive.ClearTrigger asChild>
          <Button
            variant="ghost"
            size="icon-xs"
            className="cn-combobox-chip-remove"
            data-slot="combobox-chip-remove"
          >
            <IconPlaceholder
              lucide="XIcon"
              tabler="IconX"
              hugeicons="Cancel01Icon"
              phosphor="XIcon"
              remixicon="RiCloseLine"
              className="cn-combobox-chip-indicator-icon pointer-events-none"
            />
          </Button>
        </ComboboxPrimitive.ClearTrigger>
      )}
    </div>
  )
}

function ComboboxChipsInput({
  className,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.Input>) {
  return (
    <ComboboxPrimitive.Input
      data-slot="combobox-chip-input"
      className={cn(
        "cn-combobox-chip-input min-w-16 flex-1 outline-none",
        className
      )}
      {...props}
    />
  )
}

function useComboboxAnchor() {
  return React.useRef<HTMLDivElement | null>(null)
}

export {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxGroup,
  ComboboxLabel,
  ComboboxCollection,
  ComboboxEmpty,
  ComboboxSeparator,
  ComboboxChips,
  ComboboxChip,
  ComboboxChipsInput,
  ComboboxTrigger,
  ComboboxValue,
  useComboboxAnchor,
  ComboboxClear,
}
