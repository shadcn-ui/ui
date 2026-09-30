import { handleError } from "@/src/utils/handle-error"
import { fetchRegistry } from "@shadcn/registry/internal/registry/fetcher"
import { logger } from "@shadcn/registry/internal/utils/logger"
import {
  iconsSchema,
  registryIndexSchema,
  registryItemSchema,
  stylesSchema,
} from "@shadcn/registry/schema"
import { z } from "zod"

// Registry API helpers that print the error and exit the process on failure.
// They live in the CLI rather than in @shadcn/registry because handleError is
// CLI behavior: it suggests the previous shadcn version on failure.

export async function getRegistryStyles() {
  try {
    const [result] = await fetchRegistry(["styles/index.json"])

    return stylesSchema.parse(result)
  } catch (error) {
    logger.error("\n")
    handleError(error)
    return []
  }
}

export async function getRegistryIcons() {
  try {
    const [result] = await fetchRegistry(["icons/index.json"])
    return iconsSchema.parse(result)
  } catch (error) {
    handleError(error)
    return {}
  }
}

/**
 * @deprecated This function is deprecated and will be removed in a future version.
 */
export async function fetchTree(
  style: string,
  tree: z.infer<typeof registryIndexSchema>
) {
  try {
    const paths = tree.map((item) => `styles/${style}/${item.name}.json`)
    const results = await fetchRegistry(paths)
    return results.map((result) => registryItemSchema.parse(result))
  } catch (error) {
    handleError(error)
    return []
  }
}
