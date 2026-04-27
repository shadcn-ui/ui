import { forwardRef } from "react"
import type { ButtonHTMLAttributes, ReactNode } from "react"

import "../../tokens.css"
import "./Button.css"

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger"

export type ButtonSize = "sm" | "md" | "lg"

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "disabled"> {
  variant?: ButtonVariant
  size?: ButtonSize
  disabled?: boolean
  loading?: boolean
  loadingLabel?: string
  leadingIcon?: ReactNode
  trailingIcon?: ReactNode
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = "primary",
      size = "md",
      disabled = false,
      loading = false,
      loadingLabel = "Loading",
      leadingIcon,
      trailingIcon,
      type = "button",
      className,
      children,
      ...rest
    },
    ref
  ) {
    const isInactive = disabled || loading
    const classes = ["lead-Button", className].filter(Boolean).join(" ")

    return (
      <button
        ref={ref}
        {...rest}
        type={type}
        className={classes}
        data-variant={variant}
        data-size={size}
        data-disabled={isInactive ? "true" : "false"}
        data-loading={loading ? "true" : "false"}
        disabled={isInactive}
        aria-busy={loading || undefined}
      >
        {loading ? (
          <span
            className="lead-Button__spinner"
            role="status"
            aria-label={loadingLabel}
          />
        ) : (
          leadingIcon
        )}
        {children}
        {!loading && trailingIcon}
      </button>
    )
  }
)
