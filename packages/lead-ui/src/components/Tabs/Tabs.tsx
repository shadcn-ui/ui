import * as RadixTabs from "@radix-ui/react-tabs"
import { createContext, forwardRef, useContext } from "react"
import type { ComponentPropsWithoutRef, ElementRef } from "react"

import "../../tokens.css"
import "./Tabs.css"

export type TabsSize = "sm" | "md" | "lg"

interface TabsContextValue {
  size: TabsSize
}

const TabsContext = createContext<TabsContextValue>({ size: "md" })

export interface TabsProps
  extends ComponentPropsWithoutRef<typeof RadixTabs.Root> {
  /**
   * Size cascades from Tabs root to TabsTriggers via context. Items
   * may override per-trigger.
   */
  size?: TabsSize
}

export const Tabs = forwardRef<
  ElementRef<typeof RadixTabs.Root>,
  TabsProps
>(function Tabs({ size = "md", className, children, ...rest }, ref) {
  const classes = ["lead-Tabs", className].filter(Boolean).join(" ")
  return (
    <TabsContext.Provider value={{ size }}>
      <RadixTabs.Root ref={ref} {...rest} className={classes}>
        {children}
      </RadixTabs.Root>
    </TabsContext.Provider>
  )
})

export interface TabsListProps
  extends Omit<ComponentPropsWithoutRef<typeof RadixTabs.List>, "asChild"> {}

export const TabsList = forwardRef<
  ElementRef<typeof RadixTabs.List>,
  TabsListProps
>(function TabsList({ className, ...rest }, ref) {
  const classes = ["lead-TabsList", className].filter(Boolean).join(" ")
  return <RadixTabs.List ref={ref} {...rest} className={classes} />
})

export interface TabsTriggerProps
  extends Omit<
    ComponentPropsWithoutRef<typeof RadixTabs.Trigger>,
    "asChild"
  > {
  size?: TabsSize
}

export const TabsTrigger = forwardRef<
  ElementRef<typeof RadixTabs.Trigger>,
  TabsTriggerProps
>(function TabsTrigger({ size, className, ...rest }, ref) {
  const ctx = useContext(TabsContext)
  const resolvedSize = size ?? ctx.size
  const classes = ["lead-TabsTrigger", className].filter(Boolean).join(" ")
  return (
    <RadixTabs.Trigger
      ref={ref}
      {...rest}
      className={classes}
      data-size={resolvedSize}
    />
  )
})

export interface TabsContentProps
  extends Omit<
    ComponentPropsWithoutRef<typeof RadixTabs.Content>,
    "asChild"
  > {}

export const TabsContent = forwardRef<
  ElementRef<typeof RadixTabs.Content>,
  TabsContentProps
>(function TabsContent({ className, ...rest }, ref) {
  const classes = ["lead-TabsContent", className].filter(Boolean).join(" ")
  return <RadixTabs.Content ref={ref} {...rest} className={classes} />
})
