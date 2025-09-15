"use client"

import * as React from "react"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { Check, ChevronRight, Circle } from "lucide-react"

import { cn } from "@/lib/utils"

const DropdownMenu = DropdownMenuPrimitive.Root

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger

const DropdownMenuGroup = DropdownMenuPrimitive.Group

const DropdownMenuPortal = DropdownMenuPrimitive.Portal

const DropdownMenuSub = DropdownMenuPrimitive.Sub

const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup

const DropdownMenuSubTrigger = (
  {
    ref,
    className,
    inset,
    children,
    ...props
  }
) => (<DropdownMenuPrimitive.SubTrigger
  ref={ref}
  className={cn(
    "flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
    inset && "pl-8",
    className
  )}
  {...props}
>
  {children}
  <ChevronRight className="ml-auto" />
</DropdownMenuPrimitive.SubTrigger>)
DropdownMenuSubTrigger.displayName =
  DropdownMenuPrimitive.SubTrigger.displayName

const DropdownMenuSubContent = (
  {
    ref,
    className,
    ...props
  }: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent> & {
    ref: React.RefObject<React.ElementRef<typeof DropdownMenuPrimitive.SubContent>>;
  }
) => (<DropdownMenuPrimitive.SubContent
  ref={ref}
  className={cn(
    "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-dropdown-menu-content-transform-origin]",
    className
  )}
  {...props}
/>)
DropdownMenuSubContent.displayName =
  DropdownMenuPrimitive.SubContent.displayName

const DropdownMenuContent = (
  {
    ref,
    className,
    sideOffset = 4,
    ...props
  }: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content> & {
    ref: React.RefObject<React.ElementRef<typeof DropdownMenuPrimitive.Content>>;
  }
) => (<DropdownMenuPrimitive.Portal>
  <DropdownMenuPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "z-50 max-h-[var(--radix-dropdown-menu-content-available-height)] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
      "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-dropdown-menu-content-transform-origin]",
      className
    )}
    {...props}
  />
</DropdownMenuPrimitive.Portal>)
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName

const DropdownMenuItem = (
  {
    ref,
    className,
    inset,
    ...props
  }
) => (<DropdownMenuPrimitive.Item
  ref={ref}
  className={cn(
    "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0",
    inset && "pl-8",
    className
  )}
  {...props}
/>)
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName

const DropdownMenuCheckboxItem = (
  {
    ref,
    className,
    children,
    checked,
    ...props
  }: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem> & {
    ref: React.RefObject<React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>>;
  }
) => (<DropdownMenuPrimitive.CheckboxItem
  ref={ref}
  className={cn(
    "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
    className
  )}
  checked={checked}
  {...props}
>
  <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
    <DropdownMenuPrimitive.ItemIndicator>
      <Check className="h-4 w-4" />
    </DropdownMenuPrimitive.ItemIndicator>
  </span>
  {children}
</DropdownMenuPrimitive.CheckboxItem>)
DropdownMenuCheckboxItem.displayName =
  DropdownMenuPrimitive.CheckboxItem.displayName

const DropdownMenuRadioItem = (
  {
    ref,
    className,
    children,
    ...props
  }: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem> & {
    ref: React.RefObject<React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>>;
  }
) => (<DropdownMenuPrimitive.RadioItem
  ref={ref}
  className={cn(
    "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
    className
  )}
  {...props}
>
  <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
    <DropdownMenuPrimitive.ItemIndicator>
      <Circle className="h-2 w-2 fill-current" />
    </DropdownMenuPrimitive.ItemIndicator>
  </span>
  {children}
</DropdownMenuPrimitive.RadioItem>)
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName

const DropdownMenuLabel = (
  {
    ref,
    className,
    inset,
    ...props
  }
) => (<DropdownMenuPrimitive.Label
  ref={ref}
  className={cn(
    "px-2 py-1.5 text-sm font-semibold",
    inset && "pl-8",
    className
  )}
  {...props}
/>)
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName

const DropdownMenuSeparator = (
  {
    ref,
    className,
    ...props
  }: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator> & {
    ref: React.RefObject<React.ElementRef<typeof DropdownMenuPrimitive.Separator>>;
  }
) => (<DropdownMenuPrimitive.Separator
  ref={ref}
  className={cn("-mx-1 my-1 h-px bg-muted", className)}
  {...props}
/>)
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName

const DropdownMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn("ml-auto text-xs tracking-widest opacity-60", className)}
      {...props}
    />
  )
}
DropdownMenuShortcut.displayName = "DropdownMenuShortcut"

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
}
