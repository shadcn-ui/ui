"use client"

import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/tui/ui/avatar"
import { Icon } from "./icon"

const Select = SelectPrimitive.Root

const SelectGroup = SelectPrimitive.Group

const SelectValue = SelectPrimitive.Value

type IconAlignment = 'left' | 'right';
interface SelectMenuProps {
  menuList: { label: string, value: string, imagePath?: string, status?: boolean, secondaryText?: string }[],
  alignIcon?: IconAlignment,
  avatarActive?: boolean,
  statusIndicator?: boolean,
  secondaryActive?: boolean
}

type SelectItemProps = {
  menuData?: { label: string, value: string, imagePath?: string, status?: boolean, secondaryText?: string },
  alignIcon?: IconAlignment,
  avatarActive?: boolean,
  statusIndicator?: boolean,
  secondaryActive?: boolean
} & React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>;

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      {/* <Icon name="chevrons-down-solid" className="h-4 w-4 opacity-50" /> */}
      {/* TODO: to replace with font awesome icon */}
      <ChevronDown className="h-4 w-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        position === "popper" &&
        "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      )}
      position={position}
      {...props}
    >
      <SelectPrimitive.Viewport
        className={cn(
          "p-1",
          position === "popper" &&
          "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className)}
    {...props}
  />
))
SelectLabel.displayName = SelectPrimitive.Label.displayName

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  SelectItemProps // Use the SelectItemProps type here
>((props, ref) => {
  const { className, children, menuData, alignIcon = "left", avatarActive = false, statusIndicator = false, secondaryActive = false, ...rest } = props;
  return (
    <SelectPrimitive.Item
      ref={ref}
      className={cn(
        "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className
      )}
      {...rest}
      title={statusIndicator ? (menuData?.status ? "online" : "offline") : menuData?.value}
    >
      <span className={`absolute flex h-3.5 w-3.5 items-center justify-center ${alignIcon === "right" ? "right-2" : "left-2"}`}>
        <SelectPrimitive.ItemIndicator>
          <Icon name="check-solid" className="h-4 w-4" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>
        <div className="flex items-center">
          {statusIndicator &&
            <span
              className={cn(
                'mr-2 inline-block h-2 w-2 shrink-0 rounded-full',
                menuData?.status ? 'bg-green-400' : 'bg-gray-200'
              )}
            >
            </span>
          }
          {avatarActive &&
            <Avatar className="mr-2 h-8 w-8">
              <AvatarImage src={menuData?.imagePath} alt={menuData?.value} />
              <AvatarFallback>CW</AvatarFallback>
            </Avatar>
          }
          {children}
          {secondaryActive && <span
            className={cn(
              'ml-4 truncate text-gray-500',
              children === menuData?.value ? 'text-indigo-200' : 'text-gray-500'
            )}
          >
            {menuData?.secondaryText}
          </span>}
        </div>
      </SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
});

SelectItem.displayName = SelectPrimitive.Item.displayName

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
}
