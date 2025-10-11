import type { RegistryItem } from "@/src/registry/schema"

// This is a bit tricky to accurately determine.
// For now we'll use the module specifier to determine the type.
const determineFileType = (moduleSpecifier: string): RegistryItem["type"] => {
  if (moduleSpecifier.includes("/ui/")) {
    return "registry:ui"
  }

  if (moduleSpecifier.includes("/lib/")) {
    return "registry:lib"
  }

  if (moduleSpecifier.includes("/hooks/")) {
    return "registry:hook"
  }

  if (moduleSpecifier.includes("/components/")) {
    return "registry:component"
  }

  return "registry:component"
}

export { determineFileType }
