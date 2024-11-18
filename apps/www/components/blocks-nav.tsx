"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { registryCategories } from "@/registry/registry-categories"

export function BlocksNav() {
  const pathname = usePathname()

  return (
    <div className="flex items-center">
      <BlocksNavLink
        category={{ name: "All Blocks", slug: "", hidden: false }}
        isActive={pathname === "/blocks"}
      />
      {registryCategories.map((category) => (
        <BlocksNavLink
          key={category.slug}
          category={category}
          isActive={pathname?.startsWith(`/blocks/${category.slug}`) ?? false}
        />
      ))}
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
      className="flex h-7 items-center justify-center rounded-full px-4 text-center text-sm text-muted-foreground transition-colors hover:text-primary data-[active=true]:bg-muted font-medium data-[active=true]:text-primary"
      data-active={isActive}
    >
      {category.name}
    </Link>
  )
}
