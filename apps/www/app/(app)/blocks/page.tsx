import { getAllBlockIds } from "@/lib/blocks"
import { BlockImage } from "@/components/block-image"

export default async function BlocksPage() {
  const blocks = await getAllBlockIds(["registry:block"])

  return (
    <div className="container py-6">
      <div className="grid grid-cols-3 gap-6">
        {blocks.map((name) => (
          <div
            key={name}
            className="aspect-[1440/900] flex items-center justify-center rounded-lg bg-muted p-14"
          >
            <BlockImage name={name} width={375} height={250} />
          </div>
        ))}
      </div>
    </div>
  )
}
