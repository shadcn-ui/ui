"use client"

import * as React from "react"
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group"

import { cn } from "@/lib/utils"

const ToggleGroup = ToggleGroupPrimitive.Root

const ToggleGroupItem = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <ToggleGroupPrimitive.Item
    ref={ref}
    className={cn(
      "ml-[1px] inline-flex h-10 items-center justify-center bg-slate-900 px-3 text-sm font-medium text-white transition-colors first:ml-0 first:rounded-l last:rounded-r hover:bg-slate-700 focus:relative focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-slate-500 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-100 dark:focus:ring-offset-slate-900 dark:data-[state=on]:bg-slate-500 dark:data-[state=on]:text-slate-100"
    )}
    {...props}
  >
    {children}
  </ToggleGroupPrimitive.Item>
))

ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName

export { ToggleGroup, ToggleGroupItem }
