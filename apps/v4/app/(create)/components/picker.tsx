"use client"

import * as React from "react"
import { Menu as MenuPrimitive } from "@base-ui/react/menu"

import { cn } from "@/registry/bases/base/lib/utils"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import {
  createTooltipHandle,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/app/(create)/components/tooltip"

function Picker({ ...props }: MenuPrimitive.Root.Props) {
  return <MenuPrimitive.Root data-slot="dropdown-menu" {...props} />
}

function PickerPortal({ ...props }: MenuPrimitive.Portal.Props) {
  return <MenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />
}

function PickerTrigger({
  className,
  collapsed = false,
  tooltip,
  ...triggerProps
}: MenuPrimitive.Trigger.Props & {
  collapsed?: boolean
  tooltip?: string
}) {
  const [tooltipHandle] = React.useState(() =>
    createTooltipHandle<{ text: string }>()
  )

  const trigger = (
    <MenuPrimitive.Trigger
      data-slot="dropdown-menu-trigger"
      data-collapsed={collapsed ? "true" : undefined}
      className={cn(
        "relative w-40 shrink-0 touch-manipulation overflow-hidden rounded-xl p-3 ring-1 ring-foreground/10 transition-[width,padding,border-radius] duration-200 ease-out select-none hover:bg-muted focus-visible:ring-foreground/50 focus-visible:outline-none disabled:opacity-50 data-popup-open:bg-muted md:w-full md:rounded-lg md:px-2.5 md:py-2",
        collapsed &&
          "flex size-10 w-10 items-center justify-center rounded-xl p-0 md:size-10 md:w-10 md:rounded-xl md:p-0",
        className
      )}
      {...triggerProps}
    />
  )

  if (!collapsed || !tooltip) {
    return trigger
  }

  return (
    <React.Fragment>
      <TooltipTrigger
        handle={tooltipHandle}
        payload={{ text: tooltip }}
        render={trigger}
      />
      <Tooltip handle={tooltipHandle}>
        {(state) => {
          const payload = state.payload as { text: string } | null | undefined

          return payload ? (
            <TooltipContent side="right" sideOffset={10}>
              {payload.text}
            </TooltipContent>
          ) : null
        }}
      </Tooltip>
    </React.Fragment>
  )
}

function PickerValueTrigger({
  label,
  value,
  valueText,
  indicator,
  valueClassName,
  indicatorClassName,
  collapsed = false,
  className,
  ...props
}: MenuPrimitive.Trigger.Props & {
  label: string
  value?: React.ReactNode
  valueText?: string
  indicator?: React.ReactNode
  valueClassName?: string
  indicatorClassName?: string
  collapsed?: boolean
}) {
  const accessibleValue =
    valueText ?? (typeof value === "string" ? value : undefined)
  const accessibleLabel = accessibleValue
    ? `${label}: ${accessibleValue}`
    : label
  const tooltip = accessibleValue ? `${label}: ${accessibleValue}` : label

  return (
    <PickerTrigger
      aria-label={accessibleLabel}
      collapsed={collapsed}
      tooltip={tooltip}
      className={cn(
        "flex items-center",
        collapsed ? "justify-center gap-0" : "justify-start gap-2.5",
        className
      )}
      {...props}
    >
      <div
        aria-hidden={collapsed}
        className={cn(
          "min-w-0 flex-1 overflow-hidden text-left transition-[flex-basis,max-width,opacity,transform] duration-200 ease-out",
          collapsed
            ? "max-w-0 basis-0 -translate-x-1 opacity-0"
            : "max-w-full basis-auto opacity-100"
        )}
      >
        <div className="flex flex-col justify-start text-left">
          <div className="truncate text-xs text-muted-foreground">{label}</div>
          <div
            className={cn(
              "truncate text-sm font-medium text-foreground",
              valueClassName
            )}
          >
            {value}
          </div>
        </div>
      </div>
      {indicator ? (
        <div
          className={cn(
            "pointer-events-none flex size-4 shrink-0 items-center justify-center text-base text-foreground transition-transform duration-200 ease-out select-none *:[svg]:size-4 *:[svg]:text-foreground!",
            indicatorClassName
          )}
        >
          {indicator}
        </div>
      ) : null}
    </PickerTrigger>
  )
}

function PickerContent({
  align = "start",
  alignOffset = 0,
  side = "bottom",
  sideOffset = 20,
  anchor,
  className,
  ...props
}: MenuPrimitive.Popup.Props &
  Pick<
    MenuPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset" | "anchor"
  >) {
  const bridgeClassName =
    side === "left"
      ? "absolute inset-y-0 left-0 right-62 z-40 bg-transparent"
      : side === "right"
        ? "absolute inset-y-0 right-0 left-62 z-40 bg-transparent"
        : null

  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Positioner
        className="isolate z-50 outline-none"
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        anchor={anchor}
      >
        <MenuPrimitive.Popup
          data-slot="dropdown-menu-content"
          className={cn(
            "cn-menu-target z-50 no-scrollbar max-h-(--available-height) w-[calc(var(--available-width)-(--spacing(6)))] min-w-32 origin-(--transform-origin) translate-y-2 overflow-x-hidden overflow-y-auto rounded-xl border-0 bg-neutral-950/80 p-1.5 text-neutral-100 ring-1 ring-neutral-950/80 backdrop-blur-xl outline-none md:w-52 dark:bg-neutral-800/90 dark:ring-neutral-700/50 data-closed:overflow-hidden",
            className
          )}
          {...props}
        />
      </MenuPrimitive.Positioner>
      {bridgeClassName ? <div className={bridgeClassName} /> : null}
    </MenuPrimitive.Portal>
  )
}

