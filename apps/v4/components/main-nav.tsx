"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { PAGES_NEW } from "@/lib/docs"
import { cn } from "@/lib/utils"
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
            className={cn(
              "relative items-center",
              "data-[active=true]:text-primary"
            )}
          >
            {item.label}
            {PAGES_NEW.includes(item.href) && (
              <span
                className="flex size-2 rounded-full bg-blue-500"
                title="New"
              />
            )}
          </Link>
        </Button>
      ))}
    </nav>
  )
}
