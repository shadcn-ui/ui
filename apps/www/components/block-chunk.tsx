"use client"

import * as React from "react"
import { motion } from "framer-motion"

import { useChunkMode } from "@/hooks/use-chunk-mode"
import { Block, BlockChunk } from "@/registry/schema"
import { cn } from "@/lib/utils"

export function BlockChunk({
  block,
  chunk,
  children,
}: React.PropsWithChildren<{ block: Block, chunk?: BlockChunk }>) {
  const { chunkMode } = useChunkMode()
  const showChunk = chunkMode.includes(block.name)

  if (!chunk || !showChunk) {
    return null
  }

  return (
    <motion.div
      x-data-chunk-wrapper={chunk.name}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1}}
      exit={{ opacity: 0 }}
      transition={{ ease: 'easeIn', duration: 0.2}}
      className={cn('[&_[x-data-chunk]]:shadow-2xl [&_[x-data-chunk]]:transition-all [&_[x-data-chunk]]:hover:scale-[1.01]')}
      style={{
      } as React.CSSProperties}
    >
      {children}
    </motion.div>
  )
}