function PickerGroup({ ...props }: MenuPrimitive.Group.Props) {
  return <MenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />
}

function PickerLabel({
  className,
  inset,
  ...props
}: MenuPrimitive.GroupLabel.Props & {
  inset?: boolean
}) {
  return (
    <MenuPrimitive.GroupLabel
      data-slot="dropdown-menu-label"
      data-inset={inset}
      className={cn(
        "px-2 py-1.5 text-xs font-medium text-neutral-400 data-inset:pl-8",
        className
      )}
      {...props}
    />
  )
}

function PickerItem({
  className,
  inset,
  variant = "default",
  ...props
}: MenuPrimitive.Item.Props & {
  inset?: boolean
  variant?: "default" | "destructive"
}) {
  return (
    <MenuPrimitive.Item
      data-slot="dropdown-menu-item"
      data-inset={inset}
      data-variant={variant}
      className={cn(
        "group/dropdown-menu-item relative flex cursor-default items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium outline-hidden select-none **:text-neutral-100 focus:bg-neutral-600 focus:text-neutral-100 focus:**:text-neutral-100 data-inset:pl-8 dark:focus:bg-neutral-700/80 pointer-coarse:gap-3 pointer-coarse:py-2.5 pointer-coarse:pl-3 pointer-coarse:text-base data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  )
}

function PickerSub({ ...props }: MenuPrimitive.SubmenuRoot.Props) {
  return <MenuPrimitive.SubmenuRoot data-slot="dropdown-menu-sub" {...props} />
}

function PickerSubTrigger({
  className,
  inset,
  children,
  ...props
}: MenuPrimitive.SubmenuTrigger.Props & {
  inset?: boolean
}) {
  return (
    <MenuPrimitive.SubmenuTrigger
      data-slot="dropdown-menu-sub-trigger"
      data-inset={inset}
      className={cn(
        "flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none focus:bg-accent/95 focus:text-accent-foreground focus:ring-1 focus:ring-foreground/20 not-data-[variant=destructive]:focus:**:text-accent-foreground data-inset:pl-8 data-open:bg-accent/95 data-open:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      {children}
      <IconPlaceholder
        lucide="ChevronRightIcon"
        tabler="IconChevronRight"
        hugeicons="ArrowRight01Icon"
        phosphor="CaretRightIcon"
        remixicon="RiArrowRightSLine"
        className="ml-auto"
      />
    </MenuPrimitive.SubmenuTrigger>
  )
}

function PickerSubContent({
  align = "start",
  alignOffset = -3,
  side = "right",
  sideOffset = 0,
  className,
  ...props
}: React.ComponentProps<typeof PickerContent>) {
  return (
    <PickerContent
      data-slot="dropdown-menu-sub-content"
      className={cn(
        "w-auto min-w-[96px] rounded-md bg-popover/90 p-1 text-popover-foreground shadow-lg ring-1 ring-foreground/10 backdrop-blur-xs duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
        className
      )}
      align={align}
      alignOffset={alignOffset}
      side={side}
      sideOffset={sideOffset}
      {...props}
    />
  )
}

function PickerCheckboxItem({
  className,
  children,
  checked,
  ...props
}: MenuPrimitive.CheckboxItem.Props) {
  return (
    <MenuPrimitive.CheckboxItem
      data-slot="dropdown-menu-checkbox-item"
      className={cn(
        "relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none focus:bg-accent/95 focus:text-accent-foreground focus:ring-1 focus:ring-foreground/20 focus:**:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      checked={checked}
      {...props}
    >
      <span className="pointer-events-none absolute right-2 flex items-center justify-center">
        <MenuPrimitive.CheckboxItemIndicator>
          <IconPlaceholder
            lucide="CheckIcon"
            tabler="IconCheck"
            hugeicons="Tick02Icon"
            phosphor="CheckIcon"
            remixicon="RiCheckLine"
          />
        </MenuPrimitive.CheckboxItemIndicator>
      </span>
      {children}
    </MenuPrimitive.CheckboxItem>
  )
}

function PickerRadioGroup({ ...props }: MenuPrimitive.RadioGroup.Props) {
  return (
    <MenuPrimitive.RadioGroup
      data-slot="dropdown-menu-radio-group"
      {...props}
    />
  )
}

function PickerRadioItem({
  className,
  children,
  ...props
}: MenuPrimitive.RadioItem.Props) {
  return (
    <MenuPrimitive.RadioItem
      data-slot="dropdown-menu-radio-item"
      className={cn(
        "relative flex cursor-default items-center gap-2 rounded-lg py-1.5 pr-8 pl-2 text-sm font-medium outline-hidden select-none **:text-neutral-100 focus:bg-neutral-600 focus:text-neutral-100 focus:**:text-neutral-100 data-inset:pl-8 dark:focus:bg-neutral-700/80 pointer-coarse:gap-3 pointer-coarse:py-2.5 pointer-coarse:pl-3 pointer-coarse:text-base data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <span
        className="pointer-events-none absolute right-2 flex items-center justify-center"
        data-slot="dropdown-menu-radio-item-indicator"
      >
        <MenuPrimitive.RadioItemIndicator>
          <IconPlaceholder
            lucide="CheckIcon"
            tabler="IconCheck"
            hugeicons="Tick02Icon"
            phosphor="CheckIcon"
            remixicon="RiCheckLine"
            className="size-4 pointer-coarse:size-5"
          />
        </MenuPrimitive.RadioItemIndicator>
      </span>
      {children}
    </MenuPrimitive.RadioItem>
  )
}

function PickerSeparator({
  className,
  ...props
}: MenuPrimitive.Separator.Props) {
  return (
    <MenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
      className={cn(
        "-mx-1.5 my-1.5 h-px bg-neutral-600 dark:bg-neutral-700",
        className
      )}
      {...props}
    />
  )
}

function PickerShortcut({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={cn(
        "ml-auto text-xs tracking-widest text-neutral-400! group-focus/dropdown-menu-item:text-neutral-100",
        className
      )}
      {...props}
    />
  )
}

export {
  Picker,
  PickerPortal,
  PickerTrigger,
  PickerValueTrigger,
  PickerContent,
  PickerGroup,
  PickerLabel,
  PickerItem,
  PickerCheckboxItem,
  PickerRadioGroup,
  PickerRadioItem,
  PickerSeparator,
  PickerShortcut,
  PickerSub,
  PickerSubTrigger,
  PickerSubContent,
}
