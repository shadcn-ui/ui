"use client"

import * as React from "react"
import * as MenubarPrimitive from "@radix-ui/react-menubar"
import { Check, ChevronRight, Circle } from "lucide-react"

import { cn } from "@/lib/utils"

function MenubarMenu({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Menu>) {
  return <MenubarPrimitive.Menu {...props} />
}

function MenubarGroup({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Group>) {
  return <MenubarPrimitive.Group {...props} />
}

function MenubarPortal({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Portal>) {
  return <MenubarPrimitive.Portal {...props} />
}

function MenubarRadioGroup({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.RadioGroup>) {
  return <MenubarPrimitive.RadioGroup {...props} />
}

function MenubarSub({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Sub>) {
  return <MenubarPrimitive.Sub data-slot="menubar-sub" {...props} />
}

const Menubar = (
  {
    ref,
    className,
    ...props
  }: React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Root> & {
    ref: React.RefObject<React.ElementRef<typeof MenubarPrimitive.Root>>;
  }
) => (<MenubarPrimitive.Root
  ref={ref}
  className={cn(
    "flex h-9 items-center space-x-1 rounded-md border bg-background p-1 shadow-sm",
    className
  )}
  {...props}
/>)
Menubar.displayName = MenubarPrimitive.Root.displayName

const MenubarTrigger = (
  {
    ref,
    className,
    ...props
  }: React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Trigger> & {
    ref: React.RefObject<React.ElementRef<typeof MenubarPrimitive.Trigger>>;
  }
) => (<MenubarPrimitive.Trigger
  ref={ref}
  className={cn(
    "flex cursor-default select-none items-center rounded-sm px-3 py-1 text-sm font-medium outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
    className
  )}
  {...props}
/>)
MenubarTrigger.displayName = MenubarPrimitive.Trigger.displayName

const MenubarSubTrigger = (
  {
    ref,
    className,
    inset,
    children,
    ...props
  }
) => (<MenubarPrimitive.SubTrigger
  ref={ref}
  className={cn(
    "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
    inset && "pl-8",
    className
  )}
  {...props}
>
  {children}
  <ChevronRight className="ml-auto h-4 w-4" />
</MenubarPrimitive.SubTrigger>)
MenubarSubTrigger.displayName = MenubarPrimitive.SubTrigger.displayName

const MenubarSubContent = (
  {
    ref,
    className,
    ...props
  }: React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubContent> & {
    ref: React.RefObject<React.ElementRef<typeof MenubarPrimitive.SubContent>>;
  }
) => (<MenubarPrimitive.SubContent
  ref={ref}
  className={cn(
    "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-menubar-content-transform-origin]",
    className
  )}
  {...props}
/>)
MenubarSubContent.displayName = MenubarPrimitive.SubContent.displayName

const MenubarContent = (
  {
    ref,
    className,
    align = "start",
    alignOffset = -4,
    sideOffset = 8,
    ...props
  }: React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Content> & {
    ref: React.RefObject<React.ElementRef<typeof MenubarPrimitive.Content>>;
  }
) => (<MenubarPrimitive.Portal>
  <MenubarPrimitive.Content
    ref={ref}
    align={align}
    alignOffset={alignOffset}
    sideOffset={sideOffset}
    className={cn(
      "z-50 min-w-[12rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-menubar-content-transform-origin]",
      className
    )}
    {...props}
  />
</MenubarPrimitive.Portal>)
MenubarContent.displayName = MenubarPrimitive.Content.displayName

const MenubarItem = (
  {
    ref,
    className,
    inset,
    ...props
  }
) => (<MenubarPrimitive.Item
  ref={ref}
  className={cn(
    "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
    inset && "pl-8",
    className
  )}
  {...props}
/>)
MenubarItem.displayName = MenubarPrimitive.Item.displayName

const MenubarCheckboxItem = (
  {
    ref,
    className,
    children,
    checked,
    ...props
  }: React.ComponentPropsWithoutRef<typeof MenubarPrimitive.CheckboxItem> & {
    ref: React.RefObject<React.ElementRef<typeof MenubarPrimitive.CheckboxItem>>;
  }
) => (<MenubarPrimitive.CheckboxItem
  ref={ref}
  className={cn(
    "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
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
</MenubarPrimitive.CheckboxItem>)
MenubarCheckboxItem.displayName = MenubarPrimitive.CheckboxItem.displayName

const MenubarRadioItem = (
  {
    ref,
    className,
    children,
    ...props
  }: React.ComponentPropsWithoutRef<typeof MenubarPrimitive.RadioItem> & {
    ref: React.RefObject<React.ElementRef<typeof MenubarPrimitive.RadioItem>>;
  }
) => (<MenubarPrimitive.RadioItem
  ref={ref}
  className={cn(
    "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
    className
  )}
  {...props}
>
  <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
    <MenubarPrimitive.ItemIndicator>
      <Circle className="h-4 w-4 fill-current" />
    </MenubarPrimitive.ItemIndicator>
  </span>
  {children}
</MenubarPrimitive.RadioItem>)
MenubarRadioItem.displayName = MenubarPrimitive.RadioItem.displayName

const MenubarLabel = (
  {
    ref,
    className,
    inset,
    ...props
  }
) => (<MenubarPrimitive.Label
  ref={ref}
  className={cn(
    "px-2 py-1.5 text-sm font-semibold",
    inset && "pl-8",
    className
  )}
  {...props}
/>)
MenubarLabel.displayName = MenubarPrimitive.Label.displayName

const MenubarSeparator = (
  {
    ref,
    className,
    ...props
  }: React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Separator> & {
    ref: React.RefObject<React.ElementRef<typeof MenubarPrimitive.Separator>>;
  }
) => (<MenubarPrimitive.Separator
  ref={ref}
  className={cn("-mx-1 my-1 h-px bg-muted", className)}
  {...props}
/>)
MenubarSeparator.displayName = MenubarPrimitive.Separator.displayName

const MenubarShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn(
        "ml-auto text-xs tracking-widest text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}
MenubarShortcut.displayname = "MenubarShortcut"

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
