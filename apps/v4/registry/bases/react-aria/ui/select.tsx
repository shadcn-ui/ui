"use client"

import * as React from "react"
import {
  composeRenderProps,
  Popover as SelectContentPrimitive,
  ListBoxSection as SelectGroupPrimitive,
  ListBoxItem as SelectItemPrimitive,
  Header as SelectLabelPrimitive,
  ListBox as SelectListPrimitive,
  Select as SelectPrimitive,
  Separator as SelectSeparatorPrimitive,
  Button as SelectTriggerPrimitive,
  SelectValue as SelectValuePrimitive,
  type ListBoxSectionProps as SelectGroupProps,
  type SelectProps,
  type SelectValueProps,
} from "react-aria-components"

import { cn } from "@/registry/bases/react-aria/lib/utils"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

type SelectSide =
  | "top"
  | "right"
  | "bottom"
  | "left"
  | "inline-start"
  | "inline-end"
type SelectAlign = "start" | "center" | "end"

function getPlacement(side: SelectSide, align: SelectAlign) {
  if (side === "inline-start") {
    return "start"
  }

  if (side === "inline-end") {
    return "end"
  }

  if (align === "center") {
    return side
  }

  if (side === "left" || side === "right") {
    const crossPlacement = align === "start" ? "top" : "bottom"
    return `${side} ${crossPlacement}` as const
  }

  return `${side} ${align}` as const
}

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
    <SelectGroupPrimitive
      data-slot="select-group"
      className={cn("cn-select-group", className)}
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
      className={cn("cn-select-value", className)}
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
}: Omit<React.ComponentProps<typeof SelectTriggerPrimitive>, "children"> & {
  children?: React.ReactNode
  size?: "sm" | "default"
}) {
  return (
    <SelectTriggerPrimitive
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        "cn-select-trigger flex w-full items-center justify-between whitespace-nowrap outline-none disabled:cursor-not-allowed disabled:opacity-50 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className
      )}
      {...props}
    >
      {children}
      <IconPlaceholder
        lucide="ChevronDownIcon"
        tabler="IconSelector"
        hugeicons="UnfoldMoreIcon"
        phosphor="CaretDownIcon"
        remixicon="RiArrowDownSLine"
        className="cn-select-trigger-icon pointer-events-none"
      />
    </SelectTriggerPrimitive>
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
  React.ComponentProps<typeof SelectContentPrimitive>,
  "className" | "children" | "placement" | "offset" | "crossOffset"
> & {
  className?: string
  children?: React.ReactNode
  align?: SelectAlign
  alignOffset?: number
  side?: SelectSide
  sideOffset?: number
}) {
  return (
    <SelectContentPrimitive
      data-slot="select-content"
      placement={getPlacement(side, align)}
      offset={sideOffset}
      crossOffset={alignOffset}
      render={(props, { placement, isEntering, isExiting }) => (
        <div
          {...props}
          data-side={placement}
          data-open={isEntering}
          data-closed={isExiting}
        />
      )}
      className={cn(
        "cn-select-content cn-select-content-logical cn-menu-target relative isolate z-50 max-h-(--available-height) w-(--trigger-width) origin-(--trigger-anchor-point) overflow-hidden",
        className
      )}
      {...props}
    >
      <SelectListPrimitive className="max-h-(--available-height) overflow-x-hidden overflow-y-auto p-0 outline-hidden">
        {children}
      </SelectListPrimitive>
    </SelectContentPrimitive>
  )
}

function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectLabelPrimitive>) {
  return (
    <SelectLabelPrimitive
      data-slot="select-label"
      className={cn("cn-select-label", className)}
      {...props}
    />
  )
}

function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectItemPrimitive>) {
  return (
    <SelectItemPrimitive
      data-slot="select-item"
      textValue={typeof children === "string" ? children : undefined}
      className={cn(
        "cn-select-item relative flex w-full cursor-default items-center outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className
      )}
      {...props}
    >
      {composeRenderProps(
        children,
        (children, { isFocused, isHovered, isSelected }) => (
          <>
            <span className="cn-select-item-text shrink-0 whitespace-nowrap">
              {children}
            </span>
            <span className="cn-select-item-indicator">
              {isSelected ? (
                <IconPlaceholder
                  lucide="CheckIcon"
                  tabler="IconCheck"
                  hugeicons="Tick02Icon"
                  phosphor="CheckIcon"
                  remixicon="RiCheckLine"
                  className="cn-select-item-indicator-icon pointer-events-none"
                />
              ) : null}
            </span>
          </>
        )
      )}
    </SelectItemPrimitive>
  )
}

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectSeparatorPrimitive>) {
  return (
    <SelectSeparatorPrimitive
      data-slot="select-separator"
      className={cn("cn-select-separator pointer-events-none", className)}
      {...props}
    />
  )
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}
