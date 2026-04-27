import { forwardRef, useEffect } from "react"
import type { HTMLAttributes } from "react"

import "../../tokens.css"
import "./Field.css"
import { useFieldContext } from "./FieldContext"

export interface FieldErrorProps extends HTMLAttributes<HTMLParagraphElement> {}

export const FieldError = forwardRef<HTMLParagraphElement, FieldErrorProps>(
  function FieldError({ id, className, children, ...rest }, ref) {
    const ctx = useFieldContext()
    const visible = Boolean(children)

    useEffect(() => {
      if (!ctx || !visible) return
      ctx.registerError()
      return () => ctx.unregisterError()
    }, [ctx, visible])

    if (!visible) return null

    const classes = ["lead-FieldError", className].filter(Boolean).join(" ")
    const resolvedId = id ?? ctx?.errorId

    return (
      <p
        ref={ref}
        role="alert"
        {...rest}
        id={resolvedId}
        className={classes}
        data-disabled={ctx?.disabled ? "true" : "false"}
      >
        {children}
      </p>
    )
  }
)
