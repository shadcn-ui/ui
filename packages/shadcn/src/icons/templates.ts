// Helpers for parsing icon library `import` and `usage` templates, e.g.
//   import: "import { HugeiconsIcon } from '@hugeicons/react'\nimport { ICON } from '@hugeicons/core-free-icons';"
//   usage:  "<HugeiconsIcon icon={ICON} strokeWidth={2} />"
// ICON is the placeholder substituted with actual icon names.

// Anchored and free of overlapping quantifiers to avoid backtracking blowups.
const IMPORT_REGEX = /^import\s+{([^}]+)}\s+from\s+['"]([^'"]+)['"]/
const USAGE_REGEX = /<(\w+)([^>]*)\/>/
const ATTRIBUTE_REGEX = /([\w-]+)=({[^}]*}|"[^"]*"|'[^']*')/g

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

export function parseUsageTemplate(usage: string): ParsedUsage {
  const match = usage.match(USAGE_REGEX)

  if (!match) {
    return { componentName: "ICON", attributes: {} }
  }

  const [, componentName, rawAttributes] = match
  const attributes: Record<string, string> = {}
  let iconAttribute: string | undefined

  for (const attributeMatch of Array.from(
    rawAttributes.matchAll(ATTRIBUTE_REGEX)
  )) {
    const [, name, value] = attributeMatch

    if (value === "{ICON}") {
      iconAttribute = name
      continue
    }

    attributes[name] = value
  }

  return { componentName, iconAttribute, attributes }
}
