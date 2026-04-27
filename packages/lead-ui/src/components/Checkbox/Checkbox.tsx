import * as RadixCheckbox from "@radix-ui/react-checkbox"
import { forwardRef } from "react"
import type { ComponentPropsWithoutRef, ElementRef } from "react"

import "../../tokens.css"
import "./Checkbox.css"

export type CheckboxSize = "sm" | "md" | "lg"

export interface CheckboxProps
  extends Omit<ComponentPropsWithoutRef<typeof RadixCheckbox.Root>, "asChild"> {
  size?: CheckboxSize
  invalid?: boolean
}

function CheckIcon() {
  return (
    <svg
      className="lead-Checkbox__icon"
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

function IndeterminateIcon() {
  return (
    <svg
      className="lead-Checkbox__icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}

export const Checkbox = forwardRef<
  ElementRef<typeof RadixCheckbox.Root>,
  CheckboxProps
>(function Checkbox(
  { size = "md", invalid = false, className, checked, ...rest },
  ref
) {
  const classes = ["lead-Checkbox", className].filter(Boolean).join(" ")
  return (
    <RadixCheckbox.Root
      ref={ref}
      {...rest}
      checked={checked}
      className={classes}
      data-size={size}
      data-invalid={invalid ? "true" : "false"}
      aria-invalid={invalid || undefined}
    >
      <RadixCheckbox.Indicator className="lead-Checkbox__indicator">
        {checked === "indeterminate" ? <IndeterminateIcon /> : <CheckIcon />}
      </RadixCheckbox.Indicator>
    </RadixCheckbox.Root>
  )
})
