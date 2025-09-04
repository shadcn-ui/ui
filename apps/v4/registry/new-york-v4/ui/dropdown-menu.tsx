"use client"

import * as React from "react"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react"

import { cn } from "@/lib/utils"

type DropdownMenuProps = React.ComponentProps<typeof DropdownMenuPrimitive.Root>

function DropdownMenu({ ...props }: DropdownMenuProps) {
  return <DropdownMenuPrimitive.Root data-slot="dropdown-menu" {...props} />
}

type DropdownMenuPortalProps = React.ComponentProps<
  typeof DropdownMenuPrimitive.Portal
>

function DropdownMenuPortal({ ...props }: DropdownMenuPortalProps) {
  return (
    <DropdownMenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />
  )
}

type DropdownMenuTriggerProps = React.ComponentProps<
  typeof DropdownMenuPrimitive.Trigger
>

function DropdownMenuTrigger({ ...props }: DropdownMenuTriggerProps) {
  return (
    <DropdownMenuPrimitive.Trigger
      data-slot="dropdown-menu-trigger"
      {...props}
    />
  )
}

type DropdownMenuContentProps = React.ComponentProps<
  typeof DropdownMenuPrimitive.Content
>

function DropdownMenuContent({
  className,
  sideOffset = 4,
  ...props
}: DropdownMenuContentProps) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        data-slot="dropdown-menu-content"
        sideOffset={sideOffset}
        className={cn(
          "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 max-h-(--radix-dropdown-menu-content-available-height) min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md",
          className
        )}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  )
}

type DropdownMenuGroupProps = React.ComponentProps<
  typeof DropdownMenuPrimitive.Group
>

function DropdownMenuGroup({ ...props }: DropdownMenuGroupProps) {
  return (
    <DropdownMenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />
  )
}

type DropdownMenuItemProps = React.ComponentProps<
  typeof DropdownMenuPrimitive.Item
> & {
  inset?: boolean
  variant?: "default" | "destructive"
}

function DropdownMenuItem({
  className,
  inset,
  variant = "default",
  ...props
}: DropdownMenuItemProps) {
  return (
    <DropdownMenuPrimitive.Item
      data-slot="dropdown-menu-item"
      data-inset={inset}
      data-variant={variant}
      className={cn(
        "focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  )
}

type DropdownMenuCheckboxItemProps = React.ComponentProps<
  typeof DropdownMenuPrimitive.CheckboxItem
>

function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  ...props
}: DropdownMenuCheckboxItemProps) {
  return (
    <DropdownMenuPrimitive.CheckboxItem
      data-slot="dropdown-menu-checkbox-item"
      className={cn(
        "focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      checked={checked}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <CheckIcon className="size-4" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.CheckboxItem>
  )
}

type DropdownMenuRadioGroupProps = React.ComponentProps<
  typeof DropdownMenuPrimitive.RadioGroup
>

function DropdownMenuRadioGroup({ ...props }: DropdownMenuRadioGroupProps) {
  return (
    <DropdownMenuPrimitive.RadioGroup
      data-slot="dropdown-menu-radio-group"
      {...props}
    />
  )
}

type DropdownMenuRadioItemProps = React.ComponentProps<
  typeof DropdownMenuPrimitive.RadioItem
>

function DropdownMenuRadioItem({
  className,
  children,
  ...props
}: DropdownMenuRadioItemProps) {
  return (
    <DropdownMenuPrimitive.RadioItem
      data-slot="dropdown-menu-radio-item"
      className={cn(
        "focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <CircleIcon className="size-2 fill-current" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.RadioItem>
  )
}

type DropdownMenuLabelProps = React.ComponentProps<
  typeof DropdownMenuPrimitive.Label
> & {
  inset?: boolean
}

function DropdownMenuLabel({
  className,
  inset,
  ...props
}: DropdownMenuLabelProps) {
  return (
    <DropdownMenuPrimitive.Label
      data-slot="dropdown-menu-label"
      data-inset={inset}
      className={cn(
        "px-2 py-1.5 text-sm font-medium data-[inset]:pl-8",
        className
      )}
      {...props}
    />
  )
}

type DropdownMenuSeparatorProps = React.ComponentProps<
  typeof DropdownMenuPrimitive.Separator
>

function DropdownMenuSeparator({
  className,
  ...props
}: DropdownMenuSeparatorProps) {
  return (
    <DropdownMenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
      className={cn("bg-border -mx-1 my-1 h-px", className)}
      {...props}
    />
  )
}

type DropdownMenuShortcutProps = React.ComponentProps<"span">

function DropdownMenuShortcut({
  className,
  ...props
}: DropdownMenuShortcutProps) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={cn(
        "text-muted-foreground ml-auto text-xs tracking-widest",
        className
      )}
      {...props}
    />
  )
}

type DropdownMenuSubProps = React.ComponentProps<
  typeof DropdownMenuPrimitive.Sub
>

function DropdownMenuSub({ ...props }: DropdownMenuSubProps) {
  return <DropdownMenuPrimitive.Sub data-slot="dropdown-menu-sub" {...props} />
}

type DropdownMenuSubTriggerProps = React.ComponentProps<
  typeof DropdownMenuPrimitive.SubTrigger
> & {
  inset?: boolean
}

function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: DropdownMenuSubTriggerProps) {
  return (
    <DropdownMenuPrimitive.SubTrigger
      data-slot="dropdown-menu-sub-trigger"
      data-inset={inset}
      className={cn(
        "focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[inset]:pl-8",
        className
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ml-auto size-4" />
    </DropdownMenuPrimitive.SubTrigger>
  )
}

type DropdownMenuSubContentProps = React.ComponentProps<
  typeof DropdownMenuPrimitive.SubContent
>

function DropdownMenuSubContent({
  className,
  ...props
}: DropdownMenuSubContentProps) {
  return (
    <DropdownMenuPrimitive.SubContent
      data-slot="dropdown-menu-sub-content"
      className={cn(
        "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-hidden rounded-md border p-1 shadow-lg",
        className
      )}
      {...props}
    />
  )
}

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
}

export type {
  DropdownMenuProps,
  DropdownMenuPortalProps,
  DropdownMenuTriggerProps,
  DropdownMenuContentProps,
  DropdownMenuGroupProps,
  DropdownMenuItemProps,
  DropdownMenuCheckboxItemProps,
  DropdownMenuRadioGroupProps,
  DropdownMenuRadioItemProps,
  DropdownMenuLabelProps,
  DropdownMenuSeparatorProps,
  DropdownMenuShortcutProps,
  DropdownMenuSubProps,
  DropdownMenuSubTriggerProps,
  DropdownMenuSubContentProps,
}
