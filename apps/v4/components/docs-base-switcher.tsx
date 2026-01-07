import Link from "next/link"

import { cn } from "@/lib/utils"
import { BASES } from "@/registry/bases"

export function DocsBaseSwitcher({
  base,
  component,
}: {
  base: string
  component: string
}) {
  return (
    <div className="flex gap-1 rounded-md border p-1">
      {BASES.map((baseItem) => (
        <Link
          key={baseItem.name}
          href={`/docs/components/${baseItem.name}/${component}`}
          className={cn(
            "rounded px-3 py-1 text-sm transition-colors",
            base === baseItem.name
              ? "bg-primary text-primary-foreground"
              : "hover:bg-muted"
          )}
        >
          {baseItem.title}
        </Link>
      ))}
    </div>
  )
}
