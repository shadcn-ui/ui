import React from "react"
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu"
import { cva, type VariantProps } from "class-variance-authority"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

const NavigationMenu: React.FC<NavigationMenuPrimitive.NavigationMenuProps> = ({
  className,
  ...props
}) => (
  <NavigationMenuPrimitive.Root
    className={cn("relative z-[1] flex flex-1 justify-center", className)}
    {...props}
  />
)

const NavigationMenuList: React.FC<
  NavigationMenuPrimitive.NavigationMenuListProps
> = ({ className, ...props }) => (
  <NavigationMenuPrimitive.List
    className={cn(
      "group flex flex-1 list-none justify-center rounded-md border border-slate-300 bg-white p-1 dark:border-slate-700 dark:bg-slate-800",
      className
    )}
    {...props}
  />
)

const NavigationMenuItem = NavigationMenuPrimitive.NavigationMenuItem

const navigationMenuTriggerStyle = cva(
  "rounded-md py-2 px-3 font-medium leading-none hover:bg-slate-100 focus:shadow-sm focus:ring-2 focus:ring-slate-300 focus:bg-slate-100 dark:focus:bg-slate-700 dark:hover:bg-slate-700 dark:focus:ring-slate-500 outline-none w-full transition-all duration-300"
)

const NavigationMenuTrigger: React.FC<
  NavigationMenuPrimitive.NavigationMenuTriggerProps
> = ({ className, children, ...props }) => (
  <NavigationMenuPrimitive.Trigger
    className={cn(
      navigationMenuTriggerStyle(),
      "group flex items-center justify-center gap-0.5",
      className
    )}
    {...props}
  >
    {children}{" "}
    <ChevronDown
      className="relative top-[1px] h-4 w-4 transition duration-200 group-data-[state=open]:rotate-180"
      aria-hidden
    />
  </NavigationMenuPrimitive.Trigger>
)

const navigationMenuLinkVariants = cva([], {
  variants: {
    variant: {
      default: cn(navigationMenuTriggerStyle(), "block leading-none"),
      unstyled: "",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

const NavigationMenuLink: React.FC<
  NavigationMenuPrimitive.NavigationMenuLinkProps &
    VariantProps<typeof navigationMenuLinkVariants>
> = ({ className, variant, ...props }) => (
  <NavigationMenuPrimitive.Link
    className={cn(navigationMenuLinkVariants({ variant, className }))}
    {...props}
  />
)

const NavigationMenuContent: React.FC<
  NavigationMenuPrimitive.NavigationMenuContentProps
> = ({ className, ...props }) => (
  <NavigationMenuPrimitive.Content
    className={cn(
      [
        "absolute top-0 left-0 w-full duration-300 md:w-auto",
        "data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=to-start]:slide-out-to-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=from-end]:slide-in-from-right-52",
      ],
      className
    )}
    {...props}
  />
)

const NavigationMenuIndicator: React.FC<
  NavigationMenuPrimitive.NavigationMenuIndicatorProps
> = ({ className, ...props }) => (
  <NavigationMenuPrimitive.Indicator
    className={cn(
      "top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=visible]:fade-in data-[state=hidden]:fade-out",
      className
    )}
    {...props}
  >
    <div className="relative top-[60%] h-1.5 w-1.5 rotate-45 rounded-tl-sm bg-slate-200 dark:bg-slate-700" />
  </NavigationMenuPrimitive.Indicator>
)

const NavigationMenuViewport: React.FC<
  NavigationMenuPrimitive.NavigationMenuViewportProps
> = ({ className, ...props }) => (
  <div
    className={cn("absolute left-0 top-full flex w-full justify-center")}
    id="viewport"
  >
    <NavigationMenuPrimitive.Viewport
      className={cn(
        "origin-top-center relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border border-slate-200 bg-white shadow-lg data-[state=open]:animate-in data-[state=open]:zoom-in dark:border-slate-700 dark:bg-slate-800 md:w-[var(--radix-navigation-menu-viewport-width)]",
        className
      )}
      {...props}
    />
  </div>
)

const NavigationMenuSub = NavigationMenuPrimitive.Sub

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuSub,
  NavigationMenuViewport,
}
