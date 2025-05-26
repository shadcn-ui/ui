import { getAllBlockIds } from "@/lib/blocks"
import { BlockDisplay } from "@/components/block-display"
import { registryCategories } from "@/registry/registry-categories"

export const revalidate = false
export const dynamic = "force-static"
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

  return (
    <div className="flex flex-col gap-12 md:gap-24">
      {blocks.map((name) => (
        <BlockDisplay name={name} key={name} />
      ))}
    </div>
  )
}
