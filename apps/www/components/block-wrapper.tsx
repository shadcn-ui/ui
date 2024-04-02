"use client"

import * as React from "react"
import { AnimatePresence, motion } from "framer-motion"

import { useChunkMode } from "@/hooks/use-chunk-mode"
import { Block } from "@/registry/schema"

export function BlockWrapper({
  block,
  children,
}: React.PropsWithChildren<{ block: Block }>) {
  const { chunkMode } = useChunkMode()

  const showChunks = chunkMode.includes(block.name)

  React.useEffect(() => {
    const components = document.querySelectorAll("[x-data-component]")
    block.chunks?.map((chunk, index) => {
      const $chunk = document.querySelector<HTMLElement>(
        `[x-data-chunk="${chunk.name}"]`
      )
      const $toolbar = document.querySelector<HTMLElement>(
        `[x-data-chunk-toolbar="${chunk.name}"]`
      )

      const $component = components[index]

      if (!$chunk || !$component || !$toolbar) {
        return
      }

      const position = $component.getBoundingClientRect()
      $chunk.style.zIndex = "9999"
      $chunk.style.position = "absolute"
      $chunk.style.top = `${position.top}px`
      $chunk.style.left = `${position.left}px`
      $chunk.style.width = `${position.width}px`
      $chunk.style.height = `${position.height}px`

      $toolbar.style.zIndex = "999999"
      $toolbar.style.position = "absolute"
      $toolbar.style.top = `${position.top - 40}px`
      $toolbar.style.left = `${position.left + position.width - 80}px`
    })
  }, [block.chunks, showChunks])

  return (
    <AnimatePresence>
      {children}
      {showChunks && (
        <motion.div
          className="absolute inset-0 z-30 bg-white/90"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ ease: "easeIn", duration: 0.1, delay: 0.18 }}
        />
      )}
    </AnimatePresence>
  )
}
