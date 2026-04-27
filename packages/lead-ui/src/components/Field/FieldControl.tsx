import { Children, cloneElement, isValidElement, useEffect } from "react"
import type { ReactElement, ReactNode } from "react"

import { useFieldContext } from "./FieldContext"

export interface FieldControlProps {
  children: ReactNode
}

interface ControlSlotProps {
  id?: string
  disabled?: boolean
  invalid?: boolean
  "aria-invalid"?: boolean
  "aria-describedby"?: string
  htmlFor?: string
}

/**
 * Wires the surrounding Field context into a single child control so callers
 * don't have to manually pass id / aria-describedby / aria-invalid / disabled
 * down to Input (or any compatible @leadbank/ui control).
 *
 * Pass-through is non-destructive: child-supplied id, aria-describedby,
 * disabled, or invalid take precedence over the Field context defaults.
 */
export function FieldControl({ children }: FieldControlProps) {
  const ctx = useFieldContext()
  const child = Children.only(children) as ReactElement<ControlSlotProps>

  useEffect(() => {
    if (!isValidElement(child)) {
      throw new Error("FieldControl expects a single React element child.")
    }
  }, [child])

  if (!ctx || !isValidElement(child)) {
    return <>{children}</>
  }

  const childProps = (child.props ?? {}) as ControlSlotProps
  const describedBy = [
    ctx.hasDescription ? ctx.descriptionId : null,
    ctx.invalid && ctx.hasError ? ctx.errorId : null,
    childProps["aria-describedby"],
  ]
    .filter(Boolean)
    .join(" ")

  const merged: ControlSlotProps = {
    id: childProps.id ?? ctx.fieldId,
    disabled: childProps.disabled ?? ctx.disabled,
    invalid: childProps.invalid ?? ctx.invalid,
    "aria-describedby": describedBy.length > 0 ? describedBy : undefined,
  }

  return cloneElement(child, merged)
}
