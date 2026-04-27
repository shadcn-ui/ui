import { forwardRef } from "react"
import type { HTMLAttributes } from "react"

import "../../tokens.css"
import "./Skeleton.css"

export type SkeletonShape = "text" | "rect" | "circle"

export interface SkeletonProps extends HTMLAttributes<HTMLSpanElement> {
  shape?: SkeletonShape
  /**
   * Decorative by default — no role, aria-hidden=true so screen readers
   * skip the placeholder. Set to false if the skeleton represents content
   * the user should be told is loading (rare; usually a parent container
   * carries the loading announcement).
   */
  decorative?: boolean
}

export const Skeleton = forwardRef<HTMLSpanElement, SkeletonProps>(
  function Skeleton(
    { shape = "rect", decorative = true, className, ...rest },
    ref
  ) {
    const classes = ["lead-Skeleton", className].filter(Boolean).join(" ")
    return (
      <span
        ref={ref}
        {...rest}
        className={classes}
        data-shape={shape}
        aria-hidden={decorative ? "true" : undefined}
        role={decorative ? "none" : "status"}
      />
    )
  }
)
