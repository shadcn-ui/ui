import fs from "fs"
import path from "path"
import { UnistNode, UnistTree } from "types/unist"
import { u } from "unist-builder"
import { visit } from "unist-util-visit"

export function rehypeComponent() {
  return async (tree: UnistTree) => {
    visit(tree, (node: UnistNode) => {
      const { value: src } = getNodeAttributeByName(node, "src") || {}

      if (node.name === "ComponentExample") {
        const source = getComponentSourceFileContent(node)
        if (!source) {
          return
        }

        // Replace the Example component with a pre element.
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

        const extractClassname = getNodeAttributeByName(
          node,
          "extractClassname"
        )
        if (
          extractClassname &&
          typeof extractClassname.value !== "undefined" &&
          extractClassname.value !== "false"
        ) {
          // Extract className from string
          // TODO: Use @swc/core and a visitor to extract this.
          // For now, a simple regex should do.
          const values = source.match(/className="(.*)"/)
          const className = values ? values[1] : ""

          // Add the className as a jsx prop so we can pass it to the copy button.
          node.attributes?.push({
            name: "extractedClassNames",
            type: "mdxJsxAttribute",
            value: className,
          })

          // Add a pre element with the className only.
          node.children?.push(
            u("element", {
              tagName: "pre",
              properties: {},
              children: [
                u("element", {
                  tagName: "code",
                  properties: {
                    className: ["language-tsx"],
                  },
                  children: [
                    {
                      type: "text",
                      value: className,
                    },
                  ],
                }),
              ],
            })
          )
        }
      }

      if (node.name === "ComponentSource") {
        const source = getComponentSourceFileContent(node)
        if (!source) {
          return
        }

        // Replace the Source component with a pre element.
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
      }
    })
  }
}

function getNodeAttributeByName(node: UnistNode, name: string) {
  return node.attributes?.find((attribute) => attribute.name === name)
}

function getComponentSourceFileContent(node: UnistNode) {
  const src = getNodeAttributeByName(node, "src")?.value as string

  if (!src) {
    return null
  }

  // Read the source file.
  const filePath = path.join(process.cwd(), src)
  const source = fs.readFileSync(filePath, "utf8")

  return source
}
