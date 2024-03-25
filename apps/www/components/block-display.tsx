import { getBlock } from "@/lib/blocks"
import { BlockPreview } from "@/components/block-preview"
import { styles } from "@/registry/styles"

export async function BlockDisplay({ name }: { name: string }) {
  const blocks = await Promise.all(
    styles.map(async (style) => {
      const block = await getBlock(name, style.name)

      // Cannot (and don't need to) pass component to the client.
      delete block?.component

      return block
    })
  )

  if (!blocks?.length) {
    return null
  }

  return blocks.map((block) => (
    <BlockPreview key={`${block.style}-${block.name}`} block={block} />
  ))
}
