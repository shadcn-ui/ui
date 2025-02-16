import { toc } from "mdast-util-toc"
import { Node } from "mdast-util-toc/lib"
import { remark } from "remark"
import { visit } from "unist-util-visit"
import type { VFile } from "vfile"
import type { Text, InlineCode } from 'mdast'

const textTypes = ["text", "inlineCode"]

function flattenNode(node: Node) {
  const p: string[] = []
  visit(node, (node) => {
    if (!textTypes.includes(node.type)) return
    p.push((node as Text | InlineCode).value)
  })
  return p.join(``)
}

interface Item {
  title: string
  url: string
  items?: Item[]
}

interface Items {
  items?: Item[]
}

function getItems(node: Node | null = null, current: Item | Object): Item | Object {
  if (!node) {
    return {}
  }

  let result = current as Item

  if (node.type === "paragraph") {
    visit(node, (item) => {
      
      if (item.type === "link") {
        result.url = item.url
        result.title = flattenNode(node)
      }

      if (item.type === "text") {
        result.title = flattenNode(node)
      }
    })

    return result
  }

  if (node.type === "list") {
    result.items = node.children.map((i) => getItems(i, {})) as Item[]

    return result
  } else if (node.type === "listItem") {
    const heading = getItems(node.children[0], {})

    if (node.children.length > 1) {
      getItems(node.children[1], heading)
    }

    return heading
  }

  return {}
}

const getToc = () => (node: Node, file: VFile) => {
  const table = toc(node)
  const items = getItems(table.map, {})

  file.data = items as Record<string, Item>
}

export type TableOfContents = Items

export async function getTableOfContents(
  content: string
): Promise<TableOfContents> {
  const result = await remark().use(getToc).process(content)

  return result.data
}
