"use client"

import {
  composeRenderProps,
  Switch as SwitchPrimitive,
  type SwitchProps as SwitchPrimitiveProps,
} from "react-aria-components"

import { cn } from "@/lib/utils"

function Switch({
  className,
  size = "default",
  children,
  ...props
}: SwitchPrimitiveProps & {
  size?: "sm" | "default"
}) {
  return (
    <SwitchPrimitive
      data-slot="switch"
      data-size={size}
      className={cn(
        "peer group/switch relative inline-flex shrink-0 items-center rounded-none border transition-all outline-none after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 data-[size=default]:h-4.5 data-[size=default]:w-8.25 data-[size=sm]:h-3.5 data-[size=sm]:w-6.25 data-checked:border-primary data-checked:bg-primary data-unchecked:border-input/50 data-unchecked:bg-input data-disabled:cursor-not-allowed data-disabled:opacity-50 data-invalid:border-destructive data-invalid:ring-2 data-invalid:ring-destructive/20 dark:data-invalid:border-destructive/50 dark:data-invalid:ring-destructive/40",
        className
      )}
      {...props}
    >
      {composeRenderProps(children, (children, { isSelected }) => (
        <>
          <span
            data-slot="switch-thumb"
            data-selected={isSelected || undefined}
            className="pointer-events-none block bg-background ring-0 transition-transform group-data-[size=default]/switch:size-3.5 group-data-[size=sm]/switch:size-2.5 data-checked:translate-x-[calc(100%+2px)] dark:data-checked:bg-primary-foreground data-unchecked:translate-x-0.25 dark:data-unchecked:bg-foreground"
          />
          {children}
        </>
      ))}
    </SwitchPrimitive>
  )
}

export { Switch }
