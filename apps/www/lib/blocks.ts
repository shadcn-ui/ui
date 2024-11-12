"use server"

import { Index } from "@/__registry__"
import { z } from "zod"

import { Style } from "@/registry/registry-styles"
import { registryEntrySchema } from "@/registry/schema"

const DEFAULT_BLOCKS_STYLE = "new-york" satisfies Style["name"]
const BLOCKS_WHITELIST_PREFIXES = ["sidebar", "login"]
const REGISTRY_BLOCK_TYPES = ["registry:block"]

export async function getAllBlockIds(
  style: Style["name"] = DEFAULT_BLOCKS_STYLE
) {
  const blocks = await _getAllBlocks(style)
  return blocks.map((block) => block.name)
}

async function _getAllBlocks(style: Style["name"] = DEFAULT_BLOCKS_STYLE) {
  const index = z.record(registryEntrySchema).parse(Index[style])

  return Object.values(index).filter((block) =>
    BLOCKS_WHITELIST_PREFIXES.some(
      (prefix) =>
        block.name.startsWith(prefix) &&
        REGISTRY_BLOCK_TYPES.includes(block.type)
    )
  )
}
