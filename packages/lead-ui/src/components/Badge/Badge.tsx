import { forwardRef } from "react"
import type { HTMLAttributes } from "react"

import "../../tokens.css"
import "./Badge.css"

export type BadgeVariant =
  | "neutral"
  | "brand"
  | "success"
  | "warning"
  | "danger"

export type BadgeSize = "sm" | "md" | "lg"

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  size?: BadgeSize
  /**
   * Show a small leading dot in the badge's variant color. Useful for
   * status badges where the color already conveys the meaning.
   */
  dot?: boolean
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  {
    variant = "neutral",
    size = "md",
    dot = false,
    className,
    children,
    ...rest
  },
  ref
) {
  const classes = ["lead-Badge", className].filter(Boolean).join(" ")
  return (
    <span
      ref={ref}
      {...rest}
      className={classes}
      data-variant={variant}
      data-size={size}
    >
      {dot && <span className="lead-Badge__dot" aria-hidden="true" />}
      {children}
    </span>
  )
})
