"use client"

import React from "react"
import * as Primitive from "@radix-ui/react-menubar"
import { Check, ChevronRight, Circle } from "lucide-react"
import tw from "tailwind-styled-components"

import { cn } from "@/lib/utils"

const Styled = {
  Root: tw(Primitive.Root)`
    flex h-10 items-center space-x-1 rounded-md border 
    border-slate-300 bg-white p-1 
    dark:border-slate-700 
    dark:bg-slate-800
  `,
  Trigger: tw(Primitive.Trigger)`
    flex cursor-default select-none items-center rounded-[0.2rem] 
    py-1.5 px-3 text-sm font-medium outline-none 
    focus:bg-slate-100 
    data-[state=open]:bg-slate-100 
    dark:text-slate-300 
    dark:focus:bg-slate-700 
    dark:data-[state=open]:bg-slate-700
  `,
  SubTrigger: tw(Primitive.SubTrigger)`
    flex cursor-default select-none items-center rounded-sm 
    py-1.5 px-2 text-sm font-medium outline-none 
    focus:bg-slate-100 
    data-[state=open]:bg-slate-100 
    dark:focus:bg-slate-700 
    dark:data-[state=open]:bg-slate-700
  `,
  SubContent: tw(Primitive.SubContent)`
    z-50 min-w-[8rem] overflow-hidden 
    rounded-md border border-slate-100 
    bg-white p-1 shadow-md 
    animate-in slide-in-from-left-1 
    dark:border-slate-700 
    dark:bg-slate-800
  `,
  Content: tw(Primitive.Content)`
    z-50 min-w-[12rem] overflow-hidden rounded-md 
    border border-slate-100 bg-white p-1 
    text-slate-700 shadow-md animate-in slide-in-from-top-1 
    dark:border-slate-800 
    dark:bg-slate-800 dark:text-slate-400
  `,
  Item: tw(Primitive.Item)`
    relative flex cursor-default select-none items-center 
    rounded-sm py-1.5 px-2 text-sm font-medium outline-none 
    focus:bg-slate-100 
    data-[disabled]:pointer-events-none 
    data-[disabled]:opacity-50 
    dark:focus:bg-slate-700
  `,
  CheckboxItem: tw(Primitive.CheckboxItem)`
    relative flex cursor-default select-none items-center 
    rounded-sm py-1.5 pl-8 pr-2 text-sm font-medium outline-none 
    focus:bg-slate-100 
    data-[disabled]:pointer-events-none 
    data-[disabled]:opacity-50 
    dark:focus:bg-slate-700
  `,
  RadioItem: tw(Primitive.RadioItem)`
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
  Separator: tw(Primitive.Separator)`
    -mx-1 my-1 h-px bg-slate-100 dark:bg-slate-700
  `,
}

const MenubarMenu = Primitive.Menu

const MenubarGroup = Primitive.Group

const MenubarPortal = Primitive.Portal

const MenubarSub = Primitive.Sub

const MenubarRadioGroup = Primitive.RadioGroup

const MenubarTrigger = Styled.Trigger

const MenubarSubTrigger = React.forwardRef<
  React.ElementRef<typeof Primitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof Primitive.SubTrigger> & {
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

MenubarSubTrigger.displayName = Primitive.SubTrigger.displayName

const MenubarSubContent = Styled.SubContent

const MenubarContent = React.forwardRef<
  React.ElementRef<typeof Primitive.Content>,
  React.ComponentPropsWithoutRef<typeof Primitive.Content>
>(
  (
    { className, align = "start", alignOffset = -4, sideOffset = 8, ...props },
    ref
  ) => (
    <Primitive.Portal>
      <Styled.Content
        ref={ref}
        align={align}
        alignOffset={alignOffset}
        sideOffset={sideOffset}
        className={cn(className)}
        {...props}
      />
    </Primitive.Portal>
  )
)

MenubarContent.displayName = Primitive.Content.displayName

const MenubarItem = React.forwardRef<
  React.ElementRef<typeof Primitive.Item>,
  React.ComponentPropsWithoutRef<typeof Primitive.Item> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <Styled.Item
    ref={ref}
    className={cn(inset && "pl-8", className)}
    {...props}
  />
))

MenubarItem.displayName = Primitive.Item.displayName

const MenubarCheckboxItem = React.forwardRef<
  React.ElementRef<typeof Primitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof Primitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <Styled.CheckboxItem
    ref={ref}
    className={cn(className)}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <Primitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </Primitive.ItemIndicator>
    </span>
    {children}
  </Styled.CheckboxItem>
))

MenubarCheckboxItem.displayName = Primitive.CheckboxItem.displayName

const MenubarRadioItem = React.forwardRef<
  React.ElementRef<typeof Primitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof Primitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <Styled.RadioItem ref={ref} className={cn(className)} {...props}>
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <Primitive.ItemIndicator>
        <Circle className="h-2 w-2 fill-current" />
      </Primitive.ItemIndicator>
    </span>
    {children}
  </Styled.RadioItem>
))

MenubarRadioItem.displayName = Primitive.RadioItem.displayName

const MenubarLabel = React.forwardRef<
  React.ElementRef<typeof Primitive.Label>,
  React.ComponentPropsWithoutRef<typeof Primitive.Label> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <Primitive.Label
    ref={ref}
    className={cn(
      "px-2 py-1.5 text-sm font-semibold text-slate-900 dark:text-slate-300",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))

MenubarLabel.displayName = Primitive.Label.displayName

const MenubarSeparator = Styled.Separator

MenubarSeparator.displayName = Primitive.Separator.displayName

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
