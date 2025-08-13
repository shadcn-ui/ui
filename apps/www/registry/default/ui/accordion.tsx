"use client"

import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { Slot } from "@radix-ui/react-slot"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

const Accordion = AccordionPrimitive.Root

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn("border-b", className)}
    {...props}
  />
))
AccordionItem.displayName = "AccordionItem"

interface AccordionTriggerProps
  extends React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> {
  asChild?: boolean
  hideIcon?: boolean
  icon?: React.ReactNode
}

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  AccordionTriggerProps
>(
  (
    { className, children, asChild = false, hideIcon = false, icon, ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : "button"
    const chevronIcon = icon || (
      <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
    )

    return (
      <AccordionPrimitive.Header className="flex">
        <AccordionPrimitive.Trigger ref={ref} asChild>
          <Comp
            className={cn(
              "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
              className
            )}
            {...props}
          >
            {asChild ? (
              children
            ) : (
              <>
                {children}
                {!hideIcon && chevronIcon}
              </>
            )}
          </Comp>
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>
    )
  }
)
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-sm transition-all"
    {...props}
  >
    <div className={cn("pb-4 pt-0", className)}>{children}</div>
  </AccordionPrimitive.Content>
))
AccordionContent.displayName = AccordionPrimitive.Content.displayName

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
