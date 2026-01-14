import fs from "fs"
import { ExamplesIndex } from "@/examples/__index__"

import { Index as StylesIndex } from "@/registry/__index__"
import { type Style } from "@/registry/_legacy-styles"
import { BASES } from "@/registry/bases"
import { Index as BasesIndex } from "@/registry/bases/__index__"

function getBaseForStyle(styleName: string) {
  for (const base of BASES) {
    if (styleName.startsWith(`${base.name}-`)) {
      return base.name
    }
  }
  return null
}

function getDemoFilePath(name: string, styleName: string) {
  const base = getBaseForStyle(styleName)
  if (!base) {
    return null
  }
  const demo = ExamplesIndex[base]?.[name]
  if (!demo) {
    return null
  }
  return demo.filePath
}

function getIndexForStyle(styleName: string) {
  const base = getBaseForStyle(styleName)
  if (base) {
    return { index: BasesIndex, key: base }
  }
  return { index: StylesIndex, key: styleName }
}

export function processMdxForLLMs(content: string, style: Style["name"]) {
  const componentPreviewRegex =
    /<ComponentPreview[\s\S]*?name="([^"]+)"[\s\S]*?\/>/g

  return content.replace(componentPreviewRegex, (match, name) => {
    try {
      // Try to extract styleName from the match.
      const styleNameMatch = match.match(/styleName="([^"]+)"/)
      const effectiveStyle = styleNameMatch ? styleNameMatch[1] : style

      let src = getDemoFilePath(name, effectiveStyle)

      if (!src) {
        const { index, key } = getIndexForStyle(effectiveStyle)
        const component = index[key]?.[name]
        if (!component?.files) {
          return match
        }
        src = component.files[0]?.path
      }

      if (!src) {
        return match
      }

      let source = fs.readFileSync(src, "utf8")

      // Replace all base-specific paths.
      for (const base of BASES) {
        source = source.replaceAll(
          `@/registry/bases/${base.name}/`,
          "@/components/"
        )
        source = source.replaceAll(
          `@/examples/${base.name}/ui/`,
          "@/components/ui/"
        )
        source = source.replaceAll(`@/examples/${base.name}/lib/`, "@/lib/")
        source = source.replaceAll(`@/examples/${base.name}/hooks/`, "@/hooks/")
      }
      source = source.replaceAll(
        `@/registry/${effectiveStyle}/`,
        "@/components/"
      )
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
