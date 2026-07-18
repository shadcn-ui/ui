import postcss from "postcss"
import selectorParser, {
  type ClassName,
  type Selector as SelectorNodeRoot,
} from "postcss-selector-parser"
import { z } from "zod"

const CN_PREFIX = "cn-"

export const styleMapSchema = z.record(
  z.string().startsWith(CN_PREFIX),
  z.string()
)

export type StyleMap = z.infer<typeof styleMapSchema>

export function createStyleMap(input: string) {
  const root = postcss.parse(input)

  const result: Record<string, string> = {}

  root.walkRules((rule) => {
    const selectors = rule.selectors ?? []

    if (selectors.length === 0) {
      return
    }

    const tailwindClasses = extractTailwindClasses(rule)

    if (!tailwindClasses) {
      return
    }

    for (const selector of selectors) {
      const normalizedSelector = normalizeSelector(selector)

      selectorParser((selectorsRoot) => {
        selectorsRoot.each((sel) => {
          const targetClass = findSubjectClass(sel)

          if (!targetClass) {
            return
          }

          const className = targetClass.value

          if (!className.startsWith(CN_PREFIX)) {
            return
          }

          result[className] = result[className]
            ? `${tailwindClasses} ${result[className]}`
            : tailwindClasses
        })
      }).processSync(normalizedSelector)
    }
  })

  return styleMapSchema.parse(result)
}

function normalizeSelector(selector: string) {
  return selector.replace(/\s*&\s*/g, "").trim()
}

function extractTailwindClasses(rule: postcss.Rule) {
  const classes: string[] = []

  for (const node of rule.nodes || []) {
    if (node.type === "atrule" && node.name === "apply") {
      const value = node.params.trim()
      if (value) {
        classes.push(value)
      }
    }
  }

  if (classes.length === 0) {
    return null
  }

  return classes.join(" ")
}

function findSubjectClass(selector: SelectorNodeRoot) {
  const classNodes: ClassName[] = []

  selector.walkClasses((classNode) => {
    if (classNode.value.startsWith(CN_PREFIX)) {
      classNodes.push(classNode)
    }
  })

  if (classNodes.length === 0) {
    return null
  }

  return classNodes[classNodes.length - 1]
}
