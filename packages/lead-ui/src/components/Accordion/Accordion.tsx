import * as RadixAccordion from "@radix-ui/react-accordion"
import { forwardRef } from "react"
import type { ComponentPropsWithoutRef, ElementRef } from "react"

import "../../tokens.css"
import "./Accordion.css"

/**
 * Accordion root. Forwards Radix's `type` ("single" | "multiple"),
 * `value` / `defaultValue` / `onValueChange`, `collapsible`, `disabled`,
 * `dir`, and `orientation` props.
 *
 * Note on typing: Radix exports separate prop interfaces for the two
 * `type` modes (`SingleProps` vs. `MultipleProps`); we re-export the
 * union directly so callers can use whichever they need.
 */
export type AccordionProps = ComponentPropsWithoutRef<
  typeof RadixAccordion.Root
>

export const Accordion = forwardRef<
  ElementRef<typeof RadixAccordion.Root>,
  AccordionProps
>(function Accordion({ className, ...rest }, ref) {
  const classes = ["lead-Accordion", className].filter(Boolean).join(" ")
  return (
    <RadixAccordion.Root
      ref={ref}
      {...(rest as ComponentPropsWithoutRef<typeof RadixAccordion.Root>)}
      className={classes}
    />
  )
})

export interface AccordionItemProps
  extends Omit<
    ComponentPropsWithoutRef<typeof RadixAccordion.Item>,
    "asChild"
  > {}

export const AccordionItem = forwardRef<
  ElementRef<typeof RadixAccordion.Item>,
  AccordionItemProps
>(function AccordionItem({ className, ...rest }, ref) {
  const classes = ["lead-AccordionItem", className].filter(Boolean).join(" ")
  return <RadixAccordion.Item ref={ref} {...rest} className={classes} />
})

function ChevronDown() {
  return (
    <svg
      className="lead-AccordionTrigger__chevron"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

export interface AccordionTriggerProps
  extends Omit<
    ComponentPropsWithoutRef<typeof RadixAccordion.Trigger>,
    "asChild"
  > {}

export const AccordionTrigger = forwardRef<
  ElementRef<typeof RadixAccordion.Trigger>,
  AccordionTriggerProps
>(function AccordionTrigger({ className, children, ...rest }, ref) {
  const classes = ["lead-AccordionTrigger", className]
    .filter(Boolean)
    .join(" ")
  return (
    <RadixAccordion.Header className="lead-AccordionHeader">
      <RadixAccordion.Trigger ref={ref} {...rest} className={classes}>
        <span>{children}</span>
        <ChevronDown />
      </RadixAccordion.Trigger>
    </RadixAccordion.Header>
  )
})

export interface AccordionContentProps
  extends Omit<
    ComponentPropsWithoutRef<typeof RadixAccordion.Content>,
    "asChild"
  > {}

export const AccordionContent = forwardRef<
  ElementRef<typeof RadixAccordion.Content>,
  AccordionContentProps
>(function AccordionContent({ className, children, ...rest }, ref) {
  const classes = ["lead-AccordionContent", className]
    .filter(Boolean)
    .join(" ")
  return (
    <RadixAccordion.Content ref={ref} {...rest} className={classes}>
      <div className="lead-AccordionContent__inner">{children}</div>
    </RadixAccordion.Content>
  )
})
