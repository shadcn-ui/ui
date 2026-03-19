import { Transformer } from "@/src/utils/transformers"
import { Project, ScriptKind, SourceFile, SyntaxKind } from "ts-morph"

import { splitClassName } from "./transform-css-vars"

// Physical → logical Tailwind class mappings (direct replacement).
// Order matters to avoid partial matches:
// - Negative prefixes before positive (e.g., -ml- before ml-).
// - Specific corners before general ones e.g. rounded-tl- before rounded-l-.
// - With-value variants before without-value (e.g., border-l- before border-l).
const RTL_MAPPINGS: [string, string][] = [
  ["-ml-", "-ms-"],
  ["-mr-", "-me-"],
  ["ml-", "ms-"],
  ["mr-", "me-"],
  ["pl-", "ps-"],
  ["pr-", "pe-"],
  ["-left-", "-start-"],
  ["-right-", "-end-"],
  ["left-", "start-"],
  ["right-", "end-"],
  ["inset-l-", "inset-inline-start-"],
  ["inset-r-", "inset-inline-end-"],
  ["rounded-tl-", "rounded-ss-"],
  ["rounded-tr-", "rounded-se-"],
  ["rounded-bl-", "rounded-es-"],
  ["rounded-br-", "rounded-ee-"],
  ["rounded-l-", "rounded-s-"],
  ["rounded-r-", "rounded-e-"],
  ["border-l-", "border-s-"],
  ["border-r-", "border-e-"],
  ["border-l", "border-s"],
  ["border-r", "border-e"],
  ["text-left", "text-start"],
  ["text-right", "text-end"],
  ["scroll-ml-", "scroll-ms-"],
  ["scroll-mr-", "scroll-me-"],
  ["scroll-pl-", "scroll-ps-"],
  ["scroll-pr-", "scroll-pe-"],
  ["float-left", "float-start"],
  ["float-right", "float-end"],
  ["clear-left", "clear-start"],
  ["clear-right", "clear-end"],
  ["origin-top-left", "origin-top-start"],
  ["origin-top-right", "origin-top-end"],
  ["origin-bottom-left", "origin-bottom-start"],
  ["origin-bottom-right", "origin-bottom-end"],
  ["origin-left", "origin-start"],
  ["origin-right", "origin-end"],
]

// Translate-x: adds rtl: variant (negative ↔ positive).
const RTL_TRANSLATE_X_MAPPINGS: [string, string][] = [
  ["-translate-x-", "translate-x-"],
  ["translate-x-", "-translate-x-"],
]

// Classes that need rtl:*-reverse (no logical equivalents).
const RTL_REVERSE_MAPPINGS: [string, string][] = [
  ["space-x-", "space-x-reverse"],
  ["divide-x-", "divide-x-reverse"],
]

// Classes that need rtl: variant with swapped value.
const RTL_SWAP_MAPPINGS: [string, string][] = [
  ["cursor-w-resize", "cursor-e-resize"],
  ["cursor-e-resize", "cursor-w-resize"],
]

// Slide animations inside logical side variants: [variant, physical, logical].
const RTL_LOGICAL_SIDE_SLIDE_MAPPINGS: [string, string, string][] = [
  ["data-[side=inline-start]", "slide-in-from-right", "slide-in-from-end"],
  ["data-[side=inline-start]", "slide-out-to-right", "slide-out-to-end"],
  ["data-[side=inline-end]", "slide-in-from-left", "slide-in-from-start"],
  ["data-[side=inline-end]", "slide-out-to-left", "slide-out-to-start"],
]

// Marker class for icons that should get rtl:rotate-180.
const RTL_FLIP_MARKER = "cn-rtl-flip"

// Components with side prop transformed to logical values.
const RTL_SIDE_PROP_COMPONENTS = [
  "ContextMenuContent",
  "ContextMenuSubContent",
  "DropdownMenuSubContent",
]

// Side prop value mappings.
const RTL_SIDE_PROP_MAPPINGS: Record<string, string> = {
  right: "inline-end",
  left: "inline-start",
}

// Positioning prefixes to skip for physical side variants.
const POSITIONING_PREFIXES = ["-left-", "-right-", "left-", "right-"]

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

