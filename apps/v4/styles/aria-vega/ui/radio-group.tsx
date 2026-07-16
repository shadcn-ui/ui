"use client"

import {
  composeRenderProps,
  RadioGroup as RadioGroupPrimitive,
  Radio as RadioPrimitive,
  type RadioGroupProps,
  type RadioProps,
} from "react-aria-components"

import { cn } from "@/lib/utils"

function RadioGroup({ className, ...props }: RadioGroupProps) {
  return (
    <RadioGroupPrimitive
      data-slot="radio-group"
      className={cn("grid w-full gap-3", className)}
      {...props}
    />
  )
}

function RadioGroupItem({ className, children, ...props }: RadioProps) {
  return (
    <RadioPrimitive
      data-slot="radio-group-item"
      className={cn(
        "group/radio-group-item peer relative flex aspect-square size-4 shrink-0 rounded-full border border-input outline-none after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 dark:bg-input/30 data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground dark:data-checked:bg-primary data-invalid:border-destructive data-invalid:ring-3 data-invalid:ring-destructive/20 data-invalid:aria-checked:border-primary dark:data-invalid:border-destructive/50 dark:data-invalid:ring-destructive/40",
        className
      )}
      {...props}
    >
      {composeRenderProps(children, (children, { isSelected }) => (
        <>
          <span
            data-slot="radio-group-indicator"
            className="flex size-4 items-center justify-center"
          >
            {isSelected && (
              <span className="absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-foreground" />
            )}
          </span>
          {children}
        </>
      ))}
    </RadioPrimitive>
  )
}

export { RadioGroup, RadioGroupItem }
