import { forwardRef } from "react"
import type { HTMLAttributes } from "react"

import "../../tokens.css"
import "./Field.css"

export interface FieldGroupProps extends HTMLAttributes<HTMLDivElement> {}

export const FieldGroup = forwardRef<HTMLDivElement, FieldGroupProps>(
  function FieldGroup({ className, role = "group", ...rest }, ref) {
    const classes = ["lead-FieldGroup", className].filter(Boolean).join(" ")
    return <div ref={ref} role={role} {...rest} className={classes} />
  }
)
