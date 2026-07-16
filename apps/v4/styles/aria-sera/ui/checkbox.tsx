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
        "peer relative flex size-4.5 shrink-0 items-center justify-center rounded-none border border-input bg-transparent transition-shadow outline-none group-has-disabled/field:opacity-50 after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground dark:data-checked:bg-primary data-invalid:border-destructive data-invalid:ring-2 data-invalid:ring-destructive/20 data-invalid:aria-checked:border-primary dark:data-invalid:border-destructive/50 dark:data-invalid:ring-destructive/40",
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
