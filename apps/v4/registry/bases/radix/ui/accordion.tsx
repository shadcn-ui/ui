"use client"

import * as React from "react"
import { Accordion as AccordionPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"
import { IconPlaceholder } from "@/app/(design)/design/components/icon-placeholder"

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
      className={cn("cn-accordion-item", className)}
      {...props}
    />
  )
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "cn-accordion-trigger focus-visible:border-ring focus-visible:ring-ring/50 group/accordion-trigger flex flex-1 items-start justify-between transition-all outline-none hover:underline focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50",
          className
        )}
        {...props}
      >
        {children}
        <IconPlaceholder
          lucide="ChevronDownIcon"
          tabler="IconCircleChevronDown"
          data-slot="accordion-trigger-icon-closed"
          hugeicons="ArrowDown01Icon"
          className="cn-accordion-trigger-icon group-data-[state=open]/accordion-trigger:hidden"
        />
        <IconPlaceholder
          lucide="ChevronUpIcon"
          tabler="IconCircleChevronUp"
          data-slot="accordion-trigger-icon-open"
          hugeicons="ArrowUp01Icon"
          className="cn-accordion-trigger-icon group-data-[state=closed]/accordion-trigger:hidden"
        />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className="cn-accordion-content overflow-hidden"
      {...props}
    >
      <div className={cn("cn-accordion-content-inner", className)}>
        {children}
      </div>
    </AccordionPrimitive.Content>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
