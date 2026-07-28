"use client"

import * as React from "react"
import { ark } from "@ark-ui/react/factory"
import { Menu as MenuPrimitive } from "@ark-ui/react/menu"
import { Portal } from "@ark-ui/react/portal"

import { cn } from "@/registry/bases/ark/lib/utils"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

function Menubar({
  className,
  children,
  ...props
}: React.ComponentProps<typeof ark.div>) {
  return (
    <ark.div
      data-slot="menubar"
      className={cn("cn-menubar flex items-center", className)}
      {...props}
    >
      {children}
    </ark.div>
  )
}

function MenubarMenu({
  ...props
}: React.ComponentProps<typeof MenuPrimitive.Root>) {
  return <MenuPrimitive.Root data-slot="menubar-menu" {...props} />
}

function MenubarGroup({
  ...props
}: React.ComponentProps<typeof MenuPrimitive.ItemGroup>) {
  return <MenuPrimitive.ItemGroup data-slot="menubar-group" {...props} />
}

function MenubarPortal({ children }: { children: React.ReactNode }) {
  return <Portal>{children}</Portal>
}

function MenubarRadioGroup({
  ...props
}: React.ComponentProps<typeof MenuPrimitive.RadioItemGroup>) {
  return (
    <MenuPrimitive.RadioItemGroup
      data-slot="menubar-radio-group"
      {...props}
    />
  )
}

