import { forwardRef } from "react"
import type { HTMLAttributes } from "react"

import "../../tokens.css"
import "./Separator.css"

export type SeparatorOrientation = "horizontal" | "vertical"
export type SeparatorVariant = "default" | "strong"

export interface SeparatorProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: SeparatorOrientation
  variant?: SeparatorVariant
  /**
   * When true (default), the separator is a pure visual divider with
   * `role="none"` and no orientation announced to assistive tech.
   * When false, the separator is semantic: `role="separator"` plus
   * `aria-orientation` reflecting the visual orientation.
   */
  decorative?: boolean
}

export const Separator = forwardRef<HTMLDivElement, SeparatorProps>(
  function Separator(
    {
      orientation = "horizontal",
      variant = "default",
      decorative = true,
      className,
      ...rest
    },
    ref
  ) {
    const classes = ["lead-Separator", className].filter(Boolean).join(" ")
    return (
      <div
        ref={ref}
        {...rest}
        className={classes}
        data-orientation={orientation}
        data-variant={variant}
        role={decorative ? "none" : "separator"}
        aria-orientation={decorative ? undefined : orientation}
      />
    )
  }
)
