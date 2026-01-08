import Link from "next/link"

import { BASES } from "@/registry/bases"

export function DocsBaseSwitcher({
  base,
  component,
}: {
  base: string
  component: string
}) {
  return (
    <div className="bg-muted inline-flex h-7 items-center gap-0.5 rounded-md p-0.5">
      {BASES.map((baseItem) => (
        <Link
          key={baseItem.name}
          href={`/docs/components/${baseItem.name}/${component}`}
          data-active={base === baseItem.name}
          className="text-muted-foreground hover:text-foreground data-[active=true]:bg-background data-[active=true]:text-foreground inline-flex h-[--spacing(6.25)] items-center justify-center gap-1 rounded-sm pr-2.5 pl-2 text-sm font-medium data-[active=true]:shadow-sm"
        >
          {baseItem.meta?.logo && (
            <span
              className="size-3.5 shrink-0 [&>svg]:size-full"
              dangerouslySetInnerHTML={{ __html: baseItem.meta.logo }}
            />
          )}
          {baseItem.title}
        </Link>
      ))}
    </div>
  )
}
