"use client"

import {
  composeRenderProps,
  Switch as SwitchPrimitive,
  type SwitchProps as SwitchPrimitiveProps,
} from "react-aria-components"

import { cn } from "@/registry/aria-nova/lib/utils"

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
        "peer group/switch relative inline-flex shrink-0 items-center rounded-full border border-transparent transition-all outline-none not-data-selected:bg-input after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 data-focus-visible:border-ring data-focus-visible:ring-3 data-focus-visible:ring-ring/50 data-invalid:border-destructive data-invalid:ring-3 data-invalid:ring-destructive/20 data-[size=default]:h-[18.4px] data-[size=default]:w-[32px] data-[size=sm]:h-[14px] data-[size=sm]:w-[24px] dark:not-data-selected:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 dark:data-invalid:border-destructive/50 dark:data-invalid:ring-destructive/40 data-checked:bg-primary data-unchecked:bg-input dark:data-unchecked:bg-input/80 data-selected:bg-primary data-disabled:cursor-not-allowed data-disabled:opacity-50",
        className
      )}
      {...props}
    >
      {composeRenderProps(children, (children, { isSelected }) => (
        <>
          <span
            data-slot="switch-thumb"
            data-selected={isSelected || undefined}
            className="pointer-events-none block rounded-full bg-background ring-0 transition-transform group-data-[size=default]/switch:size-4 group-data-[size=default]/switch:not-data-selected:translate-x-0 group-data-[size=sm]/switch:size-3 group-data-[size=sm]/switch:not-data-selected:translate-x-0 dark:not-data-selected:bg-foreground group-data-[size=default]/switch:data-checked:translate-x-[calc(100%-2px)] group-data-[size=sm]/switch:data-checked:translate-x-[calc(100%-2px)] dark:data-checked:bg-primary-foreground group-data-[size=default]/switch:data-unchecked:translate-x-0 group-data-[size=sm]/switch:data-unchecked:translate-x-0 dark:data-unchecked:bg-foreground group-data-[size=default]/switch:data-selected:translate-x-[calc(100%-2px)] group-data-[size=sm]/switch:data-selected:translate-x-[calc(100%-2px)] dark:data-selected:bg-primary-foreground"
          />
          {children}
        </>
      ))}
    </SwitchPrimitive>
  )
}

export { Switch }
