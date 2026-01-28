import { Transformer } from "@/src/utils/transformers"
import { Project, ScriptKind, SourceFile, SyntaxKind } from "ts-morph"

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

// Slide animation mappings for logical side variants.
// When inside data-[side=inline-start/end], slide directions should use logical values.
// Pattern: [variant, physical, logical]
const RTL_LOGICAL_SIDE_SLIDE_MAPPINGS: [string, string, string][] = [
  ["data-[side=inline-start]", "slide-in-from-right", "slide-in-from-end"],
  ["data-[side=inline-start]", "slide-out-to-right", "slide-out-to-end"],
  ["data-[side=inline-end]", "slide-in-from-left", "slide-in-from-start"],
  ["data-[side=inline-end]", "slide-out-to-left", "slide-out-to-start"],
]

// Marker class for icons that should get rtl:rotate-180.
// This class is added in the registry and removed during transformation.
const RTL_FLIP_MARKER = "cn-rtl-flip"

// Components that should have their side prop transformed to logical values.
// side="right" → side="inline-end", side="left" → side="inline-start".
const RTL_SIDE_PROP_COMPONENTS = [
  "ContextMenuContent",
  "ContextMenuSubContent",
  "DropdownMenuSubContent",
]

// Mapping for side prop values.
const RTL_SIDE_PROP_MAPPINGS: Record<string, string> = {
  right: "inline-end",
  left: "inline-start",
}

// Logical side selector mappings (additive - adds logical alongside physical).
// Used when cn-logical-sides marker class is present.
// In RTL: inline-start = right, inline-end = left.
// Pattern: [physical, logical] - add logical selector alongside physical.
// const LOGICAL_SIDE_MAPPINGS: [string, string][] = [
//   ["data-[side=left]:", "data-[side=inline-end]:"],
//   ["data-[side=right]:", "data-[side=inline-start]:"],
// ]

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
  // Check if the class string contains the marker for RTL icon flip.
  const hasRtlFlip = input.includes(RTL_FLIP_MARKER)

  return input
    .split(" ")
    .flatMap((className) => {
      // Remove the cn-rtl-flip marker and add rtl:rotate-180.
      if (className === RTL_FLIP_MARKER) {
        return hasRtlFlip ? ["rtl:rotate-180"] : []
      }
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

      // Check for slide animations inside logical side variants.
      // e.g., data-[side=inline-start]:slide-in-from-right-2 → data-[side=inline-start]:slide-in-from-end-2
      for (const [
        variantPattern,
        physical,
        logical,
      ] of RTL_LOGICAL_SIDE_SLIDE_MAPPINGS) {
        if (variant?.includes(variantPattern) && value.startsWith(physical)) {
          const mappedValue = value.replace(physical, logical)
          const result = modifier
            ? `${variant}:${mappedValue}/${modifier}`
            : `${variant}:${mappedValue}`
          return [result]
        }
      }

      // Skip positioning transformations for physical side variants.
      // e.g., data-[side=left]:-right-1 should NOT become data-[side=left]:-end-1
      // because the physical side needs physical positioning.
      const isPhysicalSideVariant =
        variant?.includes("data-[side=left]") ||
        variant?.includes("data-[side=right]")

      // Positioning prefixes that should be skipped for physical side variants.
      const positioningPrefixes = ["-left-", "-right-", "left-", "right-"]

      // Find matching RTL mapping for direct replacement.
      let mappedValue = value
      for (const [physical, logical] of RTL_MAPPINGS) {
        // Skip positioning transforms for physical side variants.
        if (
          isPhysicalSideVariant &&
          positioningPrefixes.some((p) => physical.startsWith(p))
        ) {
          continue
        }

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
      let result: string
      if (variant) {
        result = modifier
          ? `${variant}:${mappedValue}/${modifier}`
          : `${variant}:${mappedValue}`
      } else {
        result = modifier ? `${mappedValue}/${modifier}` : mappedValue
      }

      // If cn-logical-sides marker is present, add logical side selectors.
      // e.g., data-[side=left]:foo → data-[side=left]:foo data-[side=inline-start]:foo
      // Applied after RTL mappings so the value is already transformed.
      // if (hasLogicalSides && variant) {
      // for (const [physical, logical] of LOGICAL_SIDE_MAPPINGS) {
      //   if (variant.includes(physical.slice(0, -1))) {
      //     const logicalVariant = variant.replace(
      //       physical.slice(0, -1),
      //       logical.slice(0, -1)
      //     )
      //     const logicalClass = modifier
      //       ? `${logicalVariant}:${mappedValue}/${modifier}`
      //       : `${logicalVariant}:${mappedValue}`
      //     return [result, logicalClass]
      //   }
      // }
      // }

      return [result]
    })
    .join(" ")
}

