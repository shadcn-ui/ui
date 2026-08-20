import { registryBaseColorSchema } from "@/src/schema"
import { Transformer } from "@/src/utils/transformers"
import { Node, ScriptKind, SyntaxKind } from "ts-morph"
import { z } from "zod"

// JSX attributes whose value is a list of class names.
const CLASS_ATTRIBUTES = ["className", "class"]

// Helpers whose arguments are lists of class names.
const CLASS_UTILITIES = [
  "cn",
  "clsx",
  "classNames",
  "cva",
  "tv",
  "twMerge",
  "twJoin",
]

// Color mapping rewrites a class list: it splits on whitespace, dedupes and
// trims. Applied to a string that is not a class list, that is silent data
// loss (`join(" ")` -> `join("")`), so only rewrite literals we can attribute
// to a class name. The nearest enclosing call or JSX attribute decides, which
// keeps `cn(foo("..."))` out while keeping `cn("...", cond && "...")` in.
function isClassNameLiteral(node: Node) {
  for (const ancestor of node.getAncestors()) {
    if (Node.isCallExpression(ancestor)) {
      const expression = ancestor.getExpression()
      const name = Node.isPropertyAccessExpression(expression)
        ? expression.getName()
        : expression.getText()
      return CLASS_UTILITIES.includes(name)
    }

    if (Node.isJsxAttribute(ancestor)) {
      return CLASS_ATTRIBUTES.includes(ancestor.getNameNode().getText())
    }
  }

  return false
}

export const transformCssVars: Transformer = async ({
  sourceFile,
  config,
  baseColor,
}) => {
  // No transform if using css variables.
  if (config.tailwind?.cssVariables || !baseColor?.inlineColors) {
    return sourceFile
  }

  sourceFile.getDescendantsOfKind(SyntaxKind.StringLiteral).forEach((node) => {
    if (!isClassNameLiteral(node)) {
      return
    }

    const raw = node.getLiteralText()
    const mapped = applyColorMapping(raw, baseColor.inlineColors).trim()
    if (mapped !== raw) {
      node.setLiteralValue(mapped)
    }
  })

  return sourceFile
}

// export default function transformer(file: FileInfo, api: API) {
//   const j = api.jscodeshift.withParser("tsx")

//   // Replace bg-background with "bg-white dark:bg-slate-950"
//   const $j = j(file.source)
//   return $j
//     .find(j.JSXAttribute, {
//       name: {
//         name: "className",
//       },
//     })
//     .forEach((path) => {
//       const { node } = path
//       if (node?.value?.type) {
//         if (node.value.type === "StringLiteral") {
//           node.value.value = applyColorMapping(node.value.value)
//           console.log(node.value.value)
//         }

//         if (
//           node.value.type === "JSXExpressionContainer" &&
//           node.value.expression.type === "CallExpression"
//         ) {
//           const callee = node.value.expression.callee
//           if (callee.type === "Identifier" && callee.name === "cn") {
//             node.value.expression.arguments.forEach((arg) => {
//               if (arg.type === "StringLiteral") {
//                 arg.value = applyColorMapping(arg.value)
//               }

//               if (
//                 arg.type === "LogicalExpression" &&
//                 arg.right.type === "StringLiteral"
//               ) {
//                 arg.right.value = applyColorMapping(arg.right.value)
//               }
//             })
//           }
//         }
//       }
//     })
//     .toSource()
// }

// // export function splitClassName(input: string): (string | null)[] {
// //   const parts = input.split(":")
// //   const classNames = parts.map((part) => {
// //     const match = part.match(/^\[?(.+)\]$/)
// //     if (match) {
// //       return match[1]
// //     } else {
// //       return null
// //     }
// //   })

// //   return classNames
// // }

// Splits a className into [variant, name, alpha].
// eg. hover:bg-primary-100 -> [hover, bg-primary, 100]
// eg. sm:group-data-[size=default]/alert-dialog-content:text-left -> [sm:group-data-[size=default]/alert-dialog-content, text-left, null]
export function splitClassName(className: string): (string | null)[] {
  if (!className.includes("/") && !className.includes(":")) {
    return [null, className, null]
  }

  // Find the last colon that's not inside brackets to split variant from name.
  let lastColonIndex = -1
  let bracketDepth = 0
  for (let i = className.length - 1; i >= 0; i--) {
    const char = className[i]
    if (char === "]") bracketDepth++
    else if (char === "[") bracketDepth--
    else if (char === ":" && bracketDepth === 0) {
      lastColonIndex = i
      break
    }
  }

  let variant: string | null = null
  let nameWithAlpha: string

  if (lastColonIndex === -1) {
    // No colon outside brackets, entire string is the name (possibly with alpha).
    nameWithAlpha = className
  } else {
    variant = className.slice(0, lastColonIndex)
    nameWithAlpha = className.slice(lastColonIndex + 1)
  }

  // Now split nameWithAlpha by "/" for alpha modifier.
  // Alpha modifiers are numeric (e.g., /50) or arbitrary (e.g., /[50%]).
  // Named groups like /alert-dialog-content would have been part of variant.
  const slashIndex = nameWithAlpha.lastIndexOf("/")
  if (slashIndex === -1) {
    return [variant, nameWithAlpha, null]
  }

  const name = nameWithAlpha.slice(0, slashIndex)
  const alpha = nameWithAlpha.slice(slashIndex + 1)

  return [variant, name, alpha]
}

const PREFIXES = ["bg-", "text-", "border-", "ring-offset-", "ring-"]

export function applyColorMapping(
  input: string,
  mapping: z.infer<typeof registryBaseColorSchema>["inlineColors"]
) {
  // Handle border classes.
  if (input.includes(" border ")) {
    input = input.replace(" border ", " border border-border ")
  }

  // Build color mappings.
  const classNames = input.split(" ")
  const lightMode = new Set<string>()
  const darkMode = new Set<string>()
  for (let className of classNames) {
    const [variant, value, modifier] = splitClassName(className)
    const prefix = PREFIXES.find((prefix) => value?.startsWith(prefix))
    if (!prefix) {
      if (!lightMode.has(className)) {
        lightMode.add(className)
      }
      continue
    }

    const needle = value?.replace(prefix, "")
    if (needle && needle in mapping.light) {
      lightMode.add(
        [variant, `${prefix}${mapping.light[needle]}`]
          .filter(Boolean)
          .join(":") + (modifier ? `/${modifier}` : "")
      )

      darkMode.add(
        ["dark", variant, `${prefix}${mapping.dark[needle]}`]
          .filter(Boolean)
          .join(":") + (modifier ? `/${modifier}` : "")
      )
      continue
    }

    if (!lightMode.has(className)) {
      lightMode.add(className)
    }
  }

  return [...Array.from(lightMode), ...Array.from(darkMode)].join(" ").trim()
}
