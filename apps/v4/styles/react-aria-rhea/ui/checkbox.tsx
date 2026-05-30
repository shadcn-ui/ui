"use client"

import { CheckIcon } from "lucide-react"
import {
  Checkbox as CheckboxPrimitive,
  type CheckboxProps,
} from "react-aria-components"

import { cn } from "@/lib/utils"

function Checkbox({ className, children, ...props }: CheckboxProps) {
  return (
    <CheckboxPrimitive
      data-slot="checkbox"
      className={cn(
        "peer relative flex size-4 shrink-0 items-center justify-center rounded-[5px] border border-transparent bg-input/90 transition-shadow outline-none group-has-disabled/field:opacity-50 after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 aria-invalid:aria-checked:border-primary data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground dark:data-checked:bg-primary",
        className
      )}
      {...props}
    >
      {({ isSelected, isIndeterminate }) => (
        <>
          <span
            data-slot="checkbox-indicator"
            className="grid place-content-center text-current transition-none [&>svg]:size-3.5"
          >
            {(isSelected || isIndeterminate) && <CheckIcon />}
          </span>
          {children}
        </>
      )}
    </CheckboxPrimitive>
  )
}

export { Checkbox }
