"use client"

import React, { ComponentProps } from "react"

import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu"

//TODO: Find a way to make the design vertical when orientation is provided
// Should be possible with group-data-[orientation=vertical]

export const NavigationMenuVertical = () => {
  return (
    <NavigationMenu orientation="vertical">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Learn</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-x-2.5 p-6 md:w-[500px] md:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink variant="unstyled" asChild>
                  <a
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-br from-purple-500 to-yellow-500 p-6 no-underline outline-none focus:shadow-md"
                    href="/"
                  >
                    <Icons.logo className="h-6 w-6" />
                    <div className="mt-4 mb-2 text-lg font-medium">
                      shadcn/ui
                    </div>
                    <p className="leading-tight text-black/90 dark:text-white/90">
                      Beautifully designed components built with Radix UI and
                      Tailwind CSS.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>

              <ListItem href="https://stitches.dev/" title="Stitches">
                CSS-in-JS with best-in-class developer experience.
              </ListItem>
              <ListItem href="/colors" title="Colors">
                Beautiful, thought-out palettes with auto dark mode.
              </ListItem>
              <ListItem href="https://icons.radix-ui.com/" title="Icons">
                A crisp set of 15x15 icons, balanced and consistent.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>Overview</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-x-2.5 p-6 md:w-[600px] md:grid-cols-3">
              <ListItem
                title="Introduction"
                href="/docs/primitives/overview/introduction"
              >
                Build high-quality, accessible design systems and web apps.
              </ListItem>
              <ListItem
                title="Getting started"
                href="/docs/primitives/overview/getting-started"
              >
                A quick tutorial to get you up and running with Radix
                Primitives.
              </ListItem>
              <ListItem
                title="Styling"
                href="/docs/primitives/overview/styling"
              >
                Unstyled and compatible with any styling solution.
              </ListItem>
              <ListItem
                title="Animation"
                href="/docs/primitives/overview/animation"
              >
                Use CSS keyframes or any animation library of your choice.
              </ListItem>
              <ListItem
                title="Accessibility"
                href="/docs/primitives/overview/accessibility"
              >
                Tested in a range of browsers and assistive technologies.
              </ListItem>
              <ListItem
                title="Releases"
                href="/docs/primitives/overview/releases"
              >
                Radix Primitives releases and their changelogs.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink href="https://github.com/shadcn/ui">
            Github
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuIndicator />
      </NavigationMenuList>
      <NavigationMenuViewport />
    </NavigationMenu>
  )
}

const ListItem = React.forwardRef<
  HTMLAnchorElement,
  { title: string } & ComponentProps<"a">
>(({ className, children, title, ...props }, ref) => (
  <li>
    <NavigationMenuLink variant="unstyled" asChild>
      <a
        className={cn(
          "block select-none rounded-md p-3 leading-none no-underline outline-none hover:bg-slate-100 focus:shadow-md dark:hover:bg-slate-700",
          className
        )}
        {...props}
        ref={ref}
      >
        <div className="mb-1 text-sm font-medium leading-tight text-slate-700 dark:text-slate-200">
          {title}
        </div>
        <p className="text-sm leading-snug text-slate-500 dark:text-slate-400">
          {children}
        </p>
      </a>
    </NavigationMenuLink>
  </li>
))

ListItem.displayName = "ListItem"
