import { unstable_cache } from "next/cache"

import { getBlock } from "@/lib/blocks"
import { BlockPreview } from "@/components/block-preview"

const getBlockByName = unstable_cache(
  async (name: string) => {
    const block = await getBlock(name)

    if (!block) {
      return null
    }

    return {
      name: block.name,
      style: block.style,
      description: block.description,
      container: block.container,
    }
  },
  ["block"]
)

export async function BlockDisplay({ name }: { name: string }) {
  const block = await getBlockByName(name)

  if (!block) {
    return null
  }

  return <BlockPreview key={block.name} block={block} />
}
