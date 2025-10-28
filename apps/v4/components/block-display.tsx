import * as React from "react"
import { registryItemFileSchema } from "shadcn/schema"
import { z } from "zod"

import { highlightCode } from "@/lib/highlight-code"
import {
  createFileTreeForRegistryItemFiles,
  getRegistryItem,
} from "@/lib/registry"
import { cn } from "@/lib/utils"
import { BlockViewer } from "@/components/block-viewer"
import { ComponentPreview } from "@/components/component-preview"
import { type Style } from "@/registry/styles"

export async function BlockDisplay({
  name,
  style,
}: {
  name: string
  style: Style
}) {
  const item = await getCachedRegistryItem(name, style)

  if (!item?.files) {
    return null
  }

  const [tree, highlightedFiles] = await Promise.all([
    getCachedFileTree(item.files),
    getCachedHighlightedFiles(item.files),
  ])

  return (
    <BlockViewer item={item} tree={tree} highlightedFiles={highlightedFiles}>
      <ComponentPreview
        name={item.name}
        hideCode
        className={cn(
          "my-0 **:[.preview]:h-auto **:[.preview]:p-4 **:[.preview>.p-6]:p-0",
          item.meta?.containerClassName
        )}
      />
    </BlockViewer>
  )
}

const getCachedRegistryItem = React.cache(
  async (name: string, style: Style) => {
    return await getRegistryItem(name, style)
  }
)

const getCachedFileTree = React.cache(
  async (files: Array<{ path: string; target?: string }>) => {
    if (!files) {
      return null
    }

    return await createFileTreeForRegistryItemFiles(files)
  }
)

const getCachedHighlightedFiles = React.cache(
  async (files: z.infer<typeof registryItemFileSchema>[]) => {
    return await Promise.all(
      files.map(async (file) => ({
        ...file,
        highlightedContent: await highlightCode(file.content ?? ""),
      }))
    )
  }
)
