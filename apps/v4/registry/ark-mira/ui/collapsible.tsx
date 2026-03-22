"use client"

import * as React from "react"
import {
  Collapsible as CollapsiblePrimitive,
  useCollapsible,
  useCollapsibleContext,
  type CollapsibleOpenChangeDetails,
} from "@ark-ui/react/collapsible"

import { cn } from "@/registry/ark-mira/lib/utils"

const Collapsible = React.forwardRef<
  React.ElementRef<typeof CollapsiblePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Root>
>(({ ...props }, ref) => (
  <CollapsiblePrimitive.Root ref={ref} data-slot="collapsible" {...props} />
))
Collapsible.displayName = "Collapsible"

const CollapsibleTrigger = React.forwardRef<
  React.ElementRef<typeof CollapsiblePrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Trigger>
>(({ ...props }, ref) => (
  <CollapsiblePrimitive.Trigger
    ref={ref}
    data-slot="collapsible-trigger"
    {...props}
  />
))
CollapsibleTrigger.displayName = "CollapsibleTrigger"

const CollapsibleContent = React.forwardRef<
  React.ElementRef<typeof CollapsiblePrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Content>
>(({ className, ...props }, ref) => (
  <CollapsiblePrimitive.Content
    ref={ref}
    data-slot="collapsible-content"
    className={cn("overflow-hidden data-open:animate-accordion-down data-closed:animate-accordion-up", className)}
    {...props}
  />
))
CollapsibleContent.displayName = "CollapsibleContent"

const CollapsibleIndicator = React.forwardRef<
  React.ElementRef<typeof CollapsiblePrimitive.Indicator>,
  React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Indicator>
>(({ className, ...props }, ref) => (
  <CollapsiblePrimitive.Indicator
    ref={ref}
    data-slot="collapsible-indicator"
    className={cn(className)}
    {...props}
  />
))
CollapsibleIndicator.displayName = "CollapsibleIndicator"

const CollapsibleContext = CollapsiblePrimitive.Context
const CollapsibleRootProvider = CollapsiblePrimitive.RootProvider

export {
  Collapsible,
  CollapsibleContent,
  CollapsibleContext,
  CollapsibleIndicator,
  CollapsibleRootProvider,
  CollapsibleTrigger,
  useCollapsible,
  useCollapsibleContext,
  type CollapsibleOpenChangeDetails,
}
