import { getAllBlockIds } from "@/lib/blocks"
import { BlockDisplay } from "@/components/block-display"

export default async function ChartsPage() {
  const blocks = (await getAllBlockIds()).filter((name) =>
    name.startsWith("chart")
  )

  return blocks.map((name, index) => (
    <BlockDisplay key={`${name}-${index}`} name={name} />
  ))
}
