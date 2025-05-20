"use server"

import { registryItemSchema } from "shadcn/registry"
import { z } from "zod"

export async function getAllBlockIds(
  types: z.infer<typeof registryItemSchema>["type"][] = [
    "registry:block",
    "registry:internal",
  ],
  categories: string[] = []
): Promise<string[]> {
  const { Index } = await import("@/registry/__index__")
  const index = z.record(registryItemSchema).parse(Index)

  return Object.values(index)
    .filter(
      (block) =>
        types.includes(block.type) &&
        (categories.length === 0 ||
          block.categories?.some((category) =>
            categories.includes(category)
          )) &&
        !block.name.startsWith("chart-")
    )
    .map((block) => block.name)
}
