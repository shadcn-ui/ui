import * as RadixSelect from "@radix-ui/react-select"
import { forwardRef } from "react"
import type { ComponentPropsWithoutRef, ElementRef } from "react"

import "../../tokens.css"
import "./Select.css"

export type SelectSize = "sm" | "md" | "lg"

/**
 * Select root. Forwards Radix's controlled (value + onValueChange),
 * uncontrolled (defaultValue), disabled, name, and required props.
 */
export interface SelectProps
  extends ComponentPropsWithoutRef<typeof RadixSelect.Root> {}

export function Select(props: SelectProps) {
  return <RadixSelect.Root {...props} />
}

/**
 * SelectGroup wraps Radix.Group for keyboard navigation grouping.
 */
export interface SelectGroupProps
  extends ComponentPropsWithoutRef<typeof RadixSelect.Group> {}

export const SelectGroup = forwardRef<
  ElementRef<typeof RadixSelect.Group>,
  SelectGroupProps
>(function SelectGroup(props, ref) {
  return <RadixSelect.Group ref={ref} {...props} />
})

/**
 * SelectValue renders the currently-selected item's label inside the
 * trigger, with optional placeholder. It's a thin passthrough on
 * Radix.Value.
 */
export interface SelectValueProps
  extends ComponentPropsWithoutRef<typeof RadixSelect.Value> {}

export const SelectValue = forwardRef<
  ElementRef<typeof RadixSelect.Value>,
  SelectValueProps
>(function SelectValue({ className, ...rest }, ref) {
  const classes = ["lead-SelectValue", className].filter(Boolean).join(" ")
  return <RadixSelect.Value ref={ref} {...rest} className={classes} />
})

function ChevronIcon() {
  return (
    <svg
      className="lead-SelectTrigger__icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

export interface SelectTriggerProps
  extends Omit<
    ComponentPropsWithoutRef<typeof RadixSelect.Trigger>,
    "asChild"
  > {
  size?: SelectSize
  invalid?: boolean
}

export const SelectTrigger = forwardRef<
  ElementRef<typeof RadixSelect.Trigger>,
  SelectTriggerProps
>(function SelectTrigger(
  { size = "md", invalid = false, className, children, ...rest },
  ref
) {
  const classes = ["lead-SelectTrigger", className].filter(Boolean).join(" ")
  return (
    <RadixSelect.Trigger
      ref={ref}
      {...rest}
      className={classes}
      data-size={size}
      data-invalid={invalid ? "true" : "false"}
      aria-invalid={invalid || undefined}
    >
      {children}
      <RadixSelect.Icon asChild>
        <ChevronIcon />
      </RadixSelect.Icon>
    </RadixSelect.Trigger>
  )
})

function UpChevron() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="18 15 12 9 6 15" />
    </svg>
  )
}

function DownChevron() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

export interface SelectScrollUpButtonProps
  extends ComponentPropsWithoutRef<typeof RadixSelect.ScrollUpButton> {}

export const SelectScrollUpButton = forwardRef<
  ElementRef<typeof RadixSelect.ScrollUpButton>,
  SelectScrollUpButtonProps
>(function SelectScrollUpButton({ className, ...rest }, ref) {
  const classes = ["lead-SelectScrollButton", className]
    .filter(Boolean)
    .join(" ")
  return (
    <RadixSelect.ScrollUpButton ref={ref} {...rest} className={classes}>
      <UpChevron />
    </RadixSelect.ScrollUpButton>
  )
})

export interface SelectScrollDownButtonProps
  extends ComponentPropsWithoutRef<typeof RadixSelect.ScrollDownButton> {}

export const SelectScrollDownButton = forwardRef<
  ElementRef<typeof RadixSelect.ScrollDownButton>,
  SelectScrollDownButtonProps
>(function SelectScrollDownButton({ className, ...rest }, ref) {
  const classes = ["lead-SelectScrollButton", className]
    .filter(Boolean)
    .join(" ")
  return (
    <RadixSelect.ScrollDownButton ref={ref} {...rest} className={classes}>
      <DownChevron />
    </RadixSelect.ScrollDownButton>
  )
})

export interface SelectContentProps
  extends Omit<
    ComponentPropsWithoutRef<typeof RadixSelect.Content>,
    "asChild"
  > {}

export const SelectContent = forwardRef<
  ElementRef<typeof RadixSelect.Content>,
  SelectContentProps
>(function SelectContent(
  { className, children, position = "popper", sideOffset = 6, ...rest },
  ref
) {
  const classes = ["lead-SelectContent", className].filter(Boolean).join(" ")
  return (
    <RadixSelect.Portal>
      <RadixSelect.Content
        ref={ref}
        position={position}
        sideOffset={sideOffset}
        {...rest}
        className={classes}
      >
        <SelectScrollUpButton />
        <RadixSelect.Viewport className="lead-SelectViewport">
          {children}
        </RadixSelect.Viewport>
        <SelectScrollDownButton />
      </RadixSelect.Content>
    </RadixSelect.Portal>
  )
})

export interface SelectLabelProps
  extends ComponentPropsWithoutRef<typeof RadixSelect.Label> {}

export const SelectLabel = forwardRef<
  ElementRef<typeof RadixSelect.Label>,
  SelectLabelProps
>(function SelectLabel({ className, ...rest }, ref) {
  const classes = ["lead-SelectLabel", className].filter(Boolean).join(" ")
  return <RadixSelect.Label ref={ref} {...rest} className={classes} />
})

export interface SelectSeparatorProps
  extends ComponentPropsWithoutRef<typeof RadixSelect.Separator> {}

export const SelectSeparator = forwardRef<
  ElementRef<typeof RadixSelect.Separator>,
  SelectSeparatorProps
>(function SelectSeparator({ className, ...rest }, ref) {
  const classes = ["lead-SelectSeparator", className]
    .filter(Boolean)
    .join(" ")
  return <RadixSelect.Separator ref={ref} {...rest} className={classes} />
})

function CheckIcon() {
  return (
    <svg
      className="lead-SelectItemIndicator__icon"
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

export interface SelectItemProps
  extends Omit<
    ComponentPropsWithoutRef<typeof RadixSelect.Item>,
    "asChild"
  > {}

export const SelectItem = forwardRef<
  ElementRef<typeof RadixSelect.Item>,
  SelectItemProps
>(function SelectItem({ className, children, ...rest }, ref) {
  const classes = ["lead-SelectItem", className].filter(Boolean).join(" ")
  return (
    <RadixSelect.Item ref={ref} {...rest} className={classes}>
      <RadixSelect.ItemIndicator className="lead-SelectItemIndicator">
        <CheckIcon />
      </RadixSelect.ItemIndicator>
      <RadixSelect.ItemText>{children}</RadixSelect.ItemText>
    </RadixSelect.Item>
  )
})
