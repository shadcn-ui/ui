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
    <div className="flex items-center gap-4">
      {BASES.map((baseItem) => (
        <Link
          key={baseItem.name}
          href={`/docs/components/${baseItem.name}/${component}`}
          data-active={base === baseItem.name}
          className={cn(
            "text-muted-foreground data-[active=true]:text-foreground data-[active=true]:border-primary dark:data-[active=true]:border-primary hover:text-primary rounded-none border-0 border-b-2 border-transparent bg-transparent px-0 pb-1 text-base font-medium transition-colors data-[active=true]:bg-transparent data-[active=true]:shadow-none dark:data-[active=true]:bg-transparent"
          )}
        >
          {baseItem.title}
        </Link>
      ))}
    </div>
  )
}
