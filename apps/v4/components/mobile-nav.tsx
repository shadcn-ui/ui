"use client"

import * as React from "react"
import Link, { LinkProps } from "next/link"
import { useRouter } from "next/navigation"

import { source } from "@/lib/docs"
import { cn } from "@/lib/utils"
import { useMetaColor } from "@/hooks/use-meta-color"
import { Button } from "@/registry/new-york-v4/ui/button"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/registry/new-york-v4/ui/drawer"

export function MobileNav({
  tree,
  items,
}: {
  tree: typeof source.pageTree
  items: { href: string; label: string }[]
}) {
  const [open, setOpen] = React.useState(false)
  const { setMetaColor, metaColor } = useMetaColor()

  const onOpenChange = React.useCallback(
    (open: boolean) => {
      setOpen(open)
      setMetaColor(open ? "#09090b" : metaColor)
    },
    [setMetaColor, metaColor]
  )

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          className="h-8 flex-1 touch-manipulation gap-4 !px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="!size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 9h16.5m-16.5 6.75h16.5"
            />
          </svg>
          <span className="sr-only">Toggle Menu</span>
          <span className="bg-muted/50 text-muted-foreground flex h-8 flex-1 items-center justify-between rounded-md border px-2 text-sm font-normal shadow-none">
            Search documentation...
          </span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[80svh] p-0">
        <DrawerHeader className="sr-only">
          <DrawerTitle>Menu</DrawerTitle>
          <DrawerDescription>Choose a section to get started</DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-8 overflow-auto p-6">
          <div className="flex flex-col gap-4">
            <div className="text-muted-foreground text-sm font-semibold uppercase">
              Home
            </div>
            {items.map((item, index) => (
              <MobileLink key={index} href={item.href} onOpenChange={setOpen}>
                {item.label}
              </MobileLink>
            ))}
          </div>
          <div className="flex flex-col gap-8">
            {tree?.children?.map((group, index) => {
              if (group.type === "folder") {
                return (
                  <div key={index} className="flex flex-col gap-4">
                    <div className="text-muted-foreground text-sm font-semibold uppercase">
                      {group.name}
                    </div>
                    {group.children.map((item) => {
                      if (item.type === "page") {
                        return (
                          <MobileLink
                            key={item.$id}
                            href={item.url}
                            onOpenChange={setOpen}
                          >
                            {item.name}
                          </MobileLink>
                        )
                      }
                    })}
                  </div>
                )
              }
            })}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

interface MobileLinkProps extends LinkProps {
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
  className?: string
}

function MobileLink({
  href,
  onOpenChange,
  className,
  children,
  ...props
}: MobileLinkProps) {
  const router = useRouter()
  return (
    <Link
      href={href}
      onClick={() => {
        router.push(href.toString())
        onOpenChange?.(false)
      }}
      className={cn("text-2xl", className)}
      {...props}
    >
      {children}
    </Link>
  )
}
