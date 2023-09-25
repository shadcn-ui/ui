"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"
import { cva } from "class-variance-authority"
import { Icon, IconType } from "./icon"

const Tabs = TabsPrimitive.Root


const tabListVariants = cva(
  "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground max-w-full overflow-x-auto overflow-y-clip",
  {
    variants: {
      variant: {
        default: "",
        underline: "bg-background border-b border-muted shadow-none rounded-none py-6 p-0",
        bar: "bg-background p-0 flex h-full rounded-md border-muted border-2 shadow-none",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  { variant?: "default" | "underline" | "bar" } &
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, variant, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(tabListVariants({ variant: variant ? variant : "default", className }))}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const tabsTriggerVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm ",
  {
    variants: {
      variant: {
        default: "",
        underline:
          "border-b-2 border-transparent pb-3 first-of-type:px-2 w-full ring-offset-0 rounded-none data-[state=active]:border-primary data-[state=active]:text-primary ring-0 bg-transparent shadow-none data-[state=active]:shadow-none",
        bar:
          "border-b-2 border-transparent border-r-2 last-of-type:border-r-0 border-r-muted h-full py-6 w-full rounded-none data-[state=active]:border-b-primary data-[state=active]:text-primary ring-0 shadow-none data-[state=active]:shadow-none",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  {
    variant?: "default" | "underline" | "bar";
    icon?: IconType;
    iconClassName?: string;
    badge?: string;
  } &
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, variant, children, icon, iconClassName, badge, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(tabsTriggerVariants({ variant: variant ? variant : "default", className: className + (icon !== undefined ? " first-of-type:pl-20 sm:first-of-type:pl-2" : "") }))}
    {...props}
  >
    <div>
      {icon && <Icon name={icon || "check-solid"} className={cn("w-4 h-4 pr-2", iconClassName)} />}
      {children}
      {badge && <span className="ml-3 rounded-xl py-1 px-2 text-xs text-primary bg-primary-foreground">{badge}</span>}

    </div>
  </TabsPrimitive.Trigger>
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
