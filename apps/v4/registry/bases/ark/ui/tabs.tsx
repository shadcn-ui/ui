"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Tabs as TabsPrimitive } from "@ark-ui/react/tabs"

import { cn } from "@/registry/bases/ark/lib/utils"

const Tabs = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Root
    ref={ref}
    data-slot="tabs"
    className={cn("cn-tabs", className)}
    {...props}
  />
))
Tabs.displayName = "Tabs"

const tabsListVariants = cva(
  "cn-tabs-list group/tabs-list inline-flex w-fit items-center justify-center text-muted-foreground group-data-vertical/tabs:h-fit group-data-vertical/tabs:flex-col",
  {
    variants: {
      variant: {
        default: "cn-tabs-list-variant-default bg-muted",
        line: "cn-tabs-list-variant-line gap-1 bg-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> &
    VariantProps<typeof tabsListVariants>
>(({ className, variant = "default", ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    data-slot="tabs-list"
    data-variant={variant}
    className={cn(tabsListVariants({ variant }), className)}
    {...props}
  />
))
TabsList.displayName = "TabsList"

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    data-slot="tabs-trigger"
    className={cn("cn-tabs-trigger", className)}
    {...props}
  />
))
TabsTrigger.displayName = "TabsTrigger"

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    data-slot="tabs-content"
    className={cn("cn-tabs-content", className)}
    {...props}
  />
))
TabsContent.displayName = "TabsContent"

const TabsIndicator = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Indicator>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Indicator>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Indicator
    ref={ref}
    data-slot="tabs-indicator"
    className={cn("cn-tabs-indicator", className)}
    {...props}
  />
))
TabsIndicator.displayName = "TabsIndicator"

// --- Context & RootProvider re-exports ---

const TabsContext = TabsPrimitive.Context
const TabsRootProvider = TabsPrimitive.RootProvider

export { Tabs, TabsContent, TabsIndicator, TabsList, TabsTrigger, tabsListVariants, TabsContext, TabsRootProvider }

export {
  useTabs,
  useTabsContext,
  type TabsValueChangeDetails,
} from "@ark-ui/react/tabs"
