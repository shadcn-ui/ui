"use server"

import { registryItemSchema } from "shadcn/registry"
import { z } from "zod"

export async function getAllBlockIds(): Promise<string[]> {
  const { Index } = await import("@/__registry__")
  const index = z.record(registryItemSchema).parse(Index)

  return Object.values(index).map((block) => block.name)
}
