import { getAllBlockIds } from "@/lib/blocks"
import { BlockDisplay } from "@/components/block-display"
import { registryCategories } from "@/registry/registry-categories"

export const dynamicParams = false

export async function generateStaticParams() {
  return registryCategories.map((category) => ({
    categories: [category.slug],
  }))
}

export default async function BlocksPage({
  params,
}: {
  params: { categories?: string[] }
}) {
  const blocks = await getAllBlockIds(
    ["registry:block"],
    params.categories ?? []
  )

  return blocks.map((name) => (
    <div
      key={name}
      className="border-grid container border-b py-8 first:pt-6 last:border-b-0 md:py-12"
    >
      <BlockDisplay name={name} />
    </div>
  ))
}
