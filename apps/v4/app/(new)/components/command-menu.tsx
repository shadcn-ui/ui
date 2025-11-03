import { Suspense } from "react"

import { Skeleton } from "@/registry/new-york-v4/ui/skeleton"
import { CommandMenuDialog } from "@/app/(new)/components/command-menu-dialog"
import { getRegistryItemsForStyle } from "@/app/(new)/lib/api"
import type { DesignSystemStyle } from "@/app/(new)/lib/style"

export async function CommandMenu({
  style,
}: {
  style: DesignSystemStyle["name"]
}) {
  return (
    <Suspense fallback={<Skeleton className="h-8 w-12" />}>
      <CommandMenuContent style={style} />
    </Suspense>
  )
}

async function CommandMenuContent({
  style,
}: {
  style: DesignSystemStyle["name"]
}) {
  const items = await getRegistryItemsForStyle(style)
  const filteredItems = items.filter((item) => item !== null)

  return <CommandMenuDialog items={filteredItems} />
}
