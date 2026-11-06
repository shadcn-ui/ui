"use client"

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

function CollapsibleContent({ className, ...props }: DisclosurePanelProps) {
  return (
    <CollapsibleContentPrimitive
      data-slot="collapsible-content"
      // A collapsed panel stays in the DOM with hidden="until-found" so find-in-page
      // can reveal it. That hides the contents only, so the panel keeps painting its
      // own box until it is collapsed here.
      className={cn(
        "[&[hidden]]:m-0 [&[hidden]]:h-0 [&[hidden]]:min-h-0 [&[hidden]]:border-0 [&[hidden]]:p-0 [&[hidden]]:shadow-none",
        className
      )}
      {...props}
    />
  )
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
