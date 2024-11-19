import Image from "next/image"

import { getAllBlockIds } from "@/lib/blocks"

export default async function BlocksPage() {
  const blocks = await getAllBlockIds(["registry:block"])

  return (
    <div className="container py-6">
      <div className="grid grid-cols-2 gap-6">
        {blocks.map((name) => (
          <div
            key={name}
            className="aspect-aspect-[1440/900] flex items-center justify-center rounded-lg bg-muted p-14"
          >
            <div className="relative aspect-[1440/900] w-full max-w-xl overflow-hidden rounded-lg">
              <Image
                src={`/r/styles/new-york/${name}-light.png`}
                alt={name}
                fill
                className="object-cover dark:hidden"
              />
              <Image
                src={`/r/styles/new-york/${name}-dark.png`}
                alt={name}
                fill
                className="hidden object-cover dark:block"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
