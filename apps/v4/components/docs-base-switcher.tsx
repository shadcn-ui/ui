import Link from "next/link"

import { source } from "@/lib/source"
import { cn } from "@/lib/utils"
import { BASES } from "@/registry/bases"

const DOCS_BASE_ORDER = new Map([
  ["base", 0],
  ["aria", 1],
  ["radix", 2],
])

export function DocsBaseSwitcher({
  base,
  component,
  hrefPrefix = "/docs/components",
  className,
}: {
  base: string
  component: string
  hrefPrefix?: string
  className?: string
}) {
  const activeBase = BASES.find((baseItem) => base === baseItem.name)

  return (
    <div
      className={cn(
        "not-typeset inline-flex w-full items-center gap-6",
        className
      )}
    >
      {BASES.filter((baseItem) =>
        source.getPage([`components/${baseItem.name}/${component}`])
      )
        .sort(
          (a, b) =>
            (DOCS_BASE_ORDER.get(a.name) ?? Number.MAX_SAFE_INTEGER) -
            (DOCS_BASE_ORDER.get(b.name) ?? Number.MAX_SAFE_INTEGER)
        )
        .map((baseItem) => (
          <Link
            key={baseItem.name}
            href={`${hrefPrefix}/${baseItem.name}/${component}`}
            data-active={base === baseItem.name}
            className="relative inline-flex items-center justify-center gap-1 pt-1 pb-0.5 text-base font-medium text-muted-foreground transition-colors after:absolute after:inset-x-0 after:bottom-[-4px] after:h-0.5 after:bg-foreground after:opacity-0 after:transition-opacity hover:text-foreground data-[active=true]:text-foreground data-[active=true]:after:opacity-100"
          >
            {baseItem.title}
          </Link>
        ))}
      {activeBase?.meta?.logo && (
        <div
          className="ml-auto size-4 shrink-0 text-muted-foreground opacity-80 [&_svg]:size-4"
          dangerouslySetInnerHTML={{
            __html: activeBase.meta.logo,
          }}
        />
      )}
    </div>
  )
}
