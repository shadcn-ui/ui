import { forwardRef } from "react"
import type { InputHTMLAttributes } from "react"

import "../../tokens.css"
import "./Input.css"

export type InputVariant = "default" | "error"

export type InputSize = "sm" | "md" | "lg"

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  variant?: InputVariant
  size?: InputSize
  invalid?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    variant = "default",
    size = "md",
    invalid,
    disabled = false,
    type = "text",
    className,
    ...rest
  },
  ref
) {
  const isInvalid = invalid ?? variant === "error"
  const classes = ["lead-Input", className].filter(Boolean).join(" ")

  return (
    <input
      ref={ref}
      {...rest}
      type={type}
      className={classes}
      data-size={size}
      data-invalid={isInvalid ? "true" : "false"}
      data-disabled={disabled ? "true" : "false"}
      disabled={disabled}
      aria-invalid={isInvalid || undefined}
    />
  )
})
