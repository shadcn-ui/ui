"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

const BASES = [
  { name: "radix", label: "Radix UI" },
  { name: "base", label: "Base UI" },
]

export function DocsBaseSwitcher() {
  const pathname = usePathname()

  // Extract base and component from /docs/components/{base}/{component}.
  const match = pathname.match(/\/docs\/components\/(radix|base)\/(.+)/)
  if (!match) return null

  const [, currentBase, component] = match

  return (
    <div className="flex gap-1 rounded-md border p-1">
      {BASES.map((base) => (
        <Link
          key={base.name}
          href={`/docs/components/${base.name}/${component}`}
          className={cn(
            "rounded px-3 py-1 text-sm transition-colors",
            currentBase === base.name
              ? "bg-primary text-primary-foreground"
              : "hover:bg-muted"
          )}
        >
          {base.label}
        </Link>
      ))}
    </div>
  )
}
