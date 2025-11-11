import fs from "fs"

import { Metadata } from "@/registry/__metadata__"
import { type Style } from "@/registry/styles"

export function processMdxForLLMs(content: string, style: Style["name"]) {
  const componentPreviewRegex =
    /<ComponentPreview[\s\S]*?name="([^"]+)"[\s\S]*?\/>/g

  return content.replace(componentPreviewRegex, (match, name) => {
    try {
      const component = Metadata[style]?.[name]
      if (!component?.files) {
        return match
      }

      const src = component.files[0]?.path
      if (!src) {
        return match
      }

      let source = fs.readFileSync(src, "utf8")
      source = source.replaceAll(`@/registry/new-york-v4/`, "@/components/")
      source = source.replaceAll("export default", "export")

      return `\`\`\`tsx
${source}
\`\`\``
    } catch (error) {
      console.error(`Error processing ComponentPreview ${name}:`, error)
      return match
    }
  })
}
