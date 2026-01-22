import { Transformer } from "@/src/utils/transformers"
import { Project, ScriptKind, SyntaxKind } from "ts-morph"

import { splitClassName } from "./transform-css-vars"

// Mapping of physical → logical Tailwind class prefixes.
// Order matters: longer prefixes should come first to avoid partial matches.
const RTL_MAPPINGS: [string, string][] = [
  // Negative margins (must come before positive).
  ["-ml-", "-ms-"],
  ["-mr-", "-me-"],
  // Margins.
  ["ml-", "ms-"],
  ["mr-", "me-"],
  // Paddings.
  ["pl-", "ps-"],
  ["pr-", "pe-"],
  // Negative positioning (must come before positive).
  ["-left-", "-start-"],
  ["-right-", "-end-"],
  // Positioning.
  ["left-", "start-"],
  ["right-", "end-"],
  // Inset.
  ["inset-l-", "inset-inline-start-"],
  ["inset-r-", "inset-inline-end-"],
  // Rounded corners (specific first).
  ["rounded-tl-", "rounded-ss-"],
  ["rounded-tr-", "rounded-se-"],
  ["rounded-bl-", "rounded-es-"],
  ["rounded-br-", "rounded-ee-"],
  ["rounded-l-", "rounded-s-"],
  ["rounded-r-", "rounded-e-"],
  // Borders (with values first).
  ["border-l-", "border-s-"],
  ["border-r-", "border-e-"],
  // Borders (without values).
  ["border-l", "border-s"],
  ["border-r", "border-e"],
  // Text alignment.
  ["text-left", "text-start"],
  ["text-right", "text-end"],
  // Scroll margins.
  ["scroll-ml-", "scroll-ms-"],
  ["scroll-mr-", "scroll-me-"],
  // Scroll paddings.
  ["scroll-pl-", "scroll-ps-"],
  ["scroll-pr-", "scroll-pe-"],
  // Float.
  ["float-left", "float-start"],
  ["float-right", "float-end"],
  // Clear.
  ["clear-left", "clear-start"],
  ["clear-right", "clear-end"],
  // Transform origin (specific first).
  ["origin-top-left", "origin-top-start"],
  ["origin-top-right", "origin-top-end"],
  ["origin-bottom-left", "origin-bottom-start"],
  ["origin-bottom-right", "origin-bottom-end"],
  ["origin-left", "origin-start"],
  ["origin-right", "origin-end"],
  // Slide animations (tw-animate-css has logical equivalents).
  // ["slide-in-from-left", "slide-in-from-start"],
  // ["slide-in-from-right", "slide-in-from-end"],
  // ["slide-out-to-left", "slide-out-to-start"],
  // ["slide-out-to-right", "slide-out-to-end"],
]

// Translate-x mappings (these add rtl: variants instead of replacing).
// Pattern: [physical, rtlPhysical] - negative becomes positive and vice versa.
const RTL_TRANSLATE_X_MAPPINGS: [string, string][] = [
  ["-translate-x-", "translate-x-"],
  ["translate-x-", "-translate-x-"],
]

// Classes that need rtl:*-reverse added (no logical equivalents in Tailwind).
// Pattern: prefix → rtl variant to add.
const RTL_REVERSE_MAPPINGS: [string, string][] = [
  ["space-x-", "space-x-reverse"],
  ["divide-x-", "divide-x-reverse"],
]

// Classes that need rtl: variant with swapped value (no logical equivalents).
// Pattern: [physical, rtlSwapped] - value swaps in RTL.
const RTL_SWAP_MAPPINGS: [string, string][] = [
  ["cursor-w-resize", "cursor-e-resize"],
  ["cursor-e-resize", "cursor-w-resize"],
]

// Props that need value swapping for RTL.
// Format: { propName: { fromValue: toValue } }
// const RTL_PROP_MAPPINGS: Record<string, Record<string, string>> = {
//   side: {
//     left: "right",
//     right: "left",
//   },
//   align: {
//     left: "right",
//     right: "left",
//   },
//   position: {
//     left: "right",
//     right: "left",
//   },
//   origin: {
//     left: "right",
//     right: "left",
//   },
// }

