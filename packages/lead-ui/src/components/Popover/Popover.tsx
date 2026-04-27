import * as RadixPopover from "@radix-ui/react-popover"
import { forwardRef } from "react"
import type { ComponentPropsWithoutRef, ElementRef } from "react"

import "../../tokens.css"
import "./Popover.css"

/**
 * Popover root. Forwards Radix's controlled (open + onOpenChange) and
 * uncontrolled (defaultOpen) state, plus modal.
 */
export interface PopoverProps
  extends ComponentPropsWithoutRef<typeof RadixPopover.Root> {}

export function Popover(props: PopoverProps) {
  return <RadixPopover.Root {...props} />
}

/**
 * PopoverTrigger. Exposes Radix's `asChild` because the canonical use is
 * wrapping a Lead Button (or any focusable element). Consistent with the
 * §8.1 / §8.2 policy: trigger primitives expose asChild; chrome
 * components do not.
 */
export interface PopoverTriggerProps
  extends ComponentPropsWithoutRef<typeof RadixPopover.Trigger> {}

export const PopoverTrigger = forwardRef<
  ElementRef<typeof RadixPopover.Trigger>,
  PopoverTriggerProps
>(function PopoverTrigger(props, ref) {
  return <RadixPopover.Trigger ref={ref} {...props} />
})

/**
 * PopoverAnchor. Optional positional anchor when the trigger is not the
 * desired anchor (e.g. trigger is a tiny icon, anchor is the surrounding
 * row). Exposes asChild for the same reason as PopoverTrigger.
 */
export interface PopoverAnchorProps
  extends ComponentPropsWithoutRef<typeof RadixPopover.Anchor> {}

export const PopoverAnchor = forwardRef<
  ElementRef<typeof RadixPopover.Anchor>,
  PopoverAnchorProps
>(function PopoverAnchor(props, ref) {
  return <RadixPopover.Anchor ref={ref} {...props} />
})

export interface PopoverContentProps
  extends Omit<
    ComponentPropsWithoutRef<typeof RadixPopover.Content>,
    "asChild"
  > {
  withArrow?: boolean
}

export const PopoverContent = forwardRef<
  ElementRef<typeof RadixPopover.Content>,
  PopoverContentProps
>(function PopoverContent(
  { withArrow = true, className, children, sideOffset = 8, ...rest },
  ref
) {
  const classes = ["lead-Popover__content", className]
    .filter(Boolean)
    .join(" ")
  return (
    <RadixPopover.Portal>
      <RadixPopover.Content
        ref={ref}
        sideOffset={sideOffset}
        {...rest}
        className={classes}
      >
        {children}
        {withArrow && <RadixPopover.Arrow className="lead-Popover__arrow" />}
      </RadixPopover.Content>
    </RadixPopover.Portal>
  )
})

/**
 * PopoverClose. Exposes asChild so callers can wrap any Lead Button as
 * a close target.
 */
export interface PopoverCloseProps
  extends ComponentPropsWithoutRef<typeof RadixPopover.Close> {}

export const PopoverClose = forwardRef<
  ElementRef<typeof RadixPopover.Close>,
  PopoverCloseProps
>(function PopoverClose(props, ref) {
  return <RadixPopover.Close ref={ref} {...props} />
})
