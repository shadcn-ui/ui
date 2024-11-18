import { getAllBlockIds } from "@/lib/blocks"
import { BlockDisplay } from "@/components/block-display"
import { registryCategories } from "@/registry/registry-categories"

export const dynamicParams = false

export async function generateStaticParams() {
  return [
    { categories: [] },
    ...registryCategories.map((category) => ({
      categories: [category.slug],
    })),
  ]
}

export default async function BlocksPage({
  params,
}: {
  params: { categories?: string[] }
}) {
  const blocks = await getAllBlockIds(params.categories ?? [])

  return blocks.map((name) => <BlockDisplay key={name} name={name} />)
}