// Helper to strip quotes from a string literal.
function stripQuotes(str: string) {
  return str.replace(/^["']|["']$/g, "")
}

export function applyRtlMapping(input: string) {
  return input
    .split(" ")
    .flatMap((className) => {
      const [variant, value, modifier] = splitClassName(className)

      if (!value) {
        return [className]
      }

      // Check for translate-x patterns first (add rtl: variant, don't replace).
      for (const [physical, rtlPhysical] of RTL_TRANSLATE_X_MAPPINGS) {
        if (value.startsWith(physical)) {
          const rtlValue = value.replace(physical, rtlPhysical)
          const rtlClass = variant
            ? `rtl:${variant}:${rtlValue}${modifier ? `/${modifier}` : ""}`
            : `rtl:${rtlValue}${modifier ? `/${modifier}` : ""}`
          return [className, rtlClass]
        }
      }

      // Check for space-x/divide-x patterns (add rtl:*-reverse variant).
      for (const [prefix, reverseClass] of RTL_REVERSE_MAPPINGS) {
        if (value.startsWith(prefix)) {
          const rtlClass = variant
            ? `rtl:${variant}:${reverseClass}`
            : `rtl:${reverseClass}`
          return [className, rtlClass]
        }
      }

      // Check for cursor and other swap patterns (add rtl: variant with swapped value).
      for (const [physical, swapped] of RTL_SWAP_MAPPINGS) {
        if (value === physical) {
          const rtlClass = variant
            ? `rtl:${variant}:${swapped}`
            : `rtl:${swapped}`
          return [className, rtlClass]
        }
      }

      // Find matching RTL mapping for direct replacement.
      let mappedValue = value
      for (const [physical, logical] of RTL_MAPPINGS) {
        if (value.startsWith(physical)) {
          mappedValue = value.replace(physical, logical)
          break
        } else if (value === physical.replace(/-$/, "")) {
          // Handle classes without values (e.g., border-l -> border-s).
          mappedValue = logical.replace(/-$/, "")
          break
        }
      }

      // Reassemble with variant and modifier.
      if (variant) {
        return modifier
          ? [`${variant}:${mappedValue}/${modifier}`]
          : [`${variant}:${mappedValue}`]
      }
      return modifier ? [`${mappedValue}/${modifier}`] : [mappedValue]
    })
    .join(" ")
}

export const transformRtl: Transformer = async ({ sourceFile, config }) => {
  if (config.direction !== "rtl") {
    return sourceFile
  }

  // Find the cva function calls.
  sourceFile
    .getDescendantsOfKind(SyntaxKind.CallExpression)
    .filter((node) => node.getExpression().getText() === "cva")
    .forEach((node) => {
      // cva(base, ...).
      if (node.getArguments()[0]?.isKind(SyntaxKind.StringLiteral)) {
        const defaultClassNames = node.getArguments()[0]
        if (defaultClassNames) {
          const text = stripQuotes(defaultClassNames.getText() ?? "")
          defaultClassNames.replaceWithText(`"${applyRtlMapping(text)}"`)
        }
      }

      // cva(..., { variants: { ... } }).
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
                  const text = stripQuotes(classNames.getText() ?? "")
                  classNames.replaceWithText(`"${applyRtlMapping(text)}"`)
                }
              })
          })
      }
    })

  // Find all jsx attributes with the name className.
  sourceFile.getDescendantsOfKind(SyntaxKind.JsxAttribute).forEach((node) => {
    if (node.getNameNode().getText() === "className") {
      // className="...".
      if (node.getInitializer()?.isKind(SyntaxKind.StringLiteral)) {
        const value = node.getInitializer()
        if (value) {
          const text = stripQuotes(value.getText() ?? "")
          value.replaceWithText(`"${applyRtlMapping(text)}"`)
        }
      }

      // className={...}.
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
                  const text = stripQuotes(node.getText() ?? "")
                  node.replaceWithText(`"${applyRtlMapping(text)}"`)
                })
            }

            if (node.isKind(SyntaxKind.StringLiteral)) {
              const text = stripQuotes(node.getText() ?? "")
              node.replaceWithText(`"${applyRtlMapping(text)}"`)
            }
          })
        }
      }
    }

    // classNames={...}.
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
                        const text = stripQuotes(node.getText() ?? "")
                        node.replaceWithText(`"${applyRtlMapping(text)}"`)
                      })
                  }

                  if (arg.isKind(SyntaxKind.StringLiteral)) {
                    const text = stripQuotes(arg.getText() ?? "")
                    arg.replaceWithText(`"${applyRtlMapping(text)}"`)
                  }
                })
              }
            }

            if (node.getInitializer()?.isKind(SyntaxKind.StringLiteral)) {
              if (node.getNameNode().getText() !== "variant") {
                const classNames = node.getInitializer()
                if (classNames) {
                  const text = stripQuotes(classNames.getText() ?? "")
                  classNames.replaceWithText(`"${applyRtlMapping(text)}"`)
                }
              }
            }
          })
      }
    }
  })

  // Transform directional prop values (e.g., side="right" → side="left").
  // sourceFile.getDescendantsOfKind(SyntaxKind.JsxAttribute).forEach((node) => {
  //   const propName = node.getNameNode().getText()
  //   const propMapping = RTL_PROP_MAPPINGS[propName]

  //   if (propMapping) {
  //     const initializer = node.getInitializer()
  //     if (initializer?.isKind(SyntaxKind.StringLiteral)) {
  //       const value = stripQuotes(initializer.getText() ?? "")
  //       if (propMapping[value]) {
  //         initializer.replaceWithText(`"${propMapping[value]}"`)
  //       }
  //     }
  //   }
  // })

  // Transform default parameter values (e.g., side = "right" → side = "left").
  // sourceFile.getDescendantsOfKind(SyntaxKind.BindingElement).forEach((node) => {
  //   const paramName = node.getNameNode().getText()
  //   const propMapping = RTL_PROP_MAPPINGS[paramName]

  //   if (propMapping) {
  //     const initializer = node.getInitializer()
  //     if (initializer?.isKind(SyntaxKind.StringLiteral)) {
  //       const value = stripQuotes(initializer.getText() ?? "")
  //       if (propMapping[value]) {
  //         initializer.replaceWithText(`"${propMapping[value]}"`)
  //       }
  //     }
  //   }
  // })

  // Find mergeProps calls with className property containing cn().
  sourceFile
    .getDescendantsOfKind(SyntaxKind.CallExpression)
    .filter((node) => node.getExpression().getText() === "mergeProps")
    .forEach((node) => {
      const firstArg = node.getArguments()[0]
      if (firstArg?.isKind(SyntaxKind.ObjectLiteralExpression)) {
        // Find className property.
        const classNameProp = firstArg
          .getProperties()
          .find(
            (prop) =>
              prop.isKind(SyntaxKind.PropertyAssignment) &&
              prop.getName() === "className"
          )
        if (classNameProp?.isKind(SyntaxKind.PropertyAssignment)) {
          const init = classNameProp.getInitializer()
          // Handle cn() call.
          if (init?.isKind(SyntaxKind.CallExpression)) {
            if (init.getExpression().getText() === "cn") {
              init.getArguments().forEach((arg) => {
                if (arg.isKind(SyntaxKind.StringLiteral)) {
                  const text = stripQuotes(arg.getText() ?? "")
                  arg.replaceWithText(`"${applyRtlMapping(text)}"`)
                }
                if (
                  arg.isKind(SyntaxKind.ConditionalExpression) ||
                  arg.isKind(SyntaxKind.BinaryExpression)
                ) {
                  arg
                    .getChildrenOfKind(SyntaxKind.StringLiteral)
                    .forEach((n) => {
                      const text = stripQuotes(n.getText() ?? "")
                      n.replaceWithText(`"${applyRtlMapping(text)}"`)
                    })
                }
              })
            }
          }
          // Handle plain string literal.
          if (init?.isKind(SyntaxKind.StringLiteral)) {
            const text = stripQuotes(init.getText() ?? "")
            init.replaceWithText(`"${applyRtlMapping(text)}"`)
          }
        }
      }
    })

  return sourceFile
}

