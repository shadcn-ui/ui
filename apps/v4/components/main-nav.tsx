"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { PAGES_NEW } from "@/lib/docs"
import { cn } from "@/lib/utils"
import { Badge } from "@/registry/new-york-v4/ui/badge"
import { Button } from "@/registry/new-york-v4/ui/button"

export function MainNav({
  items,
  className,
  ...props
}: React.ComponentProps<"nav"> & {
  items: { href: string; label: string }[]
}) {
  const pathname = usePathname()

  return (
    <nav className={cn("items-center", className)} {...props}>
      {items.map((item) => (
        <Button key={item.href} variant="ghost" asChild size="sm">
          <Link
            href={item.href}
            data-active={pathname === item.href}
            data-new={PAGES_NEW.includes(item.href)}
            className="data-[active=true]:text-primary relative items-center"
          >
            {item.label}
            {PAGES_NEW.includes(item.href) && (
              <Badge
                variant="secondary"
                className="h-4 bg-blue-600 px-1 text-[0.625rem] text-white"
              >
                New
              </Badge>
            )}
          </Link>
        </Button>
      ))}
    </nav>
  )
}
