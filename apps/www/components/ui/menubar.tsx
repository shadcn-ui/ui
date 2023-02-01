"use client"

import * as React from "react"
import * as MenuBarPrimitive from "@radix-ui/react-menubar"
import { Check, ChevronRight, Circle } from "lucide-react"
import tw from "tailwind-styled-components"

import { cn } from "@/lib/utils"

const Styled = {
  Root: tw(MenuBarPrimitive.Root)`
    flex h-10 items-center space-x-1 rounded-md border 
    border-slate-300 bg-white p-1 
    dark:border-slate-700 
    dark:bg-slate-800
  `,
  Trigger: tw(MenuBarPrimitive.Trigger)`
    flex cursor-default select-none items-center rounded-[0.2rem] 
    py-1.5 px-3 text-sm font-medium outline-none 
    focus:bg-slate-100 
    data-[state=open]:bg-slate-100 
    dark:text-slate-300 
    dark:focus:bg-slate-700 
    dark:data-[state=open]:bg-slate-700
  `,
  SubTrigger: tw(MenuBarPrimitive.SubTrigger)`
    flex cursor-default select-none items-center rounded-sm 
    py-1.5 px-2 text-sm font-medium outline-none 
    focus:bg-slate-100 
    data-[state=open]:bg-slate-100 
    dark:focus:bg-slate-700 
    dark:data-[state=open]:bg-slate-700
  `,
  SubContent: tw(MenuBarPrimitive.SubContent)`
    z-50 min-w-[8rem] overflow-hidden 
    rounded-md border border-slate-100 
    bg-white p-1 shadow-md 
    animate-in slide-in-from-left-1 
    dark:border-slate-700 
    dark:bg-slate-800
  `,
  Content: tw(MenuBarPrimitive.Content)`
    z-50 min-w-[12rem] overflow-hidden rounded-md 
    border border-slate-100 bg-white p-1 
    text-slate-700 shadow-md animate-in slide-in-from-top-1 
    dark:border-slate-800 
    dark:bg-slate-800 dark:text-slate-400
  `,
  Item: tw(MenuBarPrimitive.Item)`
    relative flex cursor-default select-none items-center 
    rounded-sm py-1.5 px-2 text-sm font-medium outline-none 
    focus:bg-slate-100 
    data-[disabled]:pointer-events-none 
    data-[disabled]:opacity-50 
    dark:focus:bg-slate-700
  `,
  CheckboxItem: tw(MenuBarPrimitive.CheckboxItem)`
    relative flex cursor-default select-none items-center 
    rounded-sm py-1.5 pl-8 pr-2 text-sm font-medium outline-none 
    focus:bg-slate-100 
    data-[disabled]:pointer-events-none 
    data-[disabled]:opacity-50 
    dark:focus:bg-slate-700
  `,
  RadioItem: tw(MenuBarPrimitive.RadioItem)`
    relative flex cursor-default select-none items-center 
    rounded-sm py-1.5 pl-8 pr-2 text-sm font-medium outline-none 
    focus:bg-slate-100 
    data-[disabled]:pointer-events-none 
    data-[disabled]:opacity-50 
    dark:focus:bg-slate-700
  `,
  Shortcut: tw.span`
    ml-auto text-xs tracking-widest text-slate-500
  `,
  Separator: tw(MenuBarPrimitive.Separator)`
    -mx-1 my-1 h-px bg-slate-100 dark:bg-slate-700
  `,
}

const MenubarMenu = MenuBarPrimitive.Menu

const MenubarGroup = MenuBarPrimitive.Group

const MenubarPortal = MenuBarPrimitive.Portal

const MenubarSub = MenuBarPrimitive.Sub

const MenubarRadioGroup = MenuBarPrimitive.RadioGroup

const MenubarTrigger = Styled.Trigger

const MenubarSubTrigger = React.forwardRef<
  React.ElementRef<typeof MenuBarPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof MenuBarPrimitive.SubTrigger> & {
    inset?: boolean
  }
>(({ className, inset, children, ...props }, ref) => (
  <Styled.SubTrigger
    ref={ref}
    className={cn(inset && "pl-8", className)}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto h-4 w-4" />
  </Styled.SubTrigger>
))

MenubarSubTrigger.displayName = MenuBarPrimitive.SubTrigger.displayName

const MenubarSubContent = Styled.SubContent

const MenubarContent = React.forwardRef<
  React.ElementRef<typeof MenuBarPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof MenuBarPrimitive.Content>
>(
  (
    { className, align = "start", alignOffset = -4, sideOffset = 8, ...props },
    ref
  ) => (
    <MenuBarPrimitive.Portal>
      <Styled.Content
        ref={ref}
        align={align}
        alignOffset={alignOffset}
        sideOffset={sideOffset}
        className={cn(className)}
        {...props}
      />
    </MenuBarPrimitive.Portal>
  )
)

MenubarContent.displayName = MenuBarPrimitive.Content.displayName

const MenubarItem = React.forwardRef<
  React.ElementRef<typeof MenuBarPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof MenuBarPrimitive.Item> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <Styled.Item
    ref={ref}
    className={cn(inset && "pl-8", className)}
    {...props}
  />
))

MenubarItem.displayName = MenuBarPrimitive.Item.displayName

const MenubarCheckboxItem = React.forwardRef<
  React.ElementRef<typeof MenuBarPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof MenuBarPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <Styled.CheckboxItem
    ref={ref}
    className={cn(className)}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <MenuBarPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </MenuBarPrimitive.ItemIndicator>
    </span>
    {children}
  </Styled.CheckboxItem>
))

MenubarCheckboxItem.displayName = MenuBarPrimitive.CheckboxItem.displayName

const MenubarRadioItem = React.forwardRef<
  React.ElementRef<typeof MenuBarPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof MenuBarPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <Styled.RadioItem ref={ref} className={cn(className)} {...props}>
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <MenuBarPrimitive.ItemIndicator>
        <Circle className="h-2 w-2 fill-current" />
      </MenuBarPrimitive.ItemIndicator>
    </span>
    {children}
  </Styled.RadioItem>
))

MenubarRadioItem.displayName = MenuBarPrimitive.RadioItem.displayName

const MenubarLabel = React.forwardRef<
  React.ElementRef<typeof MenuBarPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof MenuBarPrimitive.Label> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <MenuBarPrimitive.Label
    ref={ref}
    className={cn(
      "px-2 py-1.5 text-sm font-semibold text-slate-900 dark:text-slate-300",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))

MenubarLabel.displayName = MenuBarPrimitive.Label.displayName

const MenubarSeparator = Styled.Separator

MenubarSeparator.displayName = MenuBarPrimitive.Separator.displayName

const MenubarShortcut = Styled.Shortcut

MenubarShortcut.displayName = "MenubarShortcut"

const Menubar = Styled.Root

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
