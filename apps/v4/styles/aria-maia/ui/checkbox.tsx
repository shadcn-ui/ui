"use client"

import { CheckIcon } from "lucide-react"
import {
  Checkbox as CheckboxPrimitive,
  composeRenderProps,
  type CheckboxProps,
} from "react-aria-components"

import { cn } from "@/lib/utils"

function Checkbox({ className, children, ...props }: CheckboxProps) {
  return (
    <CheckboxPrimitive
      data-slot="checkbox"
      className={cn(
        "peer relative flex size-4 shrink-0 items-center justify-center rounded-[6px] border border-input transition-shadow outline-none group-has-disabled/field:opacity-50 after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 dark:bg-input/30 data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground dark:data-checked:bg-primary data-invalid:border-destructive data-invalid:ring-[3px] data-invalid:ring-destructive/20 data-invalid:aria-checked:border-primary dark:data-invalid:border-destructive/50 dark:data-invalid:ring-destructive/40",
        className
      )}
      {...props}
    >
      {composeRenderProps(
        children,
        (children, { isSelected, isIndeterminate }) => (
          <>
            <span
              data-slot="checkbox-indicator"
              className="grid place-content-center text-current transition-none [&>svg]:size-3.5"
            >
              {(isSelected || isIndeterminate) && <CheckIcon />}
            </span>
            {children}
          </>
        )
      )}
    </CheckboxPrimitive>
  )
}

export { Checkbox }
