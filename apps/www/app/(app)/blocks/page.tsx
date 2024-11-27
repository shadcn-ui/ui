import * as React from "react"

import { getAllBlockIds } from "@/lib/blocks"
import { BlockDisplay } from "@/components/block-display"

import "@/styles/mdx.css"

export default async function BlocksPage() {
  const blocks = await getAllBlockIds()

  return (
    <div className="gap-3 md:flex md:flex-row-reverse md:items-start">
      <div className="grid flex-1 gap-12 md:gap-24 lg:gap-48">
        {blocks.map((name) => (
          <BlockDisplay key={name} name={name} />
        ))}
      </div>
    </div>
  )
}
