import { applyEdits, type TextEdit } from "@/src/utils/codemod/edits"
import { getReplacementText } from "@/src/utils/codemod/indentation"
import {
  getPropertyName,
  isPropertyAssignment,
} from "@/src/utils/codemod/object-literals"
import {
  getDescendants,
  getText,
  isCallExpression,
  parseTransformInput,
} from "@/src/utils/codemod/parse"
import { StringLiterals } from "@/src/utils/codemod/string-literals"
import { type Transformer } from "@/src/utils/transformers"
import { transformSourceText } from "@/src/utils/transformers/source-text"
import { types as t } from "@babel/core"

import { splitClassName } from "./transform-css-vars"
import { getArgumentStrings, getClassNameStrings } from "./transform-tw-prefix"

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

export const transformRtl: Transformer = (code, { config }) =>
  config.rtl ? applyRtl(code) : code

// Standalone function to transform source code for RTL.
// This is used by the build script.
export async function transformDirection(source: string, rtl: boolean) {
  if (!rtl) {
    return source
  }

  return transformSourceText(source, applyRtl)
}

function stripQuotes(str: string) {
  return str.replace(/^["']|["']$/g, "")
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

// Core RTL transformation logic, shared by transformRtl (CLI) and
// transformDirection (build script). ts-morph visits the class strings, then
// the side props, then the side defaults. A class string visited again maps
// the value the visit before it wrote, which applyRtlMapping() can change
// again, as it adds rtl: classes.
function applyRtl(code: string) {
  const file = parseTransformInput(code)
  if (!file) {
    return code
  }

  // ts-morph's setLiteralValue() writes the value even when the mapping
  // leaves it as it is, which rewrites the string's escapes.
  const literals = new StringLiterals(code, file)
  for (const literal of [
    ...getClassNameStrings(code, file),
    ...getMergePropsStrings(code, file),
  ]) {
    literals.setValue(literal, applyRtlMapping(literals.getValue(literal)))
  }

  const sideEdits = [
    ...getSideProps(code, file),
    ...getSideDefaults(code, file),
  ].flatMap((literal) => getSideEdit(code, literal))

  return applyEdits(code, [...literals.getEdits(), ...sideEdits])
}

// The strings of the className property of mergeProps({ ... }), the first
// argument: a string, or the arguments of a cn() call.
function getMergePropsStrings(code: string, file: t.File) {
  return getDescendants(file, isCallExpression).flatMap((call) => {
    const [options] = call.arguments
    if (
      getText(code, call.callee) !== "mergeProps" ||
      options?.type !== "ObjectExpression"
    ) {
      return []
    }

    const className = options.properties
      .filter(isPropertyAssignment)
      .find((property) => getPropertyName(code, property) === "className")
    if (!className) {
      return []
    }

    const { value } = className
    if (value.type === "StringLiteral") {
      return [value]
    }
    if (isCallExpression(value) && getText(code, value.callee) === "cn") {
      return value.arguments.flatMap((arg) =>
        getArgumentStrings(arg, { binary: true })
      )
    }
    return []
  })
}

// The string of the first side attribute of each element of a component in
// RTL_SIDE_PROP_COMPONENTS.
function getSideProps(code: string, file: t.File) {
  return getDescendants(file, t.isJSXOpeningElement).flatMap((element) => {
    if (!RTL_SIDE_PROP_COMPONENTS.includes(getText(code, element.name))) {
      return []
    }

    const side = element.attributes.find(
      (attribute) =>
        attribute.type === "JSXAttribute" &&
        getText(code, attribute.name) === "side"
    )
    return side?.type === "JSXAttribute" && side.value?.type === "StringLiteral"
      ? [side.value]
      : []
  })
}

// The string default of each side binding, as in function F({ side = "right" }),
// whose innermost function declaration is a component in
// RTL_SIDE_PROP_COMPONENTS. TypeScript's BindingElement is an element of a
// Babel pattern. A destructuring assignment's pattern counts too, though
// TypeScript parses it as an object or array literal.
function getSideDefaults(code: string, file: t.File) {
  const functions = getDescendants(file, t.isFunctionDeclaration)
  const elements = getDescendants(
    file,
    (node): node is t.ObjectPattern | t.ArrayPattern =>
      t.isObjectPattern(node) || t.isArrayPattern(node)
  ).flatMap((pattern) =>
    pattern.type === "ObjectPattern"
      ? pattern.properties.map((property) =>
          property.type === "ObjectProperty" ? property.value : property
        )
      : pattern.elements
  )

  return elements.flatMap((element) => {
    if (
      element?.type !== "AssignmentPattern" ||
      getText(code, element.left) !== "side" ||
      element.right.type !== "StringLiteral"
    ) {
      return []
    }

    const functionName = functions
      .filter((fn) => fn.start! <= element.start! && element.end! <= fn.end!)
      .at(-1)?.id?.name
    return functionName && RTL_SIDE_PROP_COMPONENTS.includes(functionName)
      ? [element.right]
      : []
  })
}

// ts-morph's replaceWithText() on a side string with its logical value, in
// double quotes.
function getSideEdit(code: string, literal: t.StringLiteral): TextEdit[] {
  const mappedValue =
    RTL_SIDE_PROP_MAPPINGS[stripQuotes(getText(code, literal))]
  if (!mappedValue) {
    return []
  }

  return [
    {
      start: literal.start!,
      end: literal.end!,
      text: getReplacementText(code, literal.start!, `"${mappedValue}"`),
    },
  ]
}
