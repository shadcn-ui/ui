import fs from "fs"
import path from "path"
import { u } from "unist-builder"
import { visit } from "unist-util-visit"

import { Index as StylesIndex } from "@/registry/__index__"
import { getActiveStyle } from "@/registry/_legacy-styles"
import { Index as BasesIndex } from "@/registry/bases/__index__"

// Map style names to their corresponding index and key.
function getIndexForStyle(styleName: string) {
  if (styleName.startsWith("radix-")) {
    return { index: BasesIndex, key: "radix" }
  }
  if (styleName.startsWith("base-")) {
    return { index: BasesIndex, key: "base" }
  }
  return { index: StylesIndex, key: styleName }
}

interface UnistNode {
  type: string
  name?: string
  tagName?: string
  value?: string
  properties?: Record<string, unknown>
  attributes?: {
    name: string
    value: unknown
    type?: string
  }[]
  children?: UnistNode[]
}

export interface UnistTree {
  type: string
  children: UnistNode[]
}

export function rehypeComponent() {
  return async (tree: UnistTree) => {
    const activeStyle = await getActiveStyle()

    visit(tree, (node: UnistNode) => {
      // src prop overrides both name and fileName.
      const { value: srcPath } =
        (getNodeAttributeByName(node, "src") as {
          name: string
          value?: string
          type?: string
        }) || {}

      if (node.name === "ComponentSource") {
        const name = getNodeAttributeByName(node, "name")?.value as string
        const fileName = getNodeAttributeByName(node, "fileName")?.value as
          | string
          | undefined
        const styleName =
          (getNodeAttributeByName(node, "styleName")?.value as string) ||
          activeStyle.name

        if (!name && !srcPath) {
          return null
        }

        try {
          let src: string

          if (srcPath) {
            src = path.join(process.cwd(), srcPath)
          } else {
            const { index, key } = getIndexForStyle(styleName)
            const component = index[key]?.[name]
            src = fileName
              ? component.files.find((file: unknown) => {
                  if (typeof file === "string") {
                    return (
                      file.endsWith(`${fileName}.tsx`) ||
                      file.endsWith(`${fileName}.ts`)
                    )
                  }
                  return false
                }) || component.files[0]?.path
              : component.files[0]?.path
          }

          // Read the source file.
          const filePath = src
          let source = fs.readFileSync(filePath, "utf8")

          // Replace imports.
          // TODO: Use @swc/core and a visitor to replace this.
          // For now a simple regex should do.
          source = source.replaceAll(
            `@/registry/${styleName}/`,
            "@/components/"
          )
          source = source.replaceAll(`@/registry/bases/radix/`, "@/components/")
          source = source.replaceAll(`@/registry/bases/base/`, "@/components/")
          source = source.replaceAll("export default", "export")

          // Add code as children so that rehype can take over at build time.
          node.children?.push(
            u("element", {
              tagName: "pre",
              properties: {
                __src__: src,
              },
              children: [
                u("element", {
                  tagName: "code",
                  properties: {
                    className: ["language-tsx"],
                  },
                  children: [
                    {
                      type: "text",
                      value: source,
                    },
                  ],
                }),
              ],
            })
          )
        } catch (error) {
          console.error(error)
        }
      }

      if (node.name === "ComponentPreview") {
        const name = getNodeAttributeByName(node, "name")?.value as string
        const styleName =
          (getNodeAttributeByName(node, "styleName")?.value as string) ||
          activeStyle.name

        if (!name) {
          return null
        }

        try {
          const { index, key } = getIndexForStyle(styleName)
          const component = index[key]?.[name]
          const src = component.files[0]?.path

          // Read the source file.
          const filePath = src
          let source = fs.readFileSync(filePath, "utf8")

          // Replace imports.
          // TODO: Use @swc/core and a visitor to replace this.
          // For now a simple regex should do.
          source = source.replaceAll(
            `@/registry/${styleName}/`,
            "@/components/"
          )
          source = source.replaceAll(`@/registry/bases/radix/`, "@/components/")
          source = source.replaceAll(`@/registry/bases/base/`, "@/components/")
          source = source.replaceAll("export default", "export")

          // Add code as children so that rehype can take over at build time.
          node.children?.push(
            u("element", {
              tagName: "pre",
              properties: {
                __src__: src,
              },
              children: [
                u("element", {
                  tagName: "code",
                  properties: {
                    className: ["language-tsx"],
                  },
                  children: [
                    {
                      type: "text",
                      value: source,
                    },
                  ],
                }),
              ],
            })
          )
        } catch (error) {
          console.error(error)
        }
      }
    })
  }
}

function getNodeAttributeByName(node: UnistNode, name: string) {
  return node.attributes?.find((attribute) => attribute.name === name)
}
