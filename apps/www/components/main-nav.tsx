"use client"

import * as React from "react"
import Link from "next/link"
import { allDocs } from "contentlayer/generated"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { buttonVariants } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Separator } from "@/components/ui/separator"

export function MainNav() {
  return (
    <div className="hidden md:flex">
      <Link href="/" className="mr-6 flex items-center space-x-2">
        <Icons.logo className="h-6 w-6" />
        <span className="hidden font-bold sm:inline-block">
          {siteConfig.name}
        </span>
      </Link>
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="h-9">
              Getting started
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                <li className="row-span-3">
                  <Link href="/" passHref legacyBehavior>
                    <NavigationMenuLink
                      className="flex h-full w-full select-none 
                    flex-col justify-end space-y-2 rounded-md bg-gradient-to-b from-rose-500 to-indigo-700 p-6 no-underline outline-none focus:shadow-md"
                    >
                      <div className="text-lg font-medium text-white">
                        {siteConfig.name}
                      </div>
                      <p className="text-sm leading-snug text-white/90">
                        {siteConfig.description}
                      </p>
                    </NavigationMenuLink>
                  </Link>
                </li>
                <ListItem href="/docs" title="Introduction">
                  Re-usable components built using Radix UI and Tailwind CSS.
                </ListItem>
                <ListItem href="/docs/installation" title="Installation">
                  How to install dependencies and structure your app.
                </ListItem>
                <ListItem href="/docs/primitives/typography" title="Typography">
                  Styles for headings, paragraphs, lists...etc
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="h-9">
              Components
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[600px] grid-cols-2 gap-3 p-4">
                {allDocs
                  .filter((doc) => doc.featured)
                  .map((doc) => (
                    <ListItem key={doc._id} title={doc.title} href={doc.slug}>
                      {doc.description}
                    </ListItem>
                  ))}
              </ul>
              <div className="p-4 pt-0">
                <Separator className="mb-4" />
                <Link href="/docs/primitives/accordion" passHref legacyBehavior>
                  <NavigationMenuLink
                    className={cn(
                      buttonVariants({ variant: "outline" }),
                      "w-full dark:hover:bg-slate-700"
                    )}
                  >
                    Browse components
                  </NavigationMenuLink>
                </Link>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem className="hidden lg:flex">
            <Link href="/figma" legacyBehavior passHref>
              <NavigationMenuLink
                className={cn(navigationMenuTriggerStyle(), "h-9")}
              >
                Figma
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem className="hidden lg:flex">
            <Link href={siteConfig.links.github} legacyBehavior passHref>
              <NavigationMenuLink
                className={cn(navigationMenuTriggerStyle(), "h-9")}
              >
                GitHub
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<typeof Link>,
  React.ComponentPropsWithoutRef<typeof Link>
>(({ className, title, children, href, ...props }, ref) => {
  return (
    <li>
      <Link href={href} passHref legacyBehavior {...props}>
        <NavigationMenuLink
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-slate-100 focus:bg-slate-100 dark:hover:bg-slate-700 dark:focus:bg-slate-700",
            className
          )}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-slate-500 dark:text-slate-400">
            {children}
          </p>
        </NavigationMenuLink>
      </Link>
    </li>
  )
})
ListItem.displayName = "ListItem"
