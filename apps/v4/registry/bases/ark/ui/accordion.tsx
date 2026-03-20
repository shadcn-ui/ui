"use client"

import * as React from "react"
import { Accordion as AccordionPrimitive } from "@ark-ui/react/accordion"

import { cn } from "@/registry/bases/ark/lib/utils"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

type AccordionProps = Omit<
  React.ComponentProps<typeof AccordionPrimitive.Root>,
  "defaultValue" | "value" | "onValueChange"
> & {
  type?: "single" | "multiple"
  collapsible?: boolean
  defaultValue?: string | string[]
  value?: string | string[]
  onValueChange?: (value: string) => void
}

const Accordion = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Root>,
  AccordionProps
>(({ type, defaultValue, value, onValueChange, ...props }, ref) => (
  <AccordionPrimitive.Root
    ref={ref}
    data-slot="accordion"
    multiple={type === "multiple"}
    defaultValue={
      defaultValue
        ? Array.isArray(defaultValue)
          ? defaultValue
          : [defaultValue]
        : undefined
    }
    value={
      value
        ? Array.isArray(value)
          ? value
          : [value]
        : undefined
    }
    onValueChange={
      onValueChange
        ? (details) => onValueChange(details.value[0] ?? "")
        : undefined
    }
    className={cn("cn-accordion flex w-full flex-col", props.className)}
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
    className={cn("cn-accordion-item", className)}
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
      "cn-accordion-trigger group/accordion-trigger relative flex flex-1 items-start justify-between border border-transparent transition-all outline-none disabled:pointer-events-none disabled:opacity-50",
      className
    )}
    {...props}
  >
    {children}
    <IconPlaceholder
      lucide="ChevronDownIcon"
      tabler="IconChevronDown"
      data-slot="accordion-trigger-icon"
      hugeicons="ArrowDown01Icon"
      phosphor="CaretDownIcon"
      remixicon="RiArrowDownSLine"
      className="cn-accordion-trigger-icon pointer-events-none shrink-0 group-aria-expanded/accordion-trigger:hidden"
    />
    <IconPlaceholder
      lucide="ChevronUpIcon"
      tabler="IconChevronUp"
      data-slot="accordion-trigger-icon"
      hugeicons="ArrowUp01Icon"
      phosphor="CaretUpIcon"
      remixicon="RiArrowUpSLine"
      className="cn-accordion-trigger-icon pointer-events-none hidden shrink-0 group-aria-expanded/accordion-trigger:inline"
    />
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
    className="cn-accordion-content overflow-hidden"
    {...props}
  >
    <div
      className={cn(
        "cn-accordion-content-inner [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4",
        className
      )}
    >
      {children}
    </div>
  </AccordionPrimitive.ItemContent>
))
AccordionContent.displayName = "AccordionContent"

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
