import { forwardRef, useEffect } from "react"
import type { HTMLAttributes } from "react"

import "../../tokens.css"
import "./Field.css"
import { useFieldContext } from "./FieldContext"

export interface FieldDescriptionProps
  extends HTMLAttributes<HTMLParagraphElement> {}

export const FieldDescription = forwardRef<
  HTMLParagraphElement,
  FieldDescriptionProps
>(function FieldDescription({ id, className, ...rest }, ref) {
  const ctx = useFieldContext()

  useEffect(() => {
    if (!ctx) return
    ctx.registerDescription()
    return () => ctx.unregisterDescription()
  }, [ctx])

  const classes = ["lead-FieldDescription", className].filter(Boolean).join(" ")
  const resolvedId = id ?? ctx?.descriptionId

  return (
    <p
      ref={ref}
      {...rest}
      id={resolvedId}
      className={classes}
      data-disabled={ctx?.disabled ? "true" : "false"}
    />
  )
})
