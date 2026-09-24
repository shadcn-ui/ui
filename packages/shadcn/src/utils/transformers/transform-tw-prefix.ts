import { Transformer } from "@/src/utils/transformers"
import { SyntaxKind } from "ts-morph"

import {
  getProjectTailwindVersionFromConfig,
  TailwindVersion,
} from "../get-project-info"
import { splitClassName } from "./transform-css-vars"

export const transformTwPrefixes: Transformer = async ({
  sourceFile,
  config,
}) => {
  if (!config.tailwind?.prefix) {
    return sourceFile
  }
  const tailwindVersion = await getProjectTailwindVersionFromConfig(config)

  // Find the cva function calls.
  sourceFile
    .getDescendantsOfKind(SyntaxKind.CallExpression)
    .filter((node) => node.getExpression().getText() === "cva")
    .forEach((node) => {
      // cva(base, ...)
      const defaultClassNames = node
        .getArguments()[0]
        ?.asKind(SyntaxKind.StringLiteral)
      if (defaultClassNames) {
        defaultClassNames.setLiteralValue(
          applyPrefix(
            defaultClassNames.getLiteralText(),
            config.tailwind.prefix,
            tailwindVersion
          )
        )
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
                  classNames.setLiteralValue(
                    applyPrefix(
                      classNames.getLiteralText(),
                      config.tailwind.prefix,
                      tailwindVersion
                    )
                  )
                }
              })
          })
      }
    })

  // Find all jsx attributes with the name className.
  sourceFile.getDescendantsOfKind(SyntaxKind.JsxAttribute).forEach((node) => {
    if (node.getNameNode().getText() === "className") {
      // className="..."
      const value = node.getInitializer()?.asKind(SyntaxKind.StringLiteral)
      if (value) {
        value.setLiteralValue(
          applyPrefix(
            value.getLiteralText(),
            config.tailwind.prefix,
            tailwindVersion
          )
        )
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
                  node.setLiteralValue(
                    applyPrefix(
                      node.getLiteralText(),
                      config.tailwind.prefix,
                      tailwindVersion
                    )
                  )
                })
            }

            if (node.isKind(SyntaxKind.StringLiteral)) {
              node.setLiteralValue(
                applyPrefix(
                  node.getLiteralText(),
                  config.tailwind.prefix,
                  tailwindVersion
                )
              )
            }
          })
        }
      }
    }

    // classNames={...}
    if (node.getNameNode().getText() === "classNames") {
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
                        node.setLiteralValue(
                          applyPrefix(
                            node.getLiteralText(),
                            config.tailwind.prefix,
                            tailwindVersion
                          )
                        )
                      })
                  }

                  if (arg.isKind(SyntaxKind.StringLiteral)) {
                    arg.setLiteralValue(
                      applyPrefix(
                        arg.getLiteralText(),
                        config.tailwind.prefix,
                        tailwindVersion
                      )
                    )
                  }
                })
              }
            }

            if (node.getNameNode().getText() !== "variant") {
              const classNames = node.getInitializerIfKind(
                SyntaxKind.StringLiteral
              )
              if (classNames) {
                classNames.setLiteralValue(
                  applyPrefix(
                    classNames.getLiteralText(),
                    config.tailwind.prefix,
                    tailwindVersion
                  )
                )
              }
            }
          })
      }
    }
  })

  return sourceFile
}

export function applyPrefix(
  input: string,
  prefix: string = "",
  tailwindVersion: TailwindVersion
) {
  if (tailwindVersion === "v3") {
    return input
      .split(" ")
      .map((className) => {
        const [variant, value, modifier] = splitClassName(className)
        if (variant) {
          return modifier
            ? `${variant}:${prefix}${value}/${modifier}`
            : `${variant}:${prefix}${value}`
        } else {
          return modifier
            ? `${prefix}${value}/${modifier}`
            : `${prefix}${value}`
        }
      })
      .join(" ")
  }

  return input
    .split(" ")
    .map((className) =>
      className.indexOf(`${prefix}:`) === 0
        ? className
        : `${prefix}:${className.trim()}`
    )
    .join(" ")
}

export function applyPrefixesCss(
  css: string,
  prefix: string,
  tailwindVersion: TailwindVersion
) {
  const lines = css.split("\n")
  for (let line of lines) {
    if (line.includes("@apply")) {
      const originalTWCls = line.replace("@apply", "").trim()
      const prefixedTwCls = applyPrefix(originalTWCls, prefix, tailwindVersion)
      css = css.replace(originalTWCls, prefixedTwCls)
    }
  }
  return css
}