// Standalone function to transform source code for a specific direction.
// This is used by the build script and doesn't require a config object.
export async function transformDirection(
  source: string,
  direction: "ltr" | "rtl"
) {
  if (direction === "ltr") {
    return source
  }

  const project = new Project({
    useInMemoryFileSystem: true,
  })

  const sourceFile = project.createSourceFile("component.tsx", source, {
    scriptKind: ScriptKind.TSX,
    overwrite: true,
  })

  // Find cva function calls.
  sourceFile
    .getDescendantsOfKind(SyntaxKind.CallExpression)
    .filter((node) => node.getExpression().getText() === "cva")
    .forEach((node) => {
      // cva(base, ...).
      const firstArg = node.getArguments()[0]
      if (firstArg?.isKind(SyntaxKind.StringLiteral)) {
        const text = firstArg.getLiteralText()
        firstArg.setLiteralValue(applyRtlMapping(text))
      }

      // cva(..., { variants: { ... } }).
      if (node.getArguments()[1]?.isKind(SyntaxKind.ObjectLiteralExpression)) {
        node
          .getArguments()[1]
          ?.getDescendantsOfKind(SyntaxKind.PropertyAssignment)
          .find((n) => n.getName() === "variants")
          ?.getDescendantsOfKind(SyntaxKind.PropertyAssignment)
          .forEach((n) => {
            n.getDescendantsOfKind(SyntaxKind.PropertyAssignment).forEach(
              (propNode) => {
                const classNames = propNode.getInitializerIfKind(
                  SyntaxKind.StringLiteral
                )
                if (classNames) {
                  const text = classNames.getLiteralText()
                  classNames.setLiteralValue(applyRtlMapping(text))
                }
              }
            )
          })
      }
    })

  // Find all jsx attributes with the name className.
  sourceFile.getDescendantsOfKind(SyntaxKind.JsxAttribute).forEach((node) => {
    if (node.getNameNode().getText() === "className") {
      // className="...".
      const initializer = node.getInitializer()
      if (initializer?.isKind(SyntaxKind.StringLiteral)) {
        const text = initializer.getLiteralText()
        initializer.setLiteralValue(applyRtlMapping(text))
      }

      // className={...}.
      if (initializer?.isKind(SyntaxKind.JsxExpression)) {
        // Check if it's a call to cn().
        const callExpression = initializer
          .getDescendantsOfKind(SyntaxKind.CallExpression)
          .find((n) => n.getExpression().getText() === "cn")
        if (callExpression) {
          callExpression.getArguments().forEach((arg) => {
            if (
              arg.isKind(SyntaxKind.ConditionalExpression) ||
              arg.isKind(SyntaxKind.BinaryExpression)
            ) {
              arg.getChildrenOfKind(SyntaxKind.StringLiteral).forEach((n) => {
                const text = n.getLiteralText()
                n.setLiteralValue(applyRtlMapping(text))
              })
            }

            if (arg.isKind(SyntaxKind.StringLiteral)) {
              const text = arg.getLiteralText()
              arg.setLiteralValue(applyRtlMapping(text))
            }
          })
        }
      }
    }

    // classNames={...}.
    if (node.getNameNode().getText() === "classNames") {
      const init = node.getInitializer()
      if (init?.isKind(SyntaxKind.JsxExpression)) {
        node
          .getDescendantsOfKind(SyntaxKind.PropertyAssignment)
          .forEach((propAssign) => {
            const propInit = propAssign.getInitializer()
            if (propInit?.isKind(SyntaxKind.CallExpression)) {
              propInit.getArguments().forEach((arg) => {
                if (arg.isKind(SyntaxKind.ConditionalExpression)) {
                  arg
                    .getChildrenOfKind(SyntaxKind.StringLiteral)
                    .forEach((strNode) => {
                      const text = strNode.getLiteralText()
                      strNode.setLiteralValue(applyRtlMapping(text))
                    })
                }

                if (arg.isKind(SyntaxKind.StringLiteral)) {
                  const text = arg.getLiteralText()
                  arg.setLiteralValue(applyRtlMapping(text))
                }
              })
            }

            if (propInit?.isKind(SyntaxKind.StringLiteral)) {
              if (propAssign.getNameNode().getText() !== "variant") {
                const text = propInit.getLiteralText()
                propInit.setLiteralValue(applyRtlMapping(text))
              }
            }
          })
      }
    }
  })

  // Transform directional prop values (e.g., side="right" → side="left").
  // sourceFile.getDescendantsOfKind(SyntaxKind.JsxAttribute).forEach((node) => {
  //   const propName = node.getNameNode().getText()
  //   const propMapping = RTL_PROP_MAPPINGS[propName]

  //   if (propMapping) {
  //     const initializer = node.getInitializer()
  //     if (initializer?.isKind(SyntaxKind.StringLiteral)) {
  //       const value = initializer.getLiteralText()
  //       if (propMapping[value]) {
  //         initializer.setLiteralValue(propMapping[value])
  //       }
  //     }
  //   }
  // })

  // Transform default parameter values (e.g., side = "right" → side = "left").
  // sourceFile.getDescendantsOfKind(SyntaxKind.BindingElement).forEach((node) => {
  //   const paramName = node.getNameNode().getText()
  //   const propMapping = RTL_PROP_MAPPINGS[paramName]

  //   if (propMapping) {
  //     const initializer = node.getInitializer()
  //     if (initializer?.isKind(SyntaxKind.StringLiteral)) {
  //       const value = initializer.getLiteralText()
  //       if (propMapping[value]) {
  //         initializer.setLiteralValue(propMapping[value])
  //       }
  //     }
  //   }
  // })

  // Find mergeProps calls with className property containing cn().
  sourceFile
    .getDescendantsOfKind(SyntaxKind.CallExpression)
    .filter((node) => node.getExpression().getText() === "mergeProps")
    .forEach((node) => {
      const firstArg = node.getArguments()[0]
      if (firstArg?.isKind(SyntaxKind.ObjectLiteralExpression)) {
        // Find className property.
        const classNameProp = firstArg
          .getProperties()
          .find(
            (prop) =>
              prop.isKind(SyntaxKind.PropertyAssignment) &&
              prop.getName() === "className"
          )
        if (classNameProp?.isKind(SyntaxKind.PropertyAssignment)) {
          const init = classNameProp.getInitializer()
          // Handle cn() call.
          if (init?.isKind(SyntaxKind.CallExpression)) {
            if (init.getExpression().getText() === "cn") {
              init.getArguments().forEach((arg) => {
                if (arg.isKind(SyntaxKind.StringLiteral)) {
                  const text = arg.getLiteralText()
                  arg.setLiteralValue(applyRtlMapping(text))
                }
                if (
                  arg.isKind(SyntaxKind.ConditionalExpression) ||
                  arg.isKind(SyntaxKind.BinaryExpression)
                ) {
                  arg
                    .getChildrenOfKind(SyntaxKind.StringLiteral)
                    .forEach((n) => {
                      const text = n.getLiteralText()
                      n.setLiteralValue(applyRtlMapping(text))
                    })
                }
              })
            }
          }
          // Handle plain string literal.
          if (init?.isKind(SyntaxKind.StringLiteral)) {
            const text = init.getLiteralText()
            init.setLiteralValue(applyRtlMapping(text))
          }
        }
      }
    })

  return sourceFile.getText()
}
