"use client"

import * as React from "react"
import { Accordion as AccordionPrimitive } from "@ark-ui/react/accordion"

import { cn } from "@/examples/ark/lib/utils"
import { ChevronDownIcon } from "lucide-react"

function Accordion({
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return <AccordionPrimitive.Root data-slot="accordion" {...props} />
}

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("not-last:border-b", className)}
      {...props}
    />
  )
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.ItemTrigger>) {
  return (
    <AccordionPrimitive.ItemTrigger
      data-slot="accordion-trigger"
      className={cn(
        "group/trigger rounded-lg py-2.5 text-start text-sm font-medium hover:underline focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:after:border-ring **:data-[slot=accordion-trigger-icon]:ms-auto **:data-[slot=accordion-trigger-icon]:size-4 **:data-[slot=accordion-trigger-icon]:text-muted-foreground",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDownIcon className="" />
    </AccordionPrimitive.ItemTrigger>
  )
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.ItemContent>) {
  return (
    <AccordionPrimitive.ItemContent
      data-slot="accordion-content"
      className={cn(
        "text-sm data-open:animate-accordion-down data-closed:animate-accordion-up",
        className
      )}
      {...props}
    >
      <div className="pt-0 pb-2.5">{children}</div>
    </AccordionPrimitive.ItemContent>
  )
}

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger }
