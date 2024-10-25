import * as React from "react"
import { unstable_cache } from "next/cache"

import { getAllBlockIds } from "@/lib/blocks"
import { BlockDisplay } from "@/components/block-display"

const BLOCKS_WHITELIST_PREFIXES = ["sidebar", "login"]

const getBlocks = unstable_cache(async () => {
  return (await getAllBlockIds()).filter((name) =>
    BLOCKS_WHITELIST_PREFIXES.some((prefix) => name.startsWith(prefix))
  )
}, ["blocks"])

export default async function BlocksPage() {
  const blocks = await getBlocks()

  return (
    <div className="gap-3 md:flex md:flex-row-reverse md:items-start">
      <div className="grid flex-1 gap-12 md:gap-24 lg:gap-48">
        {blocks.map((name, index) => (
          <React.Suspense key={`${name}-${index}`}>
            <BlockDisplay name={name} />
          </React.Suspense>
        ))}
      </div>
    </div>
  )
}
