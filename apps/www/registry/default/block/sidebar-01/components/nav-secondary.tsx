"use client"

import Link from "next/link"
import { type LucideIcon } from "lucide-react"

type NavItem = {
  title: string
  url: string
  icon: LucideIcon
  items?: Pick<NavItem, "title" | "url">[]
}

export function NavSecondary({
  heading,
  items,
}: {
  heading?: string
  items: NavItem[]
}) {
  if (!items?.length) {
    return null
  }

  return (
    <nav className="mt-auto grid gap-2 px-2.5">
      {heading && (
        <div className="px-1.5 text-xs font-medium text-muted-foreground">
          {heading}
        </div>
      )}
      <ul className="grid gap-0.5">
        {items.map((item) => (
          <li key={item.title}>
            <Link
              href={item.url}
              className="flex h-7 items-center gap-2.5 overflow-hidden rounded-md px-1.5 text-xs ring-ring transition-all hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2"
            >
              <item.icon className="h-4 w-4 shrink-0 translate-x-0.5 text-muted-foreground" />
              <div className="line-clamp-1 grow overflow-hidden pr-6 font-medium text-muted-foreground">
                {item.title}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
