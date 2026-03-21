"use client"

import * as React from "react"
import { Accordion as AccordionPrimitive } from "@ark-ui/react/accordion"

import { cn } from "@/examples/ark/lib/utils"
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react"

const Accordion = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Root
    ref={ref}
    data-slot="accordion"
    className={cn("flex w-full flex-col", className)}
    {...props}
  />
))
Accordion.displayName = "Accordion"

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    data-slot="accordion-item"
    className={cn("not-last:border-b", className)}
    {...props}
  />
))
AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.ItemTrigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.ItemTrigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.ItemTrigger
    ref={ref}
    data-slot="accordion-trigger"
    className={cn(
      "group/accordion-trigger relative flex flex-1 items-start justify-between rounded-lg border border-transparent py-2.5 text-start text-sm font-medium transition-all outline-none hover:underline focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:after:border-ring disabled:pointer-events-none disabled:opacity-50 **:data-[slot=accordion-trigger-icon]:ms-auto **:data-[slot=accordion-trigger-icon]:size-4 **:data-[slot=accordion-trigger-icon]:text-muted-foreground",
      className
    )}
    {...props}
  >
    {children}
    <ChevronDownIcon data-slot="accordion-trigger-icon" className="pointer-events-none shrink-0 group-aria-expanded/accordion-trigger:hidden" />
    <ChevronUpIcon data-slot="accordion-trigger-icon" className="pointer-events-none hidden shrink-0 group-aria-expanded/accordion-trigger:inline" />
  </AccordionPrimitive.ItemTrigger>
))
AccordionTrigger.displayName = "AccordionTrigger"

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.ItemContent>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.ItemContent>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.ItemContent
    ref={ref}
    data-slot="accordion-content"
    className="overflow-hidden text-sm data-open:animate-accordion-down data-closed:animate-accordion-up"
    {...props}
  >
    <div
      className={cn(
        "pt-0 pb-2.5 [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4",
        className
      )}
    >
      {children}
    </div>
  </AccordionPrimitive.ItemContent>
))
AccordionContent.displayName = "AccordionContent"

const AccordionItemIndicator = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.ItemIndicator>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.ItemIndicator>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.ItemIndicator
    ref={ref}
    data-slot="accordion-item-indicator"
    className={cn(className)}
    {...props}
  />
))
AccordionItemIndicator.displayName = "AccordionItemIndicator"

const AccordionItemContext = AccordionPrimitive.ItemContext
const AccordionContext = AccordionPrimitive.Context
const AccordionRootProvider = AccordionPrimitive.RootProvider

export {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  AccordionItemIndicator,
  AccordionItemContext,
  AccordionContext,
  AccordionRootProvider,
}

export {
  useAccordion,
  useAccordionContext,
  useAccordionItemContext,
  type AccordionValueChangeDetails,
} from "@ark-ui/react/accordion"
