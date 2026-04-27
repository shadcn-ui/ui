import * as RadixTooltip from "@radix-ui/react-tooltip"
import { forwardRef } from "react"
import type { ComponentPropsWithoutRef, ElementRef } from "react"

import "../../tokens.css"
import "./Tooltip.css"

/**
 * TooltipProvider. Wraps Radix's Tooltip.Provider so callers can set
 * delayDuration, skipDelayDuration, etc. once at the app root.
 */
export interface TooltipProviderProps
  extends ComponentPropsWithoutRef<typeof RadixTooltip.Provider> {}

export function TooltipProvider(props: TooltipProviderProps) {
  return <RadixTooltip.Provider {...props} />
}

/**
 * Tooltip root. Forwards Radix's controlled (open + onOpenChange) and
 * uncontrolled (defaultOpen) state. delayDuration can be set per-instance
 * to override the provider default.
 */
export interface TooltipProps
  extends ComponentPropsWithoutRef<typeof RadixTooltip.Root> {}

export function Tooltip(props: TooltipProps) {
  return <RadixTooltip.Root {...props} />
}

/**
 * TooltipTrigger. Like DialogTrigger, this exposes `asChild` so callers
 * can wrap any focusable element as the trigger without an extra button.
 */
export interface TooltipTriggerProps
  extends ComponentPropsWithoutRef<typeof RadixTooltip.Trigger> {}

export const TooltipTrigger = forwardRef<
  ElementRef<typeof RadixTooltip.Trigger>,
  TooltipTriggerProps
>(function TooltipTrigger(props, ref) {
  return <RadixTooltip.Trigger ref={ref} {...props} />
})

export interface TooltipContentProps
  extends Omit<
    ComponentPropsWithoutRef<typeof RadixTooltip.Content>,
    "asChild"
  > {
  /**
   * When true (default), render a small arrow pointing at the trigger.
   */
  withArrow?: boolean
}

export const TooltipContent = forwardRef<
  ElementRef<typeof RadixTooltip.Content>,
  TooltipContentProps
>(function TooltipContent(
  { withArrow = true, className, sideOffset = 6, children, ...rest },
  ref
) {
  const classes = ["lead-Tooltip__content", className]
    .filter(Boolean)
    .join(" ")
  return (
    <RadixTooltip.Portal>
      <RadixTooltip.Content
        ref={ref}
        sideOffset={sideOffset}
        {...rest}
        className={classes}
      >
        {children}
        {withArrow && <RadixTooltip.Arrow className="lead-Tooltip__arrow" />}
      </RadixTooltip.Content>
    </RadixTooltip.Portal>
  )
})
