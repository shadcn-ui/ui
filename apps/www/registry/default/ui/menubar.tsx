"use client"

import * as React from "react"
import * as MenubarPrimitive from "@radix-ui/react-menubar"
import { Check, ChevronRight, Circle } from "lucide-react"

import { cn } from "@/lib/utils"

const MenubarMenu = MenubarPrimitive.Menu

const MenubarGroup = MenubarPrimitive.Group

const MenubarPortal = MenubarPrimitive.Portal

const MenubarSub = MenubarPrimitive.Sub

const MenubarRadioGroup = MenubarPrimitive.RadioGroup

interface InsetProps {
  inset?: boolean
}

const Menubar: React.FC<React.ComponentProps<typeof MenubarPrimitive.Root>> = ({
  className,
  ...props
}) => (
  <MenubarPrimitive.Root
    className={cn(
      "bg-background flex h-10 items-center space-x-1 rounded-md border p-1",
      className
    )}
    {...props}
  />
)
Menubar.displayName = MenubarPrimitive.Root.displayName

const MenubarTrigger: React.FC<
  React.ComponentProps<typeof MenubarPrimitive.Trigger>
> = ({ className, ...props }) => (
  <MenubarPrimitive.Trigger
    className={cn(
      "focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground flex cursor-default select-none items-center rounded-sm px-3 py-1.5 text-sm font-medium outline-none",
      className
    )}
    {...props}
  />
)
MenubarTrigger.displayName = MenubarPrimitive.Trigger.displayName

const MenubarSubTrigger: React.FC<
  React.ComponentProps<typeof MenubarPrimitive.SubTrigger> & InsetProps
> = ({ className, inset, children, ...props }) => (
  <MenubarPrimitive.SubTrigger
    className={cn(
      "focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
      inset && "pl-8",
      className
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto h-4 w-4" />
  </MenubarPrimitive.SubTrigger>
)
MenubarSubTrigger.displayName = MenubarPrimitive.SubTrigger.displayName

const MenubarSubContent: React.FC<
  React.ComponentProps<typeof MenubarPrimitive.SubContent>
> = ({ className, ...props }) => (
  <MenubarPrimitive.SubContent
    className={cn(
      "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[8rem] overflow-hidden rounded-md border p-1",
      className
    )}
    {...props}
  />
)
MenubarSubContent.displayName = MenubarPrimitive.SubContent.displayName

const MenubarContent: React.FC<
  React.ComponentProps<typeof MenubarPrimitive.Content>
> = ({
  className,
  align = "start",
  alignOffset = -4,
  sideOffset = 8,
  ...props
}) => (
  <MenubarPrimitive.Portal>
    <MenubarPrimitive.Content
      align={align}
      alignOffset={alignOffset}
      sideOffset={sideOffset}
      className={cn(
        "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[12rem] overflow-hidden rounded-md border p-1 shadow-md",
        className
      )}
      {...props}
    />
  </MenubarPrimitive.Portal>
)
MenubarContent.displayName = MenubarPrimitive.Content.displayName

const MenubarItem: React.FC<
  React.ComponentProps<typeof MenubarPrimitive.Item> & InsetProps
> = ({ className, inset, ...props }) => (
  <MenubarPrimitive.Item
    className={cn(
      "focus:bg-accent focus:text-accent-foreground relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      inset && "pl-8",
      className
    )}
    {...props}
  />
)
MenubarItem.displayName = MenubarPrimitive.Item.displayName

const MenubarCheckboxItem: React.FC<
  React.ComponentProps<typeof MenubarPrimitive.CheckboxItem>
> = ({ className, children, checked, ...props }) => (
  <MenubarPrimitive.CheckboxItem
    className={cn(
      "focus:bg-accent focus:text-accent-foreground relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <MenubarPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </MenubarPrimitive.ItemIndicator>
    </span>
    {children}
  </MenubarPrimitive.CheckboxItem>
)
MenubarCheckboxItem.displayName = MenubarPrimitive.CheckboxItem.displayName

const MenubarRadioItem: React.FC<
  React.ComponentProps<typeof MenubarPrimitive.RadioItem>
> = ({ className, children, ...props }) => (
  <MenubarPrimitive.RadioItem
    className={cn(
      "focus:bg-accent focus:text-accent-foreground relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <MenubarPrimitive.ItemIndicator>
        <Circle className="h-2 w-2 fill-current" />
      </MenubarPrimitive.ItemIndicator>
    </span>
    {children}
  </MenubarPrimitive.RadioItem>
)
MenubarRadioItem.displayName = MenubarPrimitive.RadioItem.displayName

const MenubarLabel: React.FC<
  React.ComponentProps<typeof MenubarPrimitive.Label> & InsetProps
> = ({ className, inset, ...props }) => (
  <MenubarPrimitive.Label
    className={cn(
      "px-2 py-1.5 text-sm font-semibold",
      inset && "pl-8",
      className
    )}
    {...props}
  />
)
MenubarLabel.displayName = MenubarPrimitive.Label.displayName

const MenubarSeparator: React.FC<
  React.ComponentProps<typeof MenubarPrimitive.Separator>
> = ({ className, ...props }) => (
  <MenubarPrimitive.Separator
    className={cn("bg-muted -mx-1 my-1 h-px", className)}
    {...props}
  />
)
MenubarSeparator.displayName = MenubarPrimitive.Separator.displayName

const MenubarShortcut: React.FC<React.ComponentProps<"span">> = ({
  className,
  ...props
}) => (
  <span
    className={cn(
      "text-muted-foreground ml-auto text-xs tracking-widest",
      className
    )}
    {...props}
  />
)
MenubarShortcut.displayName = "MenubarShortcut"

export {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarLabel,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarPortal,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarGroup,
  MenubarSub,
  MenubarShortcut,
}
