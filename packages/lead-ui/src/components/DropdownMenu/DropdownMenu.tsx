import * as RadixDropdownMenu from "@radix-ui/react-dropdown-menu"
import { forwardRef } from "react"
import type { ComponentPropsWithoutRef, ElementRef } from "react"

import "../../tokens.css"
import "./DropdownMenu.css"

/**
 * DropdownMenu root. Forwards Radix's controlled (open + onOpenChange),
 * uncontrolled (defaultOpen), modal, and dir props.
 */
export interface DropdownMenuProps
  extends ComponentPropsWithoutRef<typeof RadixDropdownMenu.Root> {}

export function DropdownMenu(props: DropdownMenuProps) {
  return <RadixDropdownMenu.Root {...props} />
}

export interface DropdownMenuGroupProps
  extends ComponentPropsWithoutRef<typeof RadixDropdownMenu.Group> {}

export const DropdownMenuGroup = forwardRef<
  ElementRef<typeof RadixDropdownMenu.Group>,
  DropdownMenuGroupProps
>(function DropdownMenuGroup(props, ref) {
  return <RadixDropdownMenu.Group ref={ref} {...props} />
})

/**
 * DropdownMenuTrigger. Exposes Radix's `asChild` so callers can wrap
 * a Lead Button (or any focusable element) without an extra wrapper.
 * Consistent with the §8.1 / §8.2 policy.
 */
export interface DropdownMenuTriggerProps
  extends ComponentPropsWithoutRef<typeof RadixDropdownMenu.Trigger> {}

export const DropdownMenuTrigger = forwardRef<
  ElementRef<typeof RadixDropdownMenu.Trigger>,
  DropdownMenuTriggerProps
>(function DropdownMenuTrigger(props, ref) {
  return <RadixDropdownMenu.Trigger ref={ref} {...props} />
})

export interface DropdownMenuContentProps
  extends Omit<
    ComponentPropsWithoutRef<typeof RadixDropdownMenu.Content>,
    "asChild"
  > {}

export const DropdownMenuContent = forwardRef<
  ElementRef<typeof RadixDropdownMenu.Content>,
  DropdownMenuContentProps
>(function DropdownMenuContent(
  { className, sideOffset = 6, ...rest },
  ref
) {
  const classes = ["lead-DropdownMenu__content", className]
    .filter(Boolean)
    .join(" ")
  return (
    <RadixDropdownMenu.Portal>
      <RadixDropdownMenu.Content
        ref={ref}
        sideOffset={sideOffset}
        {...rest}
        className={classes}
      />
    </RadixDropdownMenu.Portal>
  )
})

export interface DropdownMenuItemProps
  extends Omit<
    ComponentPropsWithoutRef<typeof RadixDropdownMenu.Item>,
    "asChild"
  > {}

export const DropdownMenuItem = forwardRef<
  ElementRef<typeof RadixDropdownMenu.Item>,
  DropdownMenuItemProps
>(function DropdownMenuItem({ className, ...rest }, ref) {
  const classes = ["lead-DropdownMenuItem", className].filter(Boolean).join(" ")
  return <RadixDropdownMenu.Item ref={ref} {...rest} className={classes} />
})

export interface DropdownMenuLabelProps
  extends ComponentPropsWithoutRef<typeof RadixDropdownMenu.Label> {}

export const DropdownMenuLabel = forwardRef<
  ElementRef<typeof RadixDropdownMenu.Label>,
  DropdownMenuLabelProps
>(function DropdownMenuLabel({ className, ...rest }, ref) {
  const classes = ["lead-DropdownMenuLabel", className]
    .filter(Boolean)
    .join(" ")
  return <RadixDropdownMenu.Label ref={ref} {...rest} className={classes} />
})

export interface DropdownMenuSeparatorProps
  extends ComponentPropsWithoutRef<typeof RadixDropdownMenu.Separator> {}

export const DropdownMenuSeparator = forwardRef<
  ElementRef<typeof RadixDropdownMenu.Separator>,
  DropdownMenuSeparatorProps
>(function DropdownMenuSeparator({ className, ...rest }, ref) {
  const classes = ["lead-DropdownMenuSeparator", className]
    .filter(Boolean)
    .join(" ")
  return (
    <RadixDropdownMenu.Separator ref={ref} {...rest} className={classes} />
  )
})

