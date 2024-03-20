import { getAllBlockIds } from "@/lib/blocks"
import { BlockDisplay } from "@/components/block-display"

export default async function BlocksPage() {
  const blocks = await getAllBlockIds()

  return blocks.map((name, index) => (
    <BlockDisplay key={`${name}-${index}`} name={name} />
  ))
}