// Core RTL transformation logic that operates on a SourceFile.
// Extracted to be reusable by both transformRtl (CLI) and transformDirection (build script).
function applyRtlTransformToSourceFile(sourceFile: SourceFile) {
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

  // Transform side prop to logical values for specific components.
  ;[
    ...sourceFile.getDescendantsOfKind(SyntaxKind.JsxSelfClosingElement),
    ...sourceFile.getDescendantsOfKind(SyntaxKind.JsxOpeningElement),
  ].forEach((element) => {
    const tagName = element.getTagNameNode().getText()
    if (!RTL_SIDE_PROP_COMPONENTS.includes(tagName)) {
      return
    }

    const sideAttr = element
      .getAttributes()
      .find(
        (attr) =>
          attr.isKind(SyntaxKind.JsxAttribute) &&
          attr.getNameNode().getText() === "side"
      )

    if (!sideAttr?.isKind(SyntaxKind.JsxAttribute)) {
      return
    }

    const sideValue = sideAttr.getInitializer()
    if (!sideValue?.isKind(SyntaxKind.StringLiteral)) {
      return
    }

    const currentValue = stripQuotes(sideValue.getText() ?? "")
    const mappedValue = RTL_SIDE_PROP_MAPPINGS[currentValue]
    if (mappedValue) {
      sideValue.replaceWithText(`"${mappedValue}"`)
    }
  })

  // Transform default parameter values for side prop (e.g., side = "right").
  // Only for functions whose names are in the whitelist.
  sourceFile.getDescendantsOfKind(SyntaxKind.BindingElement).forEach((node) => {
    const paramName = node.getNameNode().getText()
    if (paramName !== "side") {
      return
    }

    // Check if this binding element is inside a whitelisted function.
    const functionDecl = node.getFirstAncestorByKind(
      SyntaxKind.FunctionDeclaration
    )
    const functionName = functionDecl?.getName()
    if (!functionName || !RTL_SIDE_PROP_COMPONENTS.includes(functionName)) {
      return
    }

    const initializer = node.getInitializer()
    if (!initializer?.isKind(SyntaxKind.StringLiteral)) {
      return
    }

    const currentValue = stripQuotes(initializer.getText() ?? "")
    const mappedValue = RTL_SIDE_PROP_MAPPINGS[currentValue]
    if (mappedValue) {
      initializer.replaceWithText(`"${mappedValue}"`)
    }
  })
}

export const transformRtl: Transformer = async ({ sourceFile, config }) => {
  if (!config.rtl) {
    return sourceFile
  }

  applyRtlTransformToSourceFile(sourceFile)

  return sourceFile
}

// Standalone function to transform source code for RTL.
// This is used by the build script.
export async function transformDirection(source: string, rtl: boolean) {
  if (!rtl) {
    return source
  }

  const project = new Project({
    useInMemoryFileSystem: true,
  })

  const sourceFile = project.createSourceFile("component.tsx", source, {
    scriptKind: ScriptKind.TSX,
    overwrite: true,
  })

  applyRtlTransformToSourceFile(sourceFile)

  return sourceFile.getText()
}
