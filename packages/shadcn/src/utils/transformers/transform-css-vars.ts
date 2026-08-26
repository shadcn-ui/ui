import { registryBaseColorSchema } from "@/src/schema"
import { Transformer } from "@/src/utils/transformers"
import { ScriptKind, SyntaxKind } from "ts-morph"
import { z } from "zod"

export const transformCssVars: Transformer = async ({
  sourceFile,
  config,
  baseColor,
}) => {
  // No transform if using css variables.
  if (config.tailwind?.cssVariables || !baseColor?.inlineColors) {
    return sourceFile
  }

  // Find jsx attributes with the name className.
  // const openingElements = sourceFile.getDescendantsOfKind(SyntaxKind.JsxElement)
  // console.log(openingElements)
  // const jsxAttributes = sourceFile
  //   .getDescendantsOfKind(SyntaxKind.JsxAttribute)
  //   .filter((node) => node.getName() === "className")

  // for (const jsxAttribute of jsxAttributes) {
  //   const value = jsxAttribute.getInitializer()?.getText()
  //   if (value) {
  //     const valueWithColorMapping = applyColorMapping(
  //       value.replace(/"/g, ""),
  //       baseColor.inlineColors
  //     )
  //     jsxAttribute.setInitializer(`"${valueWithColorMapping}"`)
  //   }
  // }
  sourceFile.getDescendantsOfKind(SyntaxKind.StringLiteral).forEach((node) => {
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
