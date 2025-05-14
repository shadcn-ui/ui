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
  params: Promise<{ categories?: string[] }>
}) {
  const { categories = [] } = await params
  const blocks = await getAllBlockIds(["registry:block"], categories)

  return blocks.map((name) => (
    <div
      key={name}
      className="border-grid border-grid container border-b py-8 first:pt-6 last:border-b-0 md:py-12 md:pr-4"
    >
      <BlockDisplay name={name} />
    </div>
  ))
}
