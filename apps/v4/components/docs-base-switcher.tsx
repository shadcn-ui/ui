import Link from "next/link"

import { cn } from "@/lib/utils"
import { BASES } from "@/registry/bases"

export function DocsBaseSwitcher({
  base,
  component,
  className,
}: {
  base: string
  component: string
  className?: string
}) {
  const activeBase = BASES.find((baseItem) => base === baseItem.name)

  return (
    <div className={cn("inline-flex w-full items-center gap-6", className)}>
      {BASES.map((baseItem) => (
        <Link
          key={baseItem.name}
          href={`/docs/components/${baseItem.name}/${component}`}
          data-active={base === baseItem.name}
          className="text-muted-foreground hover:text-foreground data-[active=true]:text-foreground after:bg-foreground relative inline-flex items-center justify-center gap-1 pt-1 pb-0.5 text-base font-medium transition-colors after:absolute after:inset-x-0 after:bottom-[-4px] after:h-0.5 after:opacity-0 after:transition-opacity data-[active=true]:after:opacity-100"
        >
          {baseItem.title}
        </Link>
      ))}
      {activeBase?.meta?.logo && (
        <div
          className="text-muted-foreground ml-auto size-4 shrink-0 opacity-80 [&_svg]:size-4"
          dangerouslySetInnerHTML={{
            __html: activeBase.meta.logo,
          }}
        />
      )}
    </div>
  )
}
