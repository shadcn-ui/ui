"use client"

import * as React from "react"
import { Menu as MenuPrimitive } from "@ark-ui/react/menu"
import { Portal } from "@ark-ui/react/portal"

import { cn } from "@/registry/bases/ark/lib/utils"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

function DropdownMenu({
  ...props
}: React.ComponentProps<typeof MenuPrimitive.Root>) {
  return <MenuPrimitive.Root data-slot="dropdown-menu" {...props} />
}

function DropdownMenuTrigger({
  ...props
}: React.ComponentProps<typeof MenuPrimitive.Trigger>) {
  return <MenuPrimitive.Trigger data-slot="dropdown-menu-trigger" {...props} />
}

function DropdownMenuContent({
  className,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.Content>) {
  return (
    <Portal>
      <MenuPrimitive.Positioner>
        <MenuPrimitive.Content
          data-slot="dropdown-menu-content"
          className={cn("cn-dropdown-menu-content", className)}
          {...props}
        />
      </MenuPrimitive.Positioner>
    </Portal>
  )
}

function DropdownMenuItem({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.Item> & {
  inset?: boolean
}) {
  return (
    <MenuPrimitive.Item
      data-slot="dropdown-menu-item"
      data-inset={inset}
      className={cn("cn-dropdown-menu-item", className)}
      {...props}
    />
  )
}

function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.CheckboxItem>) {
  return (
    <MenuPrimitive.CheckboxItem
      data-slot="dropdown-menu-checkbox-item"
      className={cn("cn-dropdown-menu-checkbox-item", className)}
      checked={checked}
      {...props}
    >
      <MenuPrimitive.ItemIndicator className="cn-dropdown-menu-item-indicator">
        <IconPlaceholder
          lucide="CheckIcon"
          tabler="IconCheck"
          hugeicons="Tick02Icon"
          phosphor="CheckIcon"
          remixicon="RiCheckLine"
        />
      </MenuPrimitive.ItemIndicator>
      {children}
    </MenuPrimitive.CheckboxItem>
  )
}

function DropdownMenuRadioGroup({
  ...props
}: React.ComponentProps<typeof MenuPrimitive.RadioItemGroup>) {
  return (
    <MenuPrimitive.RadioItemGroup
      data-slot="dropdown-menu-radio-group"
      {...props}
    />
  )
}

function DropdownMenuRadioItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.RadioItem>) {
  return (
    <MenuPrimitive.RadioItem
      data-slot="dropdown-menu-radio-item"
      className={cn("cn-dropdown-menu-radio-item", className)}
      {...props}
    >
      <MenuPrimitive.ItemIndicator className="cn-dropdown-menu-item-indicator">
        <IconPlaceholder
          lucide="CircleIcon"
          tabler="IconCircleFilled"
          hugeicons="Circle01Icon"
          phosphor="CircleIcon"
          remixicon="RiCircleFill"
          className="size-2 fill-current"
        />
      </MenuPrimitive.ItemIndicator>
      {children}
    </MenuPrimitive.RadioItem>
  )
}

function DropdownMenuLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.ItemGroupLabel> & {
  inset?: boolean
}) {
  return (
    <MenuPrimitive.ItemGroupLabel
      data-slot="dropdown-menu-label"
      data-inset={inset}
      className={cn("cn-dropdown-menu-label", className)}
      {...props}
    />
  )
}

function DropdownMenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.Separator>) {
  return (
    <MenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
      className={cn("cn-dropdown-menu-separator", className)}
      {...props}
    />
  )
}

function DropdownMenuShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={cn("cn-dropdown-menu-shortcut", className)}
      {...props}
    />
  )
}

function DropdownMenuGroup({
  ...props
}: React.ComponentProps<typeof MenuPrimitive.ItemGroup>) {
  return <MenuPrimitive.ItemGroup data-slot="dropdown-menu-group" {...props} />
}

function DropdownMenuSub({
  ...props
}: React.ComponentProps<typeof MenuPrimitive.Root>) {
  return <MenuPrimitive.Root data-slot="dropdown-menu-sub" {...props} />
}

function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.TriggerItem> & {
  inset?: boolean
}) {
  return (
    <MenuPrimitive.TriggerItem
      data-slot="dropdown-menu-sub-trigger"
      data-inset={inset}
      className={cn("cn-dropdown-menu-sub-trigger", className)}
      {...props}
    >
      {children}
      <IconPlaceholder
        lucide="ChevronRightIcon"
        tabler="IconChevronRight"
        hugeicons="ArrowRight01Icon"
        phosphor="CaretRightIcon"
        remixicon="RiArrowRightSLine"
        className="cn-dropdown-menu-sub-trigger-icon"
      />
    </MenuPrimitive.TriggerItem>
  )
}

function DropdownMenuSubContent({
  className,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.Content>) {
  return (
    <Portal>
      <MenuPrimitive.Positioner>
        <MenuPrimitive.Content
          data-slot="dropdown-menu-sub-content"
          className={cn("cn-dropdown-menu-sub-content", className)}
          {...props}
        />
      </MenuPrimitive.Positioner>
    </Portal>
  )
}

export {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
}