function stripQuotes(str: string) {
  return str.replace(/^["']|["']$/g, "")
}

// Transforms a string literal node by applying RTL mappings.
function transformStringLiteralNode(node: {
  getText(): string
  replaceWithText(text: string): void
}) {
  const text = stripQuotes(node.getText() ?? "")
  node.replaceWithText(`"${applyRtlMapping(text)}"`)
}

export function applyRtlMapping(input: string) {
  return input
    .split(" ")
    .flatMap((className) => {
      // Skip classes that already have rtl: or ltr: prefix.
      if (className.startsWith("rtl:") || className.startsWith("ltr:")) {
        return [className]
      }

      // Replace the cn-rtl-flip marker with rtl:rotate-180.
      if (className === RTL_FLIP_MARKER) {
        return ["rtl:rotate-180"]
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
      // e.g., data-[side=left]:-right-1 should NOT become data-[side=left]:-end-1.
      const isPhysicalSideVariant =
        variant?.includes("data-[side=left]") ||
        variant?.includes("data-[side=right]")

      // Find matching RTL mapping for direct replacement.
      let mappedValue = value
      for (const [physical, logical] of RTL_MAPPINGS) {
        if (
          isPhysicalSideVariant &&
          POSITIONING_PREFIXES.some((p) => physical.startsWith(p))
        ) {
          continue
        }

        if (value.startsWith(physical)) {
          // For patterns without trailing '-', require exact match to avoid
          // partial matches like border-ring matching border-r.
          if (!physical.endsWith("-") && value !== physical) {
            continue
          }
          mappedValue = value.replace(physical, logical)
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
      const firstArg = node.getArguments()[0]
      if (firstArg?.isKind(SyntaxKind.StringLiteral)) {
        transformStringLiteralNode(firstArg)
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
              .forEach((prop) => {
                const classNames = prop.getInitializerIfKind(
                  SyntaxKind.StringLiteral
                )
                if (classNames) {
                  transformStringLiteralNode(classNames)
                }
              })
          })
      }
    })

  // Find all jsx attributes with the name className.
  sourceFile.getDescendantsOfKind(SyntaxKind.JsxAttribute).forEach((node) => {
    if (node.getNameNode().getText() === "className") {
      // className="...".
      const initializer = node.getInitializer()
      if (initializer?.isKind(SyntaxKind.StringLiteral)) {
        transformStringLiteralNode(initializer)
      }

      // className={...}.
      if (node.getInitializer()?.isKind(SyntaxKind.JsxExpression)) {
        // Check if it's a call to cn().
        const callExpression = node
          .getInitializer()
          ?.getDescendantsOfKind(SyntaxKind.CallExpression)
          .find((node) => node.getExpression().getText() === "cn")
        if (callExpression) {
          callExpression.getArguments().forEach((arg) => {
            if (
              arg.isKind(SyntaxKind.ConditionalExpression) ||
              arg.isKind(SyntaxKind.BinaryExpression)
            ) {
              arg
                .getChildrenOfKind(SyntaxKind.StringLiteral)
                .forEach(transformStringLiteralNode)
            }
            if (arg.isKind(SyntaxKind.StringLiteral)) {
              transformStringLiteralNode(arg)
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
                callExpression.getArguments().forEach((arg) => {
                  if (arg.isKind(SyntaxKind.ConditionalExpression)) {
                    arg
                      .getChildrenOfKind(SyntaxKind.StringLiteral)
                      .forEach(transformStringLiteralNode)
                  }
                  if (arg.isKind(SyntaxKind.StringLiteral)) {
                    transformStringLiteralNode(arg)
                  }
                })
              }
            }

            const propInit = node.getInitializer()
            if (propInit?.isKind(SyntaxKind.StringLiteral)) {
              if (node.getNameNode().getText() !== "variant") {
                transformStringLiteralNode(propInit)
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
                  transformStringLiteralNode(arg)
                }
                if (
                  arg.isKind(SyntaxKind.ConditionalExpression) ||
                  arg.isKind(SyntaxKind.BinaryExpression)
                ) {
                  arg
                    .getChildrenOfKind(SyntaxKind.StringLiteral)
                    .forEach(transformStringLiteralNode)
                }
              })
            }
          }
          // Handle plain string literal.
          if (init?.isKind(SyntaxKind.StringLiteral)) {
            transformStringLiteralNode(init)
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
