"use client"

import * as React from "react"
import { CheckIcon, ChevronDownIcon, SearchIcon } from "lucide-react"
import {
  Button as ButtonPrimitive,
  composeRenderProps,
  Header as HeaderPrimitive,
  ListBoxItem as ListBoxItemPrimitive,
  ListBox as ListBoxPrimitive,
  ListBoxSection as ListBoxSectionPrimitive,
  Popover as PopoverPrimitive,
  SearchField,
  Select as SelectPrimitive,
  SelectValue as SelectValuePrimitive,
  Separator as SeparatorPrimitive,
  type ListBoxProps,
  type SearchFieldProps,
  type ListBoxSectionProps as SelectGroupProps,
  type SelectProps,
  type SelectValueProps,
} from "react-aria-components"

import {
  cn,
  getPlacement,
  type PlacementAlign,
  type PlacementSide,
} from "@/lib/utils"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/styles/aria-sera/ui/input-group"

function Select<T extends object, M extends "single" | "multiple" = "single">({
  className,
  ...props
}: SelectProps<T, M>) {
  return (
    <SelectPrimitive
      data-slot="select"
      className={cn("w-fit", className)}
      {...props}
    />
  )
}

function SelectGroup<T extends object>({
  className,
  ...props
}: SelectGroupProps<T>) {
  return (
    <ListBoxSectionPrimitive
      data-slot="select-group"
      className={cn("scroll-my-1.5 p-1.5", className)}
      {...props}
    />
  )
}

function SelectValue<T extends object>({
  className,
  children,
  ...props
}: SelectValueProps<T>) {
  return (
    <SelectValuePrimitive
      data-slot="select-value"
      className={cn(
        "flex flex-1 text-left data-placeholder:text-muted-foreground",
        className
      )}
      {...props}
    >
      {typeof children === "function"
        ? children
        : ({ selectedItems, selectedText, defaultChildren }) =>
            selectedItems.length > 1 ? selectedText : defaultChildren}
    </SelectValuePrimitive>
  )
}

function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}: Omit<React.ComponentProps<typeof ButtonPrimitive>, "children"> & {
  children?: React.ReactNode
  size?: "sm" | "default"
}) {
  return (
    <ButtonPrimitive
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        "flex w-full items-center justify-between gap-1.5 rounded-none border border-transparent border-b-input bg-transparent px-0 py-2 text-sm whitespace-nowrap transition-[color,border-color] outline-none focus-visible:border-b-ring disabled:cursor-not-allowed disabled:opacity-50 data-placeholder:text-muted-foreground data-[size=default]:h-10 data-[size=sm]:h-9 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-1.5 data-invalid:border-b-destructive dark:data-invalid:border-b-destructive/50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDownIcon className="pointer-events-none size-3.5 text-muted-foreground" />
    </ButtonPrimitive>
  )
}

function SelectContent({
  className,
  children,
  side = "bottom",
  sideOffset = 4,
  align = "center",
  alignOffset = 0,
  ...props
}: Omit<
  React.ComponentProps<typeof PopoverPrimitive>,
  "className" | "children" | "placement" | "offset" | "crossOffset"
> & {
  className?: string
  children?: React.ReactNode
  align?: PlacementAlign
  alignOffset?: number
  side?: PlacementSide
  sideOffset?: number
}) {
  return (
    <SelectPopover
      className={className}
      side={side}
      sideOffset={sideOffset}
      align={align}
      alignOffset={alignOffset}
      {...props}
    >
      <SelectList>{children}</SelectList>
    </SelectPopover>
  )
}

function SelectPopover({
  className,
  children,
  side = "bottom",
  sideOffset = 4,
  align = "start",
  alignOffset = 0,
  ...props
}: Omit<
  React.ComponentProps<typeof PopoverPrimitive>,
  "className" | "children" | "placement" | "offset" | "crossOffset"
> & {
  className?: string
  children?: React.ReactNode
  align?: PlacementAlign
  alignOffset?: number
  side?: PlacementSide
  sideOffset?: number
}) {
  return (
    <PopoverPrimitive
      data-slot="select-content"
      placement={getPlacement(side, align)}
      offset={sideOffset}
      crossOffset={alignOffset}
      render={(props, { placement, isExiting }) => (
        <div
          {...props}
          data-side={placement}
          data-open={!isExiting}
          data-closed={isExiting}
        />
      )}
      className={cn(
        "cn-menu-target cn-menu-translucent relative isolate z-50 w-(--trigger-width) min-w-36 origin-(--trigger-anchor-point) overflow-hidden rounded-none bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
        className
      )}
      {...props}
    >
      {children}
    </PopoverPrimitive>
  )
}

function SelectList<T extends object>({
  className,
  ...props
}: ListBoxProps<T>) {
  return (
    <ListBoxPrimitive
      data-slot="select-list"
      className={cn(
        "group/select-list max-h-[inherit] overflow-x-hidden overflow-y-auto p-0 outline-hidden",
        className
      )}
      {...props}
    />
  )
}

function SelectInput({ className, ...props }: SearchFieldProps) {
  return (
    <SearchField
      {...props}
      autoFocus
      data-slot="select-input-wrapper"
      className={cn("p-1 pb-0", className)}
    >
      <InputGroup>
        <InputGroupInput
          data-slot="select-input"
          className="[&::-webkit-search-cancel-button]:hidden"
        />
        <InputGroupAddon>
          <SearchIcon className="size-3.5 shrink-0 opacity-50" />
        </InputGroupAddon>
      </InputGroup>
    </SearchField>
  )
}

function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof HeaderPrimitive>) {
  return (
    <HeaderPrimitive
      data-slot="select-label"
      className={cn(
        "px-3 py-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase",
        className
      )}
      {...props}
    />
  )
}

function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof ListBoxItemPrimitive>) {
  return (
    <ListBoxItemPrimitive
      data-slot="select-item"
      textValue={typeof children === "string" ? children : undefined}
      className={cn(
        "relative flex w-full cursor-default items-center gap-2.5 rounded-none py-2 pr-8 pl-3 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 data-highlighted:bg-accent data-highlighted:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
        className
      )}
      {...props}
    >
      {composeRenderProps(children, (children, { isSelected }) => (
        <>
          <span className="flex flex-1 shrink-0 gap-2 whitespace-nowrap">
            {children}
          </span>
          <span className="pointer-events-none absolute right-2 flex size-4 items-center justify-center">
            {isSelected ? <CheckIcon className="pointer-events-none" /> : null}
          </span>
        </>
      ))}
    </ListBoxItemPrimitive>
  )
}

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive>) {
  return (
    <SeparatorPrimitive
      data-slot="select-separator"
      className={cn(
        "pointer-events-none -mx-1.5 my-1.5 h-px bg-border/50",
        className
      )}
      {...props}
    />
  )
}

function SelectEmpty({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="select-empty"
      className={cn(
        "hidden w-full justify-center py-2 text-center text-sm text-muted-foreground group-data-empty/select-list:flex",
        className
      )}
      {...props}
    />
  )
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectInput,
  SelectItem,
  SelectLabel,
  SelectList,
  SelectPopover,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  SelectEmpty,
}
