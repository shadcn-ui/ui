import { registryBaseColorSchema } from "@/src/schema"
import { Transformer } from "@/src/utils/transformers"
import { SyntaxKind, type StringLiteral } from "ts-morph"
import { z } from "zod"

function applyColorMappingToStringLiteral(
  node: StringLiteral,
  inlineColors: z.infer<typeof registryBaseColorSchema>["inlineColors"]
) {
  const raw = node.getLiteralText()
  const mapped = applyColorMapping(raw, inlineColors).trim()
  if (mapped !== raw) {
    node.setLiteralValue(mapped)
  }
}

// Class name utility function names that accept class strings as arguments.
const CLASS_UTIL_FUNCTIONS = ["cn", "clsx", "cva"]

export const transformCssVars: Transformer = async ({
  sourceFile,
  config,
  baseColor,
}) => {
  // No transform if using css variables.
  if (config.tailwind?.cssVariables || !baseColor?.inlineColors) {
    return sourceFile
  }

  const inlineColors = baseColor.inlineColors

  // Transform cva() calls: cva(base, { variants: { ... } })
  sourceFile
    .getDescendantsOfKind(SyntaxKind.CallExpression)
    .filter((node) => node.getExpression().getText() === "cva")
    .forEach((node) => {
      // cva(base, ...)
      const firstArg = node.getArguments()[0]
      if (firstArg?.isKind(SyntaxKind.StringLiteral)) {
        applyColorMappingToStringLiteral(firstArg, inlineColors)
      }

      // cva(..., { variants: { ... } })
      const secondArg = node.getArguments()[1]
      if (secondArg?.isKind(SyntaxKind.ObjectLiteralExpression)) {
        secondArg
          .getDescendantsOfKind(SyntaxKind.PropertyAssignment)
          .find((node) => node.getName() === "variants")
          ?.getDescendantsOfKind(SyntaxKind.PropertyAssignment)
          .forEach((node) => {
            node
              .getDescendantsOfKind(SyntaxKind.PropertyAssignment)
              .forEach((node) => {
                const classNames = node.getInitializerIfKind(
                  SyntaxKind.StringLiteral
                )
                if (classNames) {
                  applyColorMappingToStringLiteral(classNames, inlineColors)
                }
              })
          })
      }
    })

  // Transform className and classNames JSX attributes.
  sourceFile.getDescendantsOfKind(SyntaxKind.JsxAttribute).forEach((node) => {
    const attrName = node.getNameNode().getText()

    if (attrName === "className") {
      // className="..."
      const initializer = node.getInitializer()
      if (initializer?.isKind(SyntaxKind.StringLiteral)) {
        applyColorMappingToStringLiteral(initializer, inlineColors)
      }

      // className={...}
      if (initializer?.isKind(SyntaxKind.JsxExpression)) {
        // Find calls to cn(), clsx(), etc.
        initializer
          .getDescendantsOfKind(SyntaxKind.CallExpression)
          .filter((node) =>
            CLASS_UTIL_FUNCTIONS.includes(node.getExpression().getText())
          )
          .forEach((callExpression) => {
            callExpression.getArguments().forEach((arg) => {
              if (arg.isKind(SyntaxKind.StringLiteral)) {
                applyColorMappingToStringLiteral(arg, inlineColors)
              }

              if (
                arg.isKind(SyntaxKind.ConditionalExpression) ||
                arg.isKind(SyntaxKind.BinaryExpression)
              ) {
                arg
                  .getChildrenOfKind(SyntaxKind.StringLiteral)
                  .forEach((node) => {
                    applyColorMappingToStringLiteral(node, inlineColors)
                  })
              }
            })
          })
      }
    }

    // classNames={...} (object form, e.g. classNames={{ root: cn("...") }})
    if (attrName === "classNames") {
      if (node.getInitializer()?.isKind(SyntaxKind.JsxExpression)) {
        node
          .getDescendantsOfKind(SyntaxKind.PropertyAssignment)
          .forEach((prop) => {
            if (prop.getInitializer()?.isKind(SyntaxKind.CallExpression)) {
              const callExpression = prop.getInitializerIfKind(
                SyntaxKind.CallExpression
              )
              if (callExpression) {
                callExpression.getArguments().forEach((arg) => {
                  if (arg.isKind(SyntaxKind.StringLiteral)) {
                    applyColorMappingToStringLiteral(arg, inlineColors)
                  }

                  if (arg.isKind(SyntaxKind.ConditionalExpression)) {
                    arg
                      .getChildrenOfKind(SyntaxKind.StringLiteral)
                      .forEach((node) => {
                        applyColorMappingToStringLiteral(node, inlineColors)
                      })
                  }
                })
              }
            }

            if (prop.getInitializer()?.isKind(SyntaxKind.StringLiteral)) {
              const classNames = prop.getInitializerIfKind(
                SyntaxKind.StringLiteral
              )
              if (classNames) {
                applyColorMappingToStringLiteral(classNames, inlineColors)
              }
            }
          })
      }
    }
  })

  return sourceFile
}

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
