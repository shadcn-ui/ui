import { forwardRef } from "react"

import { Label } from "../Label/Label"
import type { LabelProps } from "../Label/Label"
import { useFieldContext } from "./FieldContext"

export type FieldLabelProps = LabelProps

/**
 * Field-aware Label. Inherits htmlFor and disabled from the surrounding
 * Field context unless explicitly overridden.
 */
export const FieldLabel = forwardRef<HTMLLabelElement, FieldLabelProps>(
  function FieldLabel({ htmlFor, disabled, ...rest }, ref) {
    const ctx = useFieldContext()
    return (
      <Label
        ref={ref}
        htmlFor={htmlFor ?? ctx?.fieldId}
        disabled={disabled ?? ctx?.disabled ?? false}
        {...rest}
      />
    )
  }
)
