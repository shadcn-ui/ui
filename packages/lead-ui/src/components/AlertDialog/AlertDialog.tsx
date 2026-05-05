import * as RadixAlertDialog from "@radix-ui/react-alert-dialog"
import { forwardRef } from "react"
import type {
  ComponentPropsWithoutRef,
  ElementRef,
  HTMLAttributes,
  ReactNode,
} from "react"

import "../../tokens.css"
// AlertDialog reuses Dialog's CSS classes for visual consistency. The
// only AlertDialog-specific rule is the auto-stacked footer at
// size="sm", which lives in AlertDialog.css.
import "../Dialog/Dialog.css"
import "./AlertDialog.css"

import type { DialogFooterAlign, DialogSize } from "../Dialog/Dialog"

/**
 * AlertDialog — modal confirmation primitive with `role="alertdialog"`.
 *
 * Distinct from `<Dialog>`: AlertDialog signals to assistive technology
 * that user input is *required* (the dialog cannot be dismissed by
 * clicking outside or by Escape without a deliberate action). Use this
 * for destructive-action confirmations ("Delete this?", "Discard
 * changes?") and any flow where casual dismissal would lose work.
 *
 * Decision contract: docs/alert-dialog-primitive-decision.md (JES-85).
 *   1. Lead ships a dedicated AlertDialog primitive.
 *   2. Footer auto-stacks at size="sm" — no new prop; CSS-driven.
 *   3. Confirmation summary panel is *not* a dedicated subcomponent;
 *      caller composes a styled <div> inside <AlertDialogContent>.
 *   4. Canonical button order: Cancel first, primary action last,
 *      across all breakpoints.
 *
 * Visual primitives (CSS classes, sizes, header/title/description
 * styling) are reused from <Dialog> by design. Future visual updates to
 * Dialog automatically apply to AlertDialog. The only AlertDialog-
 * specific styling is the auto-stacked footer at size="sm".
 */
export interface AlertDialogProps
  extends ComponentPropsWithoutRef<typeof RadixAlertDialog.Root> {}

export function AlertDialog(props: AlertDialogProps) {
  return <RadixAlertDialog.Root {...props} />
}

/**
 * AlertDialogTrigger keeps Radix's `asChild` prop, matching DialogTrigger.
 * Wrap a Lead Button (or any focusable element) without forcing an extra
 * wrapper button.
 */
export interface AlertDialogTriggerProps
  extends ComponentPropsWithoutRef<typeof RadixAlertDialog.Trigger> {}

export const AlertDialogTrigger = forwardRef<
  ElementRef<typeof RadixAlertDialog.Trigger>,
  AlertDialogTriggerProps
>(function AlertDialogTrigger(props, ref) {
  return <RadixAlertDialog.Trigger ref={ref} {...props} />
})

/**
 * AlertDialogPortal is exposed as a thin pass-through for advanced
 * cases (custom container). The default <AlertDialogContent> already
 * portals; callers don't normally need to use this directly.
 */
export interface AlertDialogPortalProps
  extends ComponentPropsWithoutRef<typeof RadixAlertDialog.Portal> {}

export function AlertDialogPortal(props: AlertDialogPortalProps) {
  return <RadixAlertDialog.Portal {...props} />
}

export interface AlertDialogOverlayProps
  extends Omit<
    ComponentPropsWithoutRef<typeof RadixAlertDialog.Overlay>,
    "asChild"
  > {}

export const AlertDialogOverlay = forwardRef<
  ElementRef<typeof RadixAlertDialog.Overlay>,
  AlertDialogOverlayProps
>(function AlertDialogOverlay({ className, ...rest }, ref) {
  const classes = ["lead-Dialog__overlay", className].filter(Boolean).join(" ")
  return <RadixAlertDialog.Overlay ref={ref} {...rest} className={classes} />
})

export interface AlertDialogContentProps
  extends Omit<
    ComponentPropsWithoutRef<typeof RadixAlertDialog.Content>,
    "asChild"
  > {
  size?: DialogSize
  /**
   * When false, callers are responsible for rendering Lead's overlay
   * (or none at all). Defaults to true.
   */
  withOverlay?: boolean
}

export const AlertDialogContent = forwardRef<
  ElementRef<typeof RadixAlertDialog.Content>,
  AlertDialogContentProps
