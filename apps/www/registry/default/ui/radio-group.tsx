"use client"

import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { Circle } from "lucide-react"

import { cn } from "@/lib/utils"

const RadioGroup: React.FC<
  React.ComponentProps<typeof RadioGroupPrimitive.Root>
> = ({ className, ...props }) => (
  <RadioGroupPrimitive.Root
    className={cn("grid gap-2", className)}
    {...props}
  />
)
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName

const RadioGroupItem: React.FC<
  React.ComponentProps<typeof RadioGroupPrimitive.Item>
> = ({ className, ...props }) => (
  <RadioGroupPrimitive.Item
    className={cn(
      "border-primary text-primary ring-offset-background focus-visible:ring-ring aspect-square h-4 w-4 rounded-full border focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    {...props}
  >
    <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
      <Circle className="h-2.5 w-2.5 fill-current text-current" />
    </RadioGroupPrimitive.Indicator>
  </RadioGroupPrimitive.Item>
)
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName

export { RadioGroup, RadioGroupItem }
