import { Transformer } from "@/src/utils/transformers"
import { SyntaxKind } from "ts-morph"

import { splitClassName } from "./transform-css-vars"

// Transformer to update string literals for RTL support
export const transformRtl: Transformer = async ({ sourceFile, config }) => {
  // If RTL support is not configured, do not transform the source file
  if (!config.tailwind?.rtl) {
    return sourceFile
  }

  // Iterate over all StringLiteral nodes in the file
  sourceFile.getDescendantsOfKind(SyntaxKind.StringLiteral).forEach((node) => {
    const textValue = node.getText()
    if (textValue) {
      // Apply direction mappings to each class name in the string
      const updatedValue = applyRtlClassMappings(textValue)
      // Replace the current node text with the updated classes text
      node.replaceWithText(`"${updatedValue.trim()}"`)
    }
  })

  return sourceFile
}

// Define mappings of class prefixes for right-to-left (RTL) support
const PREFIXES_MAP = new Map([
  ["pl-", "ps-"],
  ["ml-", "ms-"],
  ["pr-", "pe-"],
  ["mr-", "me-"],
  ["right-", "end-"],
  ["left-", "start-"],
  ["text-right", "text-end"],
  ["border-l-", "border-s-"],
  ["border-r-", "border-e-"],
  ["text-left", "text-start"],
])

// Define additional RTL specific class replacements
const ADDITIONAL_CLASSES = new Map([
  ["space-x-", "rtl:space-x-reverse"],
  ["divide-x-", "rtl:divide-x-reverse"],
])

// Apply RTL class mappings to a space-separated list of class names
export function applyRtlClassMappings(input: string): string {
  // Split the input into individual class names
  const classNames = input.split(" ")
  const rtlSupported = new Set<string>()

  for (let className of classNames) {
    const [, value] = splitClassName(className)
    // Find and apply prefix replacement, if exists
    const rtlPrefix = Array.from(PREFIXES_MAP).find(([prefix]) => {
      return value?.startsWith(prefix)
    })

    if (!rtlPrefix) {
      rtlSupported.add(className)
      continue
    }

    rtlSupported.add(className.replace(rtlPrefix[0], rtlPrefix[1]))
  }

  for (const [prefix, className] of Array.from(ADDITIONAL_CLASSES)) {
    if (input.indexOf(prefix) !== -1) {
      rtlSupported.add(className)
    }
  }

  // Reassemble the class list and trim any excess whitespace
  return Array.from(rtlSupported).join(" ").trim()
}