function MenubarTrigger({
  className,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.Trigger>) {
  return (
    <MenuPrimitive.Trigger
      data-slot="menubar-trigger"
      className={cn(
        "cn-menubar-trigger flex items-center outline-hidden select-none",
        className
      )}
      {...props}
    />
  )
}

function MenubarContent({
  className,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.Content>) {
  return (
    <Portal>
      <MenuPrimitive.Positioner>
        <MenuPrimitive.Content
          data-slot="menubar-content"
          className={cn(
            "cn-menubar-content cn-menu-target z-50 overflow-hidden",
            className
          )}
          {...props}
        />
      </MenuPrimitive.Positioner>
    </Portal>
  )
}

function MenubarItem({
  className,
  inset,
  variant = "default",
  ...props
}: React.ComponentProps<typeof MenuPrimitive.Item> & {
  inset?: boolean
  variant?: "default" | "destructive"
}) {
  return (
    <MenuPrimitive.Item
      data-slot="menubar-item"
      data-inset={inset}
      data-variant={variant}
      className={cn(
        "cn-menubar-item group/menubar-item relative flex cursor-default items-center outline-hidden select-none data-disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className
      )}
      {...props}
    />
  )
}

function MenubarCheckboxItem({
  className,
  children,
  checked,
  inset,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.CheckboxItem> & {
  inset?: boolean
}) {
  return (
    <MenuPrimitive.CheckboxItem
      data-slot="menubar-checkbox-item"
      data-inset={inset}
      className={cn(
        "cn-menubar-checkbox-item relative flex cursor-default items-center outline-hidden select-none data-disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className
      )}
      checked={checked}
      {...props}
    >
      <ark.span className="cn-menubar-checkbox-item-indicator pointer-events-none absolute flex items-center justify-center">
        <MenuPrimitive.ItemIndicator>
          <IconPlaceholder
            lucide="CheckIcon"
            tabler="IconCheck"
            hugeicons="Tick02Icon"
            phosphor="CheckIcon"
            remixicon="RiCheckLine"
          />
        </MenuPrimitive.ItemIndicator>
      </ark.span>
      {children}
    </MenuPrimitive.CheckboxItem>
  )
}

function MenubarRadioItem({
  className,
  children,
  inset,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.RadioItem> & {
  inset?: boolean
}) {
  return (
    <MenuPrimitive.RadioItem
      data-slot="menubar-radio-item"
      data-inset={inset}
      className={cn(
        "cn-menubar-radio-item relative flex cursor-default items-center outline-hidden select-none data-disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className
      )}
      {...props}
    >
      <ark.span className="cn-menubar-radio-item-indicator pointer-events-none absolute flex items-center justify-center">
        <MenuPrimitive.ItemIndicator>
          <IconPlaceholder
            lucide="CheckIcon"
            tabler="IconCheck"
            hugeicons="Tick02Icon"
            phosphor="CheckIcon"
            remixicon="RiCheckLine"
          />
        </MenuPrimitive.ItemIndicator>
      </ark.span>
      {children}
    </MenuPrimitive.RadioItem>
  )
}

function MenubarLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.ItemGroupLabel> & {
  inset?: boolean
}) {
  return (
    <MenuPrimitive.ItemGroupLabel
      data-slot="menubar-label"
      data-inset={inset}
      className={cn("cn-menubar-label", className)}
      {...props}
    />
  )
}

function MenubarSeparator({
  className,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.Separator>) {
  return (
    <MenuPrimitive.Separator
      data-slot="menubar-separator"
      className={cn("cn-menubar-separator -mx-1 my-1 h-px", className)}
      {...props}
    />
  )
}

function MenubarShortcut({
  className,
  ...props
}: React.ComponentProps<typeof ark.span>) {
  return (
    <ark.span
      data-slot="menubar-shortcut"
      className={cn("cn-menubar-shortcut ml-auto", className)}
      {...props}
    />
  )
}

function MenubarSub({
  ...props
}: React.ComponentProps<typeof MenuPrimitive.Root>) {
  return <MenuPrimitive.Root data-slot="menubar-sub" {...props} />
}

function MenubarSubTrigger({
  className,
  inset,
  children,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.TriggerItem> & {
  inset?: boolean
}) {
  return (
    <MenuPrimitive.TriggerItem
      data-slot="menubar-sub-trigger"
      data-inset={inset}
      className={cn(
        "cn-menubar-sub-trigger flex cursor-default items-center outline-none select-none",
        className
      )}
      {...props}
    >
      {children}
      <IconPlaceholder
        lucide="ChevronRightIcon"
        tabler="IconChevronRight"
        hugeicons="ArrowRight01Icon"
        phosphor="CaretRightIcon"
        remixicon="RiArrowRightSLine"
        className="cn-rtl-flip ml-auto size-4"
      />
    </MenuPrimitive.TriggerItem>
  )
}

function MenubarSubContent({
  className,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.Content>) {
  return (
    <Portal>
      <MenuPrimitive.Positioner>
        <MenuPrimitive.Content
          data-slot="menubar-sub-content"
          className={cn(
            "cn-menubar-sub-content cn-menu-target z-50 overflow-hidden",
            className
          )}
          {...props}
        />
      </MenuPrimitive.Positioner>
    </Portal>
  )
}

function MenubarArrow({
  className,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.Arrow>) {
  return (
    <MenuPrimitive.Arrow
      data-slot="menubar-arrow"
      className={cn("cn-menubar-arrow", className)}
      {...props}
    >
      <MenuPrimitive.ArrowTip className="cn-menubar-arrow-tip" />
    </MenuPrimitive.Arrow>
  )
}

function MenubarItemText({
  className,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.ItemText>) {
  return (
    <MenuPrimitive.ItemText
      data-slot="menubar-item-text"
      className={cn("cn-menubar-item-text", className)}
      {...props}
    />
  )
}

// --- Context & RootProvider re-exports ---

const MenubarContext = MenuPrimitive.Context
const MenubarRootProvider = MenuPrimitive.RootProvider

export {
  Menubar,
  MenubarPortal,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarGroup,
  MenubarSeparator,
  MenubarLabel,
  MenubarItem,
  MenubarShortcut,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
  MenubarArrow,
  MenubarItemText,
  MenubarContext,
  MenubarRootProvider,
}

export { useMenu, useMenuContext } from "@ark-ui/react/menu"
