"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { ScrollArea, ScrollBar } from "@/registry/new-york-v4/ui/scroll-area"
import { registryCategories } from "@/registry/registry-categories"

export function BlocksNav() {
  const pathname = usePathname()

  return (
    <div className="relative overflow-hidden">
      <ScrollArea className="max-w-none">
        <div className="flex items-center">
          <BlocksNavLink
            category={{ name: "Featured", slug: "", hidden: false }}
            isActive={pathname === "/blocks"}
          />
          {registryCategories.map((category) => (
            <BlocksNavLink
              key={category.slug}
              category={category}
              isActive={pathname === `/blocks/${category.slug}`}
            />
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="invisible" />
      </ScrollArea>
    </div>
  )
}

function BlocksNavLink({
  category,
  isActive,
}: {
  category: (typeof registryCategories)[number]
  isActive: boolean
}) {
  if (category.hidden) {
    return null
  }

  return (
    <Link
      href={`/blocks/${category.slug}`}
      key={category.slug}
      className="text-muted-foreground hover:text-foreground data-[active=true]:bg-muted data-[active=true]:text-foreground flex h-7 shrink-0 items-center justify-center rounded-full px-4 text-center text-sm font-medium whitespace-nowrap transition-colors"
      data-active={isActive}
    >
      {category.name}
    </Link>
  )
}
