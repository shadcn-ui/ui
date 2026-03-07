"use client"

import {
  Button as CollapsibleTriggerPrimitive,
  Disclosure as CollapsiblePrimitive,
  DisclosurePanel as CollapsibleContentPrimitive,
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

function CollapsibleContent({ ...props }: DisclosurePanelProps) {
  return (
    <CollapsibleContentPrimitive data-slot="collapsible-content" {...props} />
  )
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
