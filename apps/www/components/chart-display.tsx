import { getBlock } from "@/lib/blocks"
import { ChartPreview } from "@/components/chart-preview"
import { styles } from "@/registry/styles"

export async function ChartDisplay({ name }: { name: string }) {
  const charts = await Promise.all(
    styles.map(async (style) => {
      const block = await getBlock(name, style.name)

      // Cannot (and don't need to) pass to the client.
      delete block?.component
      delete block?.chunks

      return {
        ...block,
      }
    })
  )

  if (!charts?.length) {
    return null
  }

  return charts.map((block) => (
    <ChartPreview key={`${block.style}-${block.name}`} chart={block} />
  ))
}