function CheckIcon() {
  return (
    <svg
      className="lead-DropdownMenu__indicator__icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function DotIcon() {
  return (
    <svg
      className="lead-DropdownMenu__indicator__icon"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
    </svg>
  )
}

export interface DropdownMenuCheckboxItemProps
  extends Omit<
    ComponentPropsWithoutRef<typeof RadixDropdownMenu.CheckboxItem>,
    "asChild"
  > {}

export const DropdownMenuCheckboxItem = forwardRef<
  ElementRef<typeof RadixDropdownMenu.CheckboxItem>,
  DropdownMenuCheckboxItemProps
>(function DropdownMenuCheckboxItem(
  { className, children, ...rest },
  ref
) {
  const classes = ["lead-DropdownMenuCheckboxItem", className]
    .filter(Boolean)
    .join(" ")
  return (
    <RadixDropdownMenu.CheckboxItem ref={ref} {...rest} className={classes}>
      <RadixDropdownMenu.ItemIndicator className="lead-DropdownMenu__indicator">
        <CheckIcon />
      </RadixDropdownMenu.ItemIndicator>
      {children}
    </RadixDropdownMenu.CheckboxItem>
  )
})

export interface DropdownMenuRadioGroupProps
  extends ComponentPropsWithoutRef<typeof RadixDropdownMenu.RadioGroup> {}

export const DropdownMenuRadioGroup = forwardRef<
  ElementRef<typeof RadixDropdownMenu.RadioGroup>,
  DropdownMenuRadioGroupProps
>(function DropdownMenuRadioGroup(props, ref) {
  return <RadixDropdownMenu.RadioGroup ref={ref} {...props} />
})

export interface DropdownMenuRadioItemProps
  extends Omit<
    ComponentPropsWithoutRef<typeof RadixDropdownMenu.RadioItem>,
    "asChild"
  > {}

export const DropdownMenuRadioItem = forwardRef<
  ElementRef<typeof RadixDropdownMenu.RadioItem>,
  DropdownMenuRadioItemProps
>(function DropdownMenuRadioItem({ className, children, ...rest }, ref) {
  const classes = ["lead-DropdownMenuRadioItem", className]
    .filter(Boolean)
    .join(" ")
  return (
    <RadixDropdownMenu.RadioItem ref={ref} {...rest} className={classes}>
      <RadixDropdownMenu.ItemIndicator className="lead-DropdownMenu__indicator">
        <DotIcon />
      </RadixDropdownMenu.ItemIndicator>
      {children}
    </RadixDropdownMenu.RadioItem>
  )
})

export interface DropdownMenuSubProps
  extends ComponentPropsWithoutRef<typeof RadixDropdownMenu.Sub> {}

export function DropdownMenuSub(props: DropdownMenuSubProps) {
  return <RadixDropdownMenu.Sub {...props} />
}

function ChevronRight() {
  return (
    <svg
      className="lead-DropdownMenuSubTrigger__chevron"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="9 6 15 12 9 18" />
    </svg>
  )
}

export interface DropdownMenuSubTriggerProps
  extends Omit<
    ComponentPropsWithoutRef<typeof RadixDropdownMenu.SubTrigger>,
    "asChild"
  > {}

export const DropdownMenuSubTrigger = forwardRef<
  ElementRef<typeof RadixDropdownMenu.SubTrigger>,
  DropdownMenuSubTriggerProps
>(function DropdownMenuSubTrigger({ className, children, ...rest }, ref) {
  const classes = ["lead-DropdownMenuSubTrigger", className]
    .filter(Boolean)
    .join(" ")
  return (
    <RadixDropdownMenu.SubTrigger ref={ref} {...rest} className={classes}>
      {children}
      <ChevronRight />
    </RadixDropdownMenu.SubTrigger>
  )
})

export interface DropdownMenuSubContentProps
  extends Omit<
    ComponentPropsWithoutRef<typeof RadixDropdownMenu.SubContent>,
    "asChild"
  > {}

export const DropdownMenuSubContent = forwardRef<
  ElementRef<typeof RadixDropdownMenu.SubContent>,
  DropdownMenuSubContentProps
>(function DropdownMenuSubContent(
  { className, sideOffset = 4, ...rest },
  ref
) {
  const classes = ["lead-DropdownMenu__subContent", className]
    .filter(Boolean)
    .join(" ")
  return (
    <RadixDropdownMenu.Portal>
      <RadixDropdownMenu.SubContent
        ref={ref}
        sideOffset={sideOffset}
        {...rest}
        className={classes}
      />
    </RadixDropdownMenu.Portal>
  )
})
