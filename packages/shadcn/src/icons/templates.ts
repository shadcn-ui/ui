// Helpers for parsing icon library `import` and `usage` templates, e.g.
//   import: "import { HugeiconsIcon } from '@hugeicons/react'\nimport { ICON } from '@hugeicons/core-free-icons';"
//   usage:  "<HugeiconsIcon icon={ICON} strokeWidth={2} />"
// ICON is the placeholder substituted with actual icon names.

// Anchored and free of overlapping quantifiers to avoid backtracking blowups.
const IMPORT_REGEX = /^import\s+{([^}]+)}\s+from\s+['"]([^'"]+)['"]/

export interface ParsedImport {
  moduleSpecifier: string
  namedImports: string[]
}

export interface ParsedUsage {
  // The JSX tag icons render as. "ICON" means the icon itself is the tag
  // (e.g. lucide); anything else is a wrapper component (e.g. HugeiconsIcon).
  componentName: string
  // Attribute carrying the icon when componentName is a wrapper (e.g. "icon").
  iconAttribute?: string
  // Remaining default attributes from the template, e.g. { strokeWidth: "{2}" }.
  attributes: Record<string, string>
}

export function parseImportTemplate(template: string): ParsedImport[] {
  const imports: ParsedImport[] = []

  for (const line of template.split("\n")) {
    const match = line.trim().match(IMPORT_REGEX)

    if (!match) {
      continue
    }

    imports.push({
      moduleSpecifier: match[2],
      namedImports: match[1].split(",").map((name) => name.trim()),
    })
  }

  return imports
}

// The module specifier icons (ICON) are imported from.
export function getIconModuleSpecifier(template: string) {
  return parseImportTemplate(template).find((parsed) =>
    parsed.namedImports.includes("ICON")
  )?.moduleSpecifier
}

// The usage template is parsed with a hand-rolled scanner instead of
// regexes: these helpers are part of the public API, so parsing must stay
// linear on arbitrary input (no backtracking).
export function parseUsageTemplate(usage: string): ParsedUsage {
  const start = usage.indexOf("<")
  const end = usage.indexOf("/>", start)

  if (start === -1 || end === -1) {
    return { componentName: "ICON", attributes: {} }
  }

  const inner = usage.slice(start + 1, end).trim()
  const nameEnd = inner.search(/[^\w]/)
  const componentName = nameEnd === -1 ? inner : inner.slice(0, nameEnd)
  const rawAttributes = nameEnd === -1 ? "" : inner.slice(nameEnd)

  if (!componentName) {
    return { componentName: "ICON", attributes: {} }
  }

  const attributes: Record<string, string> = {}
  let iconAttribute: string | undefined

  for (const [name, value] of parseAttributeTokens(rawAttributes)) {
    if (value === "{ICON}") {
      iconAttribute = name
      continue
    }

    attributes[name] = value
  }

  return { componentName, iconAttribute, attributes }
}

const NAME_CHAR = /[\w-]/

// Tokenizes `name={value}` / `name="value"` / `name='value'` pairs in a
// single linear pass.
function parseAttributeTokens(raw: string): Array<[string, string]> {
  const tokens: Array<[string, string]> = []
  let index = 0

  while (index < raw.length) {
    if (!NAME_CHAR.test(raw[index])) {
      index++
      continue
    }

    const nameStart = index
    while (index < raw.length && NAME_CHAR.test(raw[index])) {
      index++
    }
    const name = raw.slice(nameStart, index)

    if (raw[index] !== "=") {
      continue
    }

    index++
    const open = raw[index]
    const close = open === "{" ? "}" : open === '"' || open === "'" ? open : ""

    if (!close) {
      continue
    }

    const closeIndex = raw.indexOf(close, index + 1)

    if (closeIndex === -1) {
      break
    }

    tokens.push([name, raw.slice(index, closeIndex + 1)])
    index = closeIndex + 1
  }

  return tokens
}
