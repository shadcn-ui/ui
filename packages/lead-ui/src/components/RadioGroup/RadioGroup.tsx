import * as RadixRadioGroup from "@radix-ui/react-radio-group"
import { createContext, forwardRef, useContext } from "react"
import type { ComponentPropsWithoutRef, ElementRef } from "react"

import "../../tokens.css"
import "./RadioGroup.css"

export type RadioGroupSize = "sm" | "md" | "lg"

interface RadioGroupContextValue {
  size: RadioGroupSize
}

const RadioGroupContext = createContext<RadioGroupContextValue>({ size: "md" })

export interface RadioGroupProps
  extends Omit<
    ComponentPropsWithoutRef<typeof RadixRadioGroup.Root>,
    "asChild"
  > {
  size?: RadioGroupSize
}

export const RadioGroup = forwardRef<
  ElementRef<typeof RadixRadioGroup.Root>,
  RadioGroupProps
>(function RadioGroup({ size = "md", className, children, ...rest }, ref) {
  const classes = ["lead-RadioGroup", className].filter(Boolean).join(" ")
  return (
    <RadioGroupContext.Provider value={{ size }}>
      <RadixRadioGroup.Root
        ref={ref}
        {...rest}
        className={classes}
        data-size={size}
      >
        {children}
      </RadixRadioGroup.Root>
    </RadioGroupContext.Provider>
  )
})

export interface RadioGroupItemProps
  extends Omit<
    ComponentPropsWithoutRef<typeof RadixRadioGroup.Item>,
    "asChild"
  > {
  size?: RadioGroupSize
}

export const RadioGroupItem = forwardRef<
  ElementRef<typeof RadixRadioGroup.Item>,
  RadioGroupItemProps
>(function RadioGroupItem({ size, className, ...rest }, ref) {
  const ctx = useContext(RadioGroupContext)
  const resolvedSize = size ?? ctx.size
  const classes = ["lead-RadioGroupItem", className].filter(Boolean).join(" ")
  return (
    <RadixRadioGroup.Item
      ref={ref}
      {...rest}
      className={classes}
      data-size={resolvedSize}
    >
      <RadixRadioGroup.Indicator className="lead-RadioGroupItem__indicator" />
    </RadixRadioGroup.Item>
  )
})
