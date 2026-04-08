import fs from "fs"
import { ExamplesIndex } from "@/examples/__index__"

import { source } from "@/lib/source"
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
  const demo =
    ExamplesIndex[styleName]?.[name] ??
    (base ? ExamplesIndex[base]?.[name] : undefined)
  if (!demo) {
    return null
  }
  return demo.filePath
}

function getRegistryEntry(name: string, styleName: string) {
  const base = getBaseForStyle(styleName)
  return (
    StylesIndex[styleName]?.[name] ??
    (base ? BasesIndex[base]?.[name] : undefined)
  )
}

function getComponentsList() {
  const components = source.pageTree.children.find(
    (page) => page.$id === "components"
  )

  if (components?.type !== "folder") {
    return ""
  }

  const list = components.children.filter(
    (component) => component.type === "page"
  )

  return list
    .map((component) => `- [${component.name}](${component.url})`)
    .join("\n")
}

export function processMdxForLLMs(content: string, style: Style["name"]) {
  // Replace <ComponentsList /> with a markdown list of components.
  const componentsListRegex = /<ComponentsList\s*\/>/g
  content = content.replace(componentsListRegex, getComponentsList())

  const componentPreviewRegex =
    /<ComponentPreview[\s\S]*?name="([^"]+)"[\s\S]*?\/>/g

  return content.replace(componentPreviewRegex, (match, name) => {
    try {
      // Try to extract styleName from the match.
      const styleNameMatch = match.match(/styleName="([^"]+)"/)
      const effectiveStyle = styleNameMatch ? styleNameMatch[1] : style

      let src = getDemoFilePath(name, effectiveStyle)

      if (!src) {
        const component = getRegistryEntry(name, effectiveStyle)
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
          `@/examples/${base.name}/ui-rtl/`,
          "@/components/ui/"
        )
        source = source.replaceAll(
          `@/examples/${base.name}/ui/`,
          "@/components/ui/"
        )
        source = source.replaceAll(`@/examples/${base.name}/lib/`, "@/lib/")
        source = source.replaceAll(`@/examples/${base.name}/hooks/`, "@/hooks/")
      }
      source = source.replace(
        /@\/styles\/([\w-]+)\/(ui-rtl|ui)\/([\w-]+)/g,
        (match, _styleName, type, component) => {
          if (type === "ui" || type === "ui-rtl") {
            return `@/components/ui/${component}`
          }

          return match
        }
      )
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
