import * as RadixDialog from "@radix-ui/react-dialog"
import { forwardRef } from "react"
import type {
  ComponentPropsWithoutRef,
  ElementRef,
  HTMLAttributes,
  ReactNode,
} from "react"

import "../../tokens.css"
import "./Dialog.css"

export type DialogSize = "sm" | "md" | "lg"

/**
 * Dialog root. Wraps Radix's Dialog.Root and forwards all of its
 * controlled (open + onOpenChange) and uncontrolled (defaultOpen) props.
 *
 * `modal` defaults to true (Radix default). Callers can opt into a
 * non-modal dialog by passing modal={false}.
 */
export interface DialogProps
  extends ComponentPropsWithoutRef<typeof RadixDialog.Root> {}

export function Dialog(props: DialogProps) {
  return <RadixDialog.Root {...props} />
}

/**
 * DialogTrigger keeps Radix's `asChild` prop because the canonical use
 * case is wrapping a Lead Button (or any focusable element) without
 * forcing a wrapper button. This is the only case in @leadbank/ui
 * where asChild is exposed at the public API surface, on the basis
 * that any reasonable trigger UI demands it.
 */
export interface DialogTriggerProps
  extends ComponentPropsWithoutRef<typeof RadixDialog.Trigger> {}

export const DialogTrigger = forwardRef<
  ElementRef<typeof RadixDialog.Trigger>,
  DialogTriggerProps
>(function DialogTrigger(props, ref) {
  return <RadixDialog.Trigger ref={ref} {...props} />
})

export interface DialogContentProps
  extends Omit<
    ComponentPropsWithoutRef<typeof RadixDialog.Content>,
    "asChild"
  > {
  size?: DialogSize
  /**
   * When false, callers are responsible for rendering Lead's overlay
   * (or none at all). Defaults to true.
   */
  withOverlay?: boolean
}

export const DialogContent = forwardRef<
  ElementRef<typeof RadixDialog.Content>,
  DialogContentProps
>(function DialogContent(
  { size = "md", withOverlay = true, className, children, ...rest },
  ref
) {
  const classes = ["lead-Dialog__content", className]
    .filter(Boolean)
    .join(" ")
  return (
    <RadixDialog.Portal>
      {withOverlay && (
        <RadixDialog.Overlay className="lead-Dialog__overlay" />
      )}
      <RadixDialog.Content
        ref={ref}
        {...rest}
        className={classes}
        data-size={size}
      >
        {children}
      </RadixDialog.Content>
    </RadixDialog.Portal>
  )
})

export interface DialogHeaderProps extends HTMLAttributes<HTMLDivElement> {}

export const DialogHeader = forwardRef<HTMLDivElement, DialogHeaderProps>(
  function DialogHeader({ className, ...rest }, ref) {
    const classes = ["lead-DialogHeader", className].filter(Boolean).join(" ")
    return <div ref={ref} {...rest} className={classes} />
  }
)

export interface DialogTitleProps
  extends Omit<
    ComponentPropsWithoutRef<typeof RadixDialog.Title>,
    "asChild"
  > {}

export const DialogTitle = forwardRef<
  ElementRef<typeof RadixDialog.Title>,
  DialogTitleProps
>(function DialogTitle({ className, ...rest }, ref) {
  const classes = ["lead-DialogTitle", className].filter(Boolean).join(" ")
  return <RadixDialog.Title ref={ref} {...rest} className={classes} />
})

export interface DialogDescriptionProps
  extends Omit<
    ComponentPropsWithoutRef<typeof RadixDialog.Description>,
    "asChild"
  > {}

export const DialogDescription = forwardRef<
  ElementRef<typeof RadixDialog.Description>,
  DialogDescriptionProps
>(function DialogDescription({ className, ...rest }, ref) {
  const classes = ["lead-DialogDescription", className]
    .filter(Boolean)
    .join(" ")
  return (
    <RadixDialog.Description ref={ref} {...rest} className={classes} />
  )
})

export type DialogFooterAlign = "start" | "end" | "between"

export interface DialogFooterProps extends HTMLAttributes<HTMLDivElement> {
  align?: DialogFooterAlign
}

export const DialogFooter = forwardRef<HTMLDivElement, DialogFooterProps>(
  function DialogFooter({ align = "end", className, ...rest }, ref) {
    const classes = ["lead-DialogFooter", className].filter(Boolean).join(" ")
    return (
      <div ref={ref} {...rest} className={classes} data-align={align} />
    )
  }
)

/**
 * DialogClose. Like DialogTrigger, this exposes `asChild` so callers can
 * use any Lead Button (or other focusable element) as the close target
 * without forcing a wrapper.
 */
export interface DialogCloseProps
  extends ComponentPropsWithoutRef<typeof RadixDialog.Close> {
  children?: ReactNode
}

export const DialogClose = forwardRef<
  ElementRef<typeof RadixDialog.Close>,
  DialogCloseProps
>(function DialogClose(props, ref) {
  return <RadixDialog.Close ref={ref} {...props} />
})