>(function AlertDialogContent(
  { size = "md", withOverlay = true, className, children, ...rest },
  ref
) {
  // Two classes: `lead-Dialog__content` provides the shared visual
  // chrome (sizing, surface, footer auto-stacking at sm) — `lead-
  // AlertDialog__content` adds the AlertDialog-only sm centered-text
  // treatment that matches the Figma source. Keeping these as separate
  // classes (rather than promoting the centering into Dialog) prevents
  // generic Dialog instances from inheriting AlertDialog-specific
  // visual choices.
  const classes = [
    "lead-Dialog__content",
    "lead-AlertDialog__content",
    className,
  ]
    .filter(Boolean)
    .join(" ")
  return (
    <RadixAlertDialog.Portal>
      {withOverlay && (
        <RadixAlertDialog.Overlay className="lead-Dialog__overlay" />
      )}
      <RadixAlertDialog.Content
        ref={ref}
        {...rest}
        className={classes}
        data-size={size}
      >
        {children}
      </RadixAlertDialog.Content>
    </RadixAlertDialog.Portal>
  )
})

export interface AlertDialogHeaderProps
  extends HTMLAttributes<HTMLDivElement> {}

export const AlertDialogHeader = forwardRef<
  HTMLDivElement,
  AlertDialogHeaderProps
>(function AlertDialogHeader({ className, ...rest }, ref) {
  const classes = ["lead-DialogHeader", className].filter(Boolean).join(" ")
  return <div ref={ref} {...rest} className={classes} />
})

export interface AlertDialogTitleProps
  extends Omit<
    ComponentPropsWithoutRef<typeof RadixAlertDialog.Title>,
    "asChild"
  > {}

export const AlertDialogTitle = forwardRef<
  ElementRef<typeof RadixAlertDialog.Title>,
  AlertDialogTitleProps
>(function AlertDialogTitle({ className, ...rest }, ref) {
  const classes = ["lead-DialogTitle", className].filter(Boolean).join(" ")
  return <RadixAlertDialog.Title ref={ref} {...rest} className={classes} />
})

export interface AlertDialogDescriptionProps
  extends Omit<
    ComponentPropsWithoutRef<typeof RadixAlertDialog.Description>,
    "asChild"
  > {}

export const AlertDialogDescription = forwardRef<
  ElementRef<typeof RadixAlertDialog.Description>,
  AlertDialogDescriptionProps
>(function AlertDialogDescription({ className, ...rest }, ref) {
  const classes = ["lead-DialogDescription", className]
    .filter(Boolean)
    .join(" ")
  return (
    <RadixAlertDialog.Description ref={ref} {...rest} className={classes} />
  )
})

export interface AlertDialogFooterProps
  extends HTMLAttributes<HTMLDivElement> {
  align?: DialogFooterAlign
}

/**
 * AlertDialogFooter shares CSS with DialogFooter. At size="sm", a parent
 * CSS rule auto-stacks the footer (flex-direction: column, full-width
 * children) — no new prop. The `align` prop still controls horizontal
 * justification at size="md" / "lg".
 *
 * Canonical button order: Cancel first, primary action last (per
 * decision §4). Render children in that order; the footer doesn't
 * enforce, just preserves caller order.
 */
export const AlertDialogFooter = forwardRef<
  HTMLDivElement,
  AlertDialogFooterProps
>(function AlertDialogFooter({ align = "end", className, ...rest }, ref) {
  const classes = ["lead-DialogFooter", className].filter(Boolean).join(" ")
  return <div ref={ref} {...rest} className={classes} data-align={align} />
})

/**
 * AlertDialogAction — the destructive/confirmatory action.
 *
 * Distinct from a generic Button by Radix's contract: clicking this
 * closes the dialog AND the consumer can attach `onClick` to perform
 * the action. Wrap a Lead Button via `asChild` for visual styling.
 */
export interface AlertDialogActionProps
  extends ComponentPropsWithoutRef<typeof RadixAlertDialog.Action> {
  children?: ReactNode
}

export const AlertDialogAction = forwardRef<
  ElementRef<typeof RadixAlertDialog.Action>,
  AlertDialogActionProps
>(function AlertDialogAction(props, ref) {
  return <RadixAlertDialog.Action ref={ref} {...props} />
})

/**
 * AlertDialogCancel — the safe option. Closes the dialog without
 * performing the action. Wrap a Lead Button via `asChild`.
 */
export interface AlertDialogCancelProps
  extends ComponentPropsWithoutRef<typeof RadixAlertDialog.Cancel> {
  children?: ReactNode
}

export const AlertDialogCancel = forwardRef<
  ElementRef<typeof RadixAlertDialog.Cancel>,
  AlertDialogCancelProps
>(function AlertDialogCancel(props, ref) {
  return <RadixAlertDialog.Cancel ref={ref} {...props} />
})
