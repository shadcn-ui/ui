"use client"

import * as React from "react"
import { RadioGroup as RadioGroupPrimitive } from "radix-ui"

import { cn } from "@/examples/radix/lib/utils"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn("grid gap-2 w-full", className)}
      {...props}
    />
  )
}

function RadioGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        "border-input text-primary dark:bg-input/30 focus-visible:border-eing focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 flex size-4 rounded-full focus-visible:ring-[3px] aria-invalid:ring-[3px] group/radio-group-item peer relative aspect-square shrink-0 border outline-none after:absolute after:-inset-x-3 after:-inset-y-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="group-aria-invalid/radio-group-item:text-destructive text-primary flex size-4 items-center justify-center"
      >
        <IconPlaceholder
          lucide="CircleIcon"
          tabler="IconCircle"
          hugeicons="CircleIcon"
          phosphor="CircleIcon"
          remixicon="RiCircleLine"
          className="absolute top-1/2 start-1/2 size-2 -translate-x-1/2 rtl:translate-x-1/2 -translate-y-1/2 fill-current"
        />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
}

export { RadioGroup, RadioGroupItem }
