import { forwardRef } from "react"
import type { HTMLAttributes } from "react"

import "../../tokens.css"
import "./Alert.css"

export type AlertVariant =
  | "neutral"
  | "info"
  | "success"
  | "warning"
  | "danger"

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant
}

/**
 * Role policy:
 *   - `danger` and `warning` use role="alert" — these communicate
 *     conditions the user should be interrupted by (errors, blocking
 *     warnings). role="alert" implies aria-live="assertive".
 *   - `neutral`, `info`, and `success` use role="status" — these are
 *     polite announcements that should be read after the current task.
 *     role="status" implies aria-live="polite".
 *
 * Callers can override `role` and `aria-live` via props if they need
 * a different policy for a specific instance.
 */
const ROLE_FOR_VARIANT: Record<AlertVariant, "alert" | "status"> = {
  neutral: "status",
  info: "status",
  success: "status",
  warning: "alert",
  danger: "alert",
}

export const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  { variant = "neutral", className, role, ...rest },
  ref
) {
  const classes = ["lead-Alert", className].filter(Boolean).join(" ")
  const resolvedRole = role ?? ROLE_FOR_VARIANT[variant]
  return (
    <div
      ref={ref}
      role={resolvedRole}
      {...rest}
      className={classes}
      data-variant={variant}
    />
  )
})

export interface AlertTitleProps extends HTMLAttributes<HTMLParagraphElement> {}

export const AlertTitle = forwardRef<HTMLParagraphElement, AlertTitleProps>(
  function AlertTitle({ className, ...rest }, ref) {
    const classes = ["lead-AlertTitle", className].filter(Boolean).join(" ")
    return <p ref={ref} {...rest} className={classes} />
  }
)

export interface AlertDescriptionProps
  extends HTMLAttributes<HTMLParagraphElement> {}

export const AlertDescription = forwardRef<
  HTMLParagraphElement,
  AlertDescriptionProps
>(function AlertDescription({ className, ...rest }, ref) {
  const classes = ["lead-AlertDescription", className].filter(Boolean).join(" ")
  return <p ref={ref} {...rest} className={classes} />
})
