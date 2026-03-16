import type { Config } from "@/src/utils/get-config"
import { DEFAULT_COMPONENTS, DEFAULT_UTILS } from "@/src/utils/get-config"

export function getInitAliasDefaults(
  componentsAlias: string,
  existingAliases?: Config["aliases"]
) {
  // `lib` is the anchor for deriving `utils`, so reuse the existing value first
  // when init is re-running against the same components alias.
  const derivedLib =
    existingAliases?.lib ?? deriveAliasFromComponents(componentsAlias, "lib")

  return {
    ui: existingAliases?.ui ?? deriveAliasFromComponents(componentsAlias, "ui"),
    lib: derivedLib,
    hooks:
      existingAliases?.hooks ??
      deriveAliasFromComponents(componentsAlias, "hooks"),
    utils:
      existingAliases?.utils ??
      deriveAliasFromComponents(componentsAlias, "utils", derivedLib),
  }
}

export function deriveAliasFromComponents(
  componentsAlias: string,
  kind: "ui" | "lib" | "hooks" | "utils",
  libAlias?: string
) {
  const alias = componentsAlias || DEFAULT_COMPONENTS

  if (kind === "ui") {
    return `${alias}/ui`
  }

  if (kind === "utils") {
    // `utils` follows `lib`, not `components`, so derive or reuse the sibling
    // lib alias before appending `/utils`.
    const resolvedLib = libAlias || replaceComponentsAliasTail(alias, "lib")
    return resolvedLib ? `${resolvedLib}/utils` : DEFAULT_UTILS
  }

  return replaceComponentsAliasTail(alias, kind)
}

function replaceComponentsAliasTail(
  alias: string,
  kind: "lib" | "hooks"
) {
  // Handles the common `@/components` and `#custom/components` forms by
  // swapping the trailing `components` segment for a sibling alias root.
  if (alias === "components") {
    return kind
  }

  if (alias.endsWith("/components")) {
    return `${alias.slice(0, -"/components".length)}/${kind}`
  }

  if (alias.endsWith("components") && !alias.includes("/")) {
    return `${alias.slice(0, -"components".length)}${kind}`
  }

  return ""
}
