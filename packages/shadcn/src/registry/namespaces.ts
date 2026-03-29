import { BUILTIN_REGISTRIES } from "@/src/registry/constants"
import { RegistryNotConfiguredError } from "@/src/registry/errors"
import { parseRegistryAndItemFromString } from "@/src/registry/parser"
import { fetchRegistryItems } from "@/src/registry/resolver"
import { Config } from "@/src/utils/get-config"

// Recursively discovers all registry namespaces including nested ones.
export async function resolveRegistryNamespaces(
  components: string[],
  config: Config
) {
  const discoveredNamespaces = new Set<string>()
  const visitedItems = new Set<string>()
  const itemsToProcess = [...components]

  while (itemsToProcess.length > 0) {
    const currentItem = itemsToProcess.shift()!

    if (visitedItems.has(currentItem)) {
      continue
    }
    visitedItems.add(currentItem)

    const { registry } = parseRegistryAndItemFromString(currentItem)
    if (registry && !BUILTIN_REGISTRIES[registry]) {
      discoveredNamespaces.add(registry)
    }

    try {
      const [item] = await fetchRegistryItems([currentItem], config, {
        useCache: true,
      })

      if (item?.registryDependencies) {
        for (const dep of item.registryDependencies) {
          const { registry: depRegistry } = parseRegistryAndItemFromString(dep)
          if (depRegistry && !BUILTIN_REGISTRIES[depRegistry]) {
            discoveredNamespaces.add(depRegistry)
          }

          if (!visitedItems.has(dep)) {
            itemsToProcess.push(dep)
          }
        }
      }
    } catch (error) {
      // If a registry is not configured, we still track it.
      if (error instanceof RegistryNotConfiguredError) {
        const { registry } = parseRegistryAndItemFromString(currentItem)
        if (registry && !BUILTIN_REGISTRIES[registry]) {
          discoveredNamespaces.add(registry)
        }
        continue
      }

      // For other errors (network, parsing, etc.), we skip this item
      // but continue processing others to discover as many namespaces as possible.
      continue
    }
  }

  return Array.from(discoveredNamespaces)
}
