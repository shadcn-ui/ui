"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
)

const Label: React.FC<
  React.ComponentProps<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
> = ({ className, ...props }) => (
  <LabelPrimitive.Root className={cn(labelVariants(), className)} {...props} />
)
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
