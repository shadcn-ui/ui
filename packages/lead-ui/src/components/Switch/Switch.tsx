import * as RadixSwitch from "@radix-ui/react-switch"
import { forwardRef } from "react"
import type { ComponentPropsWithoutRef, ElementRef } from "react"

import "../../tokens.css"
import "./Switch.css"

export type SwitchSize = "sm" | "md" | "lg"

export interface SwitchProps
  extends Omit<ComponentPropsWithoutRef<typeof RadixSwitch.Root>, "asChild"> {
  size?: SwitchSize
}

export const Switch = forwardRef<
  ElementRef<typeof RadixSwitch.Root>,
  SwitchProps
>(function Switch({ size = "md", className, ...rest }, ref) {
  const classes = ["lead-Switch", className].filter(Boolean).join(" ")
  return (
    <RadixSwitch.Root
      ref={ref}
      {...rest}
      className={classes}
      data-size={size}
    >
      <RadixSwitch.Thumb className="lead-Switch__thumb" />
    </RadixSwitch.Root>
  )
})
