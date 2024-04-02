"use client"

import * as React from "react"
import { motion } from "framer-motion"

import { useChunkMode } from "@/hooks/use-chunk-mode"
import { Block } from "@/registry/schema"

export function BlockComponent({
  block,
  children,
}: React.PropsWithChildren<{ block: Block }>) {
  const { chunkMode } = useChunkMode()
  // const showChunks = chunkMode.includes(block.name)

  return <>{children}</>
}
