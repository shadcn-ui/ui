import validateNpmPackageName from "validate-npm-package-name"

import { iconLibraries } from "./libraries"
import type { IconLibrary, IconLibraryName } from "./libraries"

export type ResolvedIconLibrary =
  | {
      type: "builtin"
      name: IconLibraryName
      config: IconLibrary
    }
  | {
      type: "legacy"
    }
  | {
      type: "custom"
      importPath: string
      packageName: string
    }
  | {
      type: "invalid"
    }

/**
 * Resolves a configured icon library into a built-in library,
 * a legacy library, or a custom package import path.
 */
export function resolveIconLibrary(
  value: string | undefined
): ResolvedIconLibrary {
  if (!value) {
    return { type: "invalid" }
  }

  // Preserve the existing built-in libraries.
  if (Object.hasOwn(iconLibraries, value)) {
    const name = value as IconLibraryName

    return {
      type: "builtin",
      name,
      config: iconLibraries[name],
    }
  }

  // Preserve the legacy Radix behavior.
  if (value === "radix") {
    return { type: "legacy" }
  }

  const packageName = getPackageName(value)

  if (!packageName) {
    return { type: "invalid" }
  }

  const validation = validateNpmPackageName(packageName)

  if (!validation.validForNewPackages) {
    return { type: "invalid" }
  }

  return {
    type: "custom",
    importPath: value,
    packageName,
  }
}

/**
 * Extracts the package root from an npm package import path.
 *
 * Examples:
 *   lucide-react                  -> lucide-react
 *   @solar-icons/react/shadcn     -> @solar-icons/react
 */
function getPackageName(importPath: string): string | undefined {
  // Reject URLs, relative paths, absolute paths, and whitespace.
  if (
    !importPath ||
    /[\s\\?#]/.test(importPath) ||
    importPath.startsWith(".") ||
    importPath.startsWith("/") ||
    /^[a-z][a-z\d+.-]*:/i.test(importPath)
  ) {
    return undefined
  }

  const segments = importPath.split("/")

  if (
    segments.some(
      (segment) => !segment || segment === "." || segment === ".."
    )
  ) {
    return undefined
  }

  if (importPath.startsWith("@")) {
    if (segments.length < 2) {
      return undefined
    }

    return `${segments[0]}/${segments[1]}`
  }

  return segments[0]
}
