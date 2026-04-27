import { forwardRef } from "react"
import type { LabelHTMLAttributes } from "react"

import "../../tokens.css"
import "./Label.css"

export type LabelSize = "sm" | "md" | "lg"

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  size?: LabelSize
  disabled?: boolean
  required?: boolean
  requiredIndicator?: string
  requiredLabel?: string
}

export const Label = forwardRef<HTMLLabelElement, LabelProps>(function Label(
  {
    size = "md",
    disabled = false,
    required = false,
    requiredIndicator = "*",
    requiredLabel = "required",
    className,
    children,
    ...rest
  },
  ref
) {
  const classes = ["lead-Label", className].filter(Boolean).join(" ")

  return (
    <label
      ref={ref}
      {...rest}
      className={classes}
      data-size={size}
      data-disabled={disabled ? "true" : "false"}
    >
      {children}
      {required && (
        <span className="lead-Label__required" aria-hidden="true">
          {requiredIndicator}
          <span className="lead-sr-only">{` ${requiredLabel}`}</span>
        </span>
      )}
    </label>
  )
})
