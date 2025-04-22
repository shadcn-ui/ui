"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/new-york-v4/ui/button"

const navItems = [
  {
    href: "/docs/installation",
    label: "Docs",
  },
  {
    href: "/docs/components",
    label: "Components",
  },
  {
    href: "/blocks",
    label: "Blocks",
  },
  {
    href: "/charts",
    label: "Charts",
  },
  {
    href: "/themes",
    label: "Themes",
  },
  {
    href: "/colors",
    label: "Colors",
  },
]

export function MainNav({ className, ...props }: React.ComponentProps<"nav">) {
  const pathname = usePathname()

  return (
    <nav
      className={cn("hidden items-center gap-0.5 md:flex", className)}
      {...props}
    >
      {navItems.map((item) => (
        <Button key={item.href} variant="ghost" asChild size="sm">
          <Link
            href={item.href}
            className={cn(pathname === item.href && "text-primary")}
          >
            {item.label}
          </Link>
        </Button>
      ))}
    </nav>
  )
}
