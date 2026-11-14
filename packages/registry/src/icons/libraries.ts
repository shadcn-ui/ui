// @ts-expect-error validate-npm-package-name does not provide TypeScript declarations.
import validateNpmPackageName from "validate-npm-package-name"
export const iconLibraries = {
  lucide: {
    name: "lucide",
    title: "Lucide",
    packages: ["lucide-react"],
    import: "import { ICON } from 'lucide-react'",
    usage: "<ICON />",
    export: "lucide-react",
  },
  tabler: {
    name: "tabler",
    title: "Tabler Icons",
    packages: ["@tabler/icons-react"],
    import: "import { ICON } from '@tabler/icons-react'",
    usage: "<ICON />",
    export: "@tabler/icons-react",
  },
  hugeicons: {
    name: "hugeicons",
    title: "HugeIcons",
    packages: ["@hugeicons/react", "@hugeicons/core-free-icons"],
    import:
      "import { HugeiconsIcon } from '@hugeicons/react'\nimport { ICON } from '@hugeicons/core-free-icons';",
    usage: "<HugeiconsIcon icon={ICON} strokeWidth={2} />",
    export: "@hugeicons/core-free-icons",
  },
  phosphor: {
    name: "phosphor",
    title: "Phosphor Icons",
    packages: ["@phosphor-icons/react"],
    import: "import { ICON } from '@phosphor-icons/react'",
    usage: "<ICON strokeWidth={2} />",
    export: "@phosphor-icons/react",
  },
  remixicon: {
    name: "remixicon",
    title: "Remix Icon",
    packages: ["@remixicon/react"],
    import: "import { ICON } from '@remixicon/react'",
    usage: "<ICON />",
    export: "@remixicon/react",
  },
} as const

export type IconLibraries = typeof iconLibraries

export type IconLibrary = IconLibraries[keyof IconLibraries]

export type IconLibraryName = keyof IconLibraries


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
  if (Object.prototype.hasOwnProperty.call(iconLibraries, value)) {
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
