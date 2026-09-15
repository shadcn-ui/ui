"use client"

import * as React from "react"
import { cn } from "cn"
import {
  DisclosurePanel as CollapsibleContentPrimitive,
  Disclosure as CollapsiblePrimitive,
  Button as CollapsibleTriggerPrimitive,
  type ButtonProps,
  type DisclosurePanelProps,
  type DisclosureProps,
} from "react-aria-components"

function Collapsible({ ...props }: DisclosureProps) {
  return <CollapsiblePrimitive data-slot="collapsible" {...props} />
}

function CollapsibleTrigger({ ...props }: ButtonProps) {
  return (
    <CollapsibleTriggerPrimitive
      slot="trigger"
      data-slot="collapsible-trigger"
      {...props}
    />
  )
}

function CollapsibleContent({
  className,
  children,
  ...props
}: Omit<DisclosurePanelProps, "className" | "children"> & {
  className?: string
  children?: React.ReactNode
}) {
  // React Aria keeps a collapsed panel in the DOM with hidden="until-found"
  // (content-visibility: hidden), so the panel still paints its own padding,
  // border and background. Styles go on an inner wrapper, like AccordionContent.
  return (
    <CollapsibleContentPrimitive data-slot="collapsible-content" {...props}>
      <div className={cn(className)}>{children}</div>
    </CollapsibleContentPrimitive>
  )
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
