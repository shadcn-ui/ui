import type { Identifier } from "ts-morph"

export const OLD_PACKAGES = ["clsx", "tailwind-merge", "cnfast"] as const

export const TAILWIND_ROOT_EXPORTS = new Set([
  "twMerge",
  "twJoin",
  "ClassNameValue",
])

export const TAILWIND_CONFIG_EXPORTS = new Map([
  ["extendTailwindMerge", "extendTailwindMerge"],
  ["createTailwindMerge", "createTwMerge"],
  ["getDefaultConfig", "defaultConfig"],
  ["fromTheme", "fromTheme"],
  ["validators", "validators"],
  ["mergeConfigs", "mergeConfigs"],
  ["ConfigExtension", "ConfigExtension"],
  ["DefaultClassGroupIds", "DefaultClassGroupIds"],
  ["DefaultThemeGroupIds", "DefaultThemeGroupIds"],
])

export type OldPackage = (typeof OLD_PACKAGES)[number]
export type OldModule = Exclude<OldPackage, "cnfast"> | "clsx/lite"
export type CnModule = "cn" | "cn/config" | "cn/lite"

export type CnMigrationIssue = {
  file?: string
  packageName: OldPackage
  symbol?: string
  reason: string
}

export type CnSourceTransformResult = {
  content: string
  changes: number
  migratedPackages: OldPackage[]
  remainingPackages: OldPackage[]
  unsupported: CnMigrationIssue[]
}

export type Binding = {
  identifier: Identifier
  localName: string
  importedName: string
  module: OldModule
  kind: "esm" | "cjs"
}

export type PendingImport = {
  moduleSpecifier: CnModule
  importedName: string
  localName: string
  isTypeOnly: boolean
}

export type SourceRegion = {
  start: number
  end: number
  filename: string
}
