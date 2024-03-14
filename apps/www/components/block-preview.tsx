import { promises as fs } from "fs"
import path from "path"
import { Index } from "@/__registry__"
import { getHighlighter } from "shiki"

import { BlockPreviewTabs } from "@/components/block-preview-tabs"
import { registryEntrySchema } from "@/registry/schema"

import "@/styles/mdx.css"

const DEFAULT_BLOCKS_STYLE = "default"

interface BlockPreviewProps {
  name: string
}

export async function BlockPreview({ name }: BlockPreviewProps) {
  const block = registryEntrySchema.parse(Index[DEFAULT_BLOCKS_STYLE][name])

  if (!block) {
    return null
  }

  const editorTheme = await fs.readFile(
    path.join(process.cwd(), "lib/themes/dark.json"),
    "utf-8"
  )

  const highlighter = await getHighlighter({
    langs: ["typescript"],
    themes: [],
  })

  await highlighter.loadTheme(JSON.parse(editorTheme))

  // Read the code from the file.
  const filepath = path.join(process.cwd(), block.files[0])
  let code = await fs.readFile(filepath, "utf-8")

  code = code.replaceAll(`@/registry/${DEFAULT_BLOCKS_STYLE}/`, "@/components/")
  code = code.replaceAll("export default", "export")

  const html = await highlighter.codeToHtml(code, {
    lang: "typescript",
    theme: "Lambda Studio — Blackout",
  })

  return (
    <BlockPreviewTabs
      name={block.name}
      description={block.description || ""}
      code={html}
      codeString={code}
    />
  )
}
