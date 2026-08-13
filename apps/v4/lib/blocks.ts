"use server"

import { registryItemSchema, registrySchema } from "shadcn/schema"
import { type z } from "zod"

import { registry as baseRegistry } from "@/registry/bases/base/registry"
import { registry as radixRegistry } from "@/registry/bases/radix/registry"

export async function getAllBlockIds(
  types: z.infer<typeof registryItemSchema>["type"][] = [
    "registry:block",
    "registry:internal",
  ],
  categories: string[] = []
): Promise<string[]> {
  const blocks = await getAllBlocks(types, categories)

  return blocks.map((block) => block.name)
}

export async function getAllBlocks(
  types: z.infer<typeof registryItemSchema>["type"][] = [
    "registry:block",
    "registry:internal",
  ],
  categories: string[] = []
) {
  const { Index: StylesIndex } = await import("@/registry/__index__")

  const allBlocks = new Map<string, z.infer<typeof registryItemSchema>>()

  const baseRegistries = [baseRegistry, radixRegistry]
    .map((registry) => registrySchema.safeParse(registry))
    .filter((result) => result.success)
    .map((result) => result.data)

  for (const registry of baseRegistries) {
    for (const item of registry.items) {
      allBlocks.set(`${item.type}:${item.name}`, item)
    }
  }

  for (const style in StylesIndex) {
    const styleIndex = StylesIndex[style]
    if (typeof styleIndex !== "object" || styleIndex === null) {
      continue
    }

    for (const itemName in styleIndex) {
      const item = styleIndex[itemName]
      allBlocks.set(`${item.type}:${item.name}`, item)
    }
  }

  // Validate each block.
  const validatedBlocks = Array.from(allBlocks.values())
    .map((block) => {
      const result = registryItemSchema.safeParse(block)
      return result.success ? result.data : null
    })
    .filter(
      (block): block is z.infer<typeof registryItemSchema> => block !== null
    )

  return validatedBlocks.filter(
    (block) =>
      types.includes(block.type) &&
      (categories.length === 0 ||
        block.categories?.some((category) => categories.includes(category))) &&
      !block.name.startsWith("chart-")
  )
}
