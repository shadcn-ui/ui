import { parseTransformInput } from "@/src/codemod/parse"
import { StringLiterals } from "@/src/codemod/string-literals"
import { registryBaseColorSchema } from "@/src/registry/schema"
import { type Transformer } from "@/src/transformers"
import { z } from "zod"

export const transformCssVars: Transformer = (code, { config, baseColor }) => {
  if (config.tailwind?.cssVariables || !baseColor?.inlineColors) {
    return code
  }

  const file = parseTransformInput(code)
  if (!file) {
    return code
  }

  // Every string literal of the file, directives and import specifiers
  // included. A mapped value is trimmed, so a string with spaces around it
  // changes even without colors.
  const literals = new StringLiterals(code, file)
  for (const literal of literals.getStringLiterals()) {
    const raw = literals.getValue(literal)
    const mapped = applyColorMapping(raw, baseColor.inlineColors).trim()
    if (mapped !== raw) {
      literals.setValue(literal, mapped)
    }
  }

  return literals.apply()
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
  if (input.includes(" border ")) {
    input = input.replace(" border ", " border border-border ")
  }

  const classNames = input.split(" ")
  const lightMode = new Set<string>()
  const darkMode = new Set<string>()
  for (let className of classNames) {
    const [variant, value, modifier] = splitClassName(className)
    const prefix = PREFIXES.find((prefix) => value?.startsWith(prefix))
    if (!prefix) {
      lightMode.add(className)
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

    lightMode.add(className)
  }

  return [...Array.from(lightMode), ...Array.from(darkMode)].join(" ").trim()
}
