import { Transformer } from "@/src/utils/transformers"
import { SyntaxKind } from "ts-morph"

import { splitClassName } from "./transform-css-vars"

export const transformTwPrefixes: Transformer = async ({
  sourceFile,
  config,
}) => {
  if (!config.tailwind?.prefix) {
    return sourceFile
  }

  // Find the cva function calls.
  sourceFile
    .getDescendantsOfKind(SyntaxKind.CallExpression)
    .filter((node) => node.getExpression().getText() === "cva")
    .forEach((node) => {
      // cva(base, ...)
      if (node.getArguments()[0]?.isKind(SyntaxKind.StringLiteral)) {
        const defaultClassNames = node.getArguments()[0]
        if (defaultClassNames) {
          defaultClassNames.replaceWithText(
            `"${applyPrefix(
              defaultClassNames.getText()?.replace(/"|'/g, ""),
              config.tailwind.prefix
            )}"`
          )
        }
      }

      // cva(..., { variants: { ... } })
      if (node.getArguments()[1]?.isKind(SyntaxKind.ObjectLiteralExpression)) {
        node
          .getArguments()[1]
          ?.getDescendantsOfKind(SyntaxKind.PropertyAssignment)
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
                  classNames?.replaceWithText(
                    `"${applyPrefix(
                      classNames.getText()?.replace(/"|'/g, ""),
                      config.tailwind.prefix
                    )}"`
                  )
                }
              })
          })
      }
    })

  // Find all jsx attributes with the name className.
  sourceFile.getDescendantsOfKind(SyntaxKind.JsxAttribute).forEach((node) => {
    if (node.getName() === "className") {
      // className="..."
      if (node.getInitializer()?.isKind(SyntaxKind.StringLiteral)) {
        const value = node.getInitializer()
        if (value) {
          value.replaceWithText(
            `"${applyPrefix(
              value.getText()?.replace(/"|'/g, ""),
              config.tailwind.prefix
            )}"`
          )
        }
      }

      // className={...}
      if (node.getInitializer()?.isKind(SyntaxKind.JsxExpression)) {
        // Check if it's a call to cn().
        const callExpression = node
          .getInitializer()
          ?.getDescendantsOfKind(SyntaxKind.CallExpression)
          .find((node) => node.getExpression().getText() === "cn")
        if (callExpression) {
          // Loop through the arguments.
          callExpression.getArguments().forEach((node) => {
            if (
              node.isKind(SyntaxKind.ConditionalExpression) ||
              node.isKind(SyntaxKind.BinaryExpression)
            ) {
              node
                .getChildrenOfKind(SyntaxKind.StringLiteral)
                .forEach((node) => {
                  node.replaceWithText(
                    `"${applyPrefix(
                      node.getText()?.replace(/"|'/g, ""),
                      config.tailwind.prefix
                    )}"`
                  )
                })
            }

            if (node.isKind(SyntaxKind.StringLiteral)) {
              node.replaceWithText(
                `"${applyPrefix(
                  node.getText()?.replace(/"|'/g, ""),
                  config.tailwind.prefix
                )}"`
              )
            }
          })
        }
      }
    }

    // classNames={...}
    if (node.getName() === "classNames") {
      if (node.getInitializer()?.isKind(SyntaxKind.JsxExpression)) {
        node
          .getDescendantsOfKind(SyntaxKind.PropertyAssignment)
          .forEach((node) => {
            if (node.getInitializer()?.isKind(SyntaxKind.CallExpression)) {
              const callExpression = node.getInitializerIfKind(
                SyntaxKind.CallExpression
              )
              if (callExpression) {
                // Loop through the arguments.
                callExpression.getArguments().forEach((arg) => {
                  if (arg.isKind(SyntaxKind.ConditionalExpression)) {
                    arg
                      .getChildrenOfKind(SyntaxKind.StringLiteral)
                      .forEach((node) => {
                        node.replaceWithText(
                          `"${applyPrefix(
                            node.getText()?.replace(/"|'/g, ""),
                            config.tailwind.prefix
                          )}"`
                        )
                      })
                  }

                  if (arg.isKind(SyntaxKind.StringLiteral)) {
                    arg.replaceWithText(
                      `"${applyPrefix(
                        arg.getText()?.replace(/"|'/g, ""),
                        config.tailwind.prefix
                      )}"`
                    )
                  }
                })
              }
            }

            if (node.getInitializer()?.isKind(SyntaxKind.StringLiteral)) {
              if (node.getName() !== "variant") {
                const classNames = node.getInitializer()
                if (classNames) {
                  classNames.replaceWithText(
                    `"${applyPrefix(
                      classNames.getText()?.replace(/"|'/g, ""),
                      config.tailwind.prefix
                    )}"`
                  )
                }
              }
            }
          })
      }
    }
  })

  return sourceFile
}

export function applyPrefix(input: string, prefix: string = "") {
  const classNames = input.split(" ")
  const prefixed: string[] = []
  for (let className of classNames) {
    const [variant, value, modifier] = splitClassName(className)
    if (variant) {
      modifier
        ? prefixed.push(`${variant}:${prefix}${value}/${modifier}`)
        : prefixed.push(`${variant}:${prefix}${value}`)
    } else {
      modifier
        ? prefixed.push(`${prefix}${value}/${modifier}`)
        : prefixed.push(`${prefix}${value}`)
    }
  }
  return prefixed.join(" ")
}

export function applyPrefixesCss(css: string, prefix: string) {
  const lines = css.split("\n")
  for (let line of lines) {
    if (line.includes("@apply")) {
      const originalTWCls = line.replace("@apply", "").trim()
      const prefixedTwCls = applyPrefix(originalTWCls, prefix)
      css = css.replace(originalTWCls, prefixedTwCls)
    }
  }
  return css
}
