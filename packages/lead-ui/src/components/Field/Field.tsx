import {
  forwardRef,
  useCallback,
  useId,
  useMemo,
  useState,
} from "react"
import type { HTMLAttributes, ReactNode } from "react"

import "../../tokens.css"
import "./Field.css"
import { FieldContext } from "./FieldContext"
import type { FieldContextValue } from "./FieldContext"

export type FieldOrientation = "vertical" | "horizontal"

export interface FieldProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Optional explicit id for the controlled element. When omitted, an id
   * is generated and propagated to descendants via context.
   */
  id?: string
  invalid?: boolean
  disabled?: boolean
  orientation?: FieldOrientation
  children?: ReactNode
}

export const Field = forwardRef<HTMLDivElement, FieldProps>(function Field(
  {
    id,
    invalid = false,
    disabled = false,
    orientation = "vertical",
    className,
    children,
    ...rest
  },
  ref
) {
  const generatedId = useId()
  const fieldId = id ?? `lead-field-${generatedId}`
  const descriptionId = `${fieldId}-description`
  const errorId = `${fieldId}-error`

  const [descriptionCount, setDescriptionCount] = useState(0)
  const [errorCount, setErrorCount] = useState(0)

  const registerDescription = useCallback(() => {
    setDescriptionCount((n) => n + 1)
  }, [])
  const unregisterDescription = useCallback(() => {
    setDescriptionCount((n) => Math.max(0, n - 1))
  }, [])
  const registerError = useCallback(() => {
    setErrorCount((n) => n + 1)
  }, [])
  const unregisterError = useCallback(() => {
    setErrorCount((n) => Math.max(0, n - 1))
  }, [])

  const value = useMemo<FieldContextValue>(
    () => ({
      fieldId,
      descriptionId,
      errorId,
      hasDescription: descriptionCount > 0,
      hasError: errorCount > 0,
      invalid,
      disabled,
      registerDescription,
      unregisterDescription,
      registerError,
      unregisterError,
    }),
    [
      fieldId,
      descriptionId,
      errorId,
      descriptionCount,
      errorCount,
      invalid,
      disabled,
      registerDescription,
      unregisterDescription,
      registerError,
      unregisterError,
    ]
  )

  const classes = ["lead-Field", className].filter(Boolean).join(" ")

  return (
    <FieldContext.Provider value={value}>
      <div
        ref={ref}
        {...rest}
        className={classes}
        data-orientation={orientation}
        data-invalid={invalid ? "true" : "false"}
        data-disabled={disabled ? "true" : "false"}
      >
        {children}
      </div>
    </FieldContext.Provider>
  )
})
