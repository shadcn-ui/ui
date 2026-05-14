"use client"

import * as React from "react"
import { cn } from "@/examples/ark/lib/utils"
import { ark } from "@ark-ui/react/factory"
import { Menu as MenuPrimitive } from "@ark-ui/react/menu"
import { Portal } from "@ark-ui/react/portal"
import { CheckIcon, ChevronRightIcon } from "lucide-react"

function ContextMenu({
  ...props
}: React.ComponentProps<typeof MenuPrimitive.Root>) {
  return <MenuPrimitive.Root data-slot="context-menu" {...props} />
}

function ContextMenuTrigger({
  className,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.ContextTrigger>) {
  return (
    <MenuPrimitive.ContextTrigger
      data-slot="context-menu-trigger"
      className={cn("select-none", className)}
      {...props}
    />
  )
}

function ContextMenuGroup({
  ...props
}: React.ComponentProps<typeof MenuPrimitive.ItemGroup>) {
  return <MenuPrimitive.ItemGroup data-slot="context-menu-group" {...props} />
}

function ContextMenuPortal({ children }: { children: React.ReactNode }) {
  return <Portal>{children}</Portal>
}

function ContextMenuSub({
  ...props
}: React.ComponentProps<typeof MenuPrimitive.Root>) {
  return <MenuPrimitive.Root data-slot="context-menu-sub" {...props} />
}

function ContextMenuRadioGroup({
  ...props
}: React.ComponentProps<typeof MenuPrimitive.RadioItemGroup>) {
  return (
    <MenuPrimitive.RadioItemGroup
      data-slot="context-menu-radio-group"
      {...props}
    />
  )
}

function ContextMenuContent({
  className,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.Content>) {
  return (
    <Portal>
      <MenuPrimitive.Positioner>
        <MenuPrimitive.Content
          data-slot="context-menu-content"
          className={cn(
            "cn-menu-target z-50 min-w-36 overflow-x-hidden overflow-y-auto rounded-lg bg-popover p-1 text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
            className
          )}
          {...props}
        />
      </MenuPrimitive.Positioner>
    </Portal>
  )
}

function ContextMenuItem({
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
      data-slot="context-menu-item"
      data-inset={inset}
      data-variant={variant}
      className={cn(
        "group/context-menu-item relative flex cursor-default items-center gap-1.5 rounded-md px-1.5 py-1 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-inset:pl-7 data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:focus:text-destructive dark:data-[variant=destructive]:focus:bg-destructive/20 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 focus:*:[svg]:text-accent-foreground data-[variant=destructive]:*:[svg]:text-destructive",
        className
      )}
      {...props}
    />
  )
}

function ContextMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.TriggerItem> & {
  inset?: boolean
}) {
  return (
    <MenuPrimitive.TriggerItem
      data-slot="context-menu-sub-trigger"
      data-inset={inset}
      className={cn(
        "flex cursor-default items-center gap-1.5 rounded-md px-1.5 py-1 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-inset:pl-7 data-open:bg-accent data-open:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon className="cn-rtl-flip ml-auto" />
    </MenuPrimitive.TriggerItem>
  )
}

function ContextMenuSubContent({
  className,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.Content>) {
  return (
    <Portal>
      <MenuPrimitive.Positioner>
        <MenuPrimitive.Content
          data-slot="context-menu-sub-content"
          className={cn(
            "cn-menu-target z-50 min-w-32 overflow-hidden rounded-lg border bg-popover p-1 text-popover-foreground shadow-lg duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
            className
          )}
          {...props}
        />
      </MenuPrimitive.Positioner>
    </Portal>
  )
}

function ContextMenuCheckboxItem({
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
      data-slot="context-menu-checkbox-item"
      data-inset={inset}
      className={cn(
        "relative flex cursor-default items-center gap-1.5 rounded-md py-1 pr-8 pl-1.5 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-inset:pl-7 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      checked={checked}
      {...props}
    >
      <ark.span className="pointer-events-none absolute right-2">
        <MenuPrimitive.ItemIndicator>
          <CheckIcon />
        </MenuPrimitive.ItemIndicator>
      </ark.span>
      {children}
    </MenuPrimitive.CheckboxItem>
  )
}

function ContextMenuRadioItem({
  className,
  children,
  inset,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.RadioItem> & {
  inset?: boolean
}) {
  return (
    <MenuPrimitive.RadioItem
      data-slot="context-menu-radio-item"
      data-inset={inset}
      className={cn(
        "relative flex cursor-default items-center gap-1.5 rounded-md py-1 pr-8 pl-1.5 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-inset:pl-7 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <ark.span className="pointer-events-none absolute right-2">
        <MenuPrimitive.ItemIndicator>
          <CheckIcon />
        </MenuPrimitive.ItemIndicator>
      </ark.span>
      {children}
    </MenuPrimitive.RadioItem>
  )
}

function ContextMenuLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.ItemGroupLabel> & {
  inset?: boolean
}) {
  return (
    <MenuPrimitive.ItemGroupLabel
      data-slot="context-menu-label"
      data-inset={inset}
      className={cn(
        "px-1.5 py-1 text-xs font-medium text-muted-foreground data-inset:pl-7",
        className
      )}
      {...props}
    />
  )
}

function ContextMenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.Separator>) {
  return (
    <MenuPrimitive.Separator
      data-slot="context-menu-separator"
      className={cn("-mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  )
}

function ContextMenuShortcut({
  className,
  ...props
}: React.ComponentProps<typeof ark.span>) {
  return (
    <ark.span
      data-slot="context-menu-shortcut"
      className={cn(
        "ml-auto text-xs tracking-widest text-muted-foreground group-focus/context-menu-item:text-accent-foreground",
        className
      )}
      {...props}
    />
  )
}

function ContextMenuArrow({
  className,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.Arrow>) {
  return (
    <MenuPrimitive.Arrow
      data-slot="context-menu-arrow"
      className={cn(className)}
      {...props}
    >
      <MenuPrimitive.ArrowTip className="" />
    </MenuPrimitive.Arrow>
  )
}

function ContextMenuItemText({
  className,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.ItemText>) {
  return (
    <MenuPrimitive.ItemText
      data-slot="context-menu-item-text"
      className={cn(className)}
      {...props}
    />
  )
}

// --- Context & RootProvider re-exports ---

const ContextMenuContext = MenuPrimitive.Context
const ContextMenuRootProvider = MenuPrimitive.RootProvider

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
  ContextMenuArrow,
  ContextMenuItemText,
  ContextMenuContext,
  ContextMenuRootProvider,
}

export { useMenu, useMenuContext } from "@ark-ui/react/menu"
