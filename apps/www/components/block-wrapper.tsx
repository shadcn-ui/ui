"use client"

import * as React from "react"
import { AnimatePresence, motion } from "framer-motion"

import { useLiftMode } from "@/hooks/use-lift-mode"
import { Block } from "@/registry/schema"

export function BlockWrapper({
  block,
  children,
}: React.PropsWithChildren<{ block: Block }>) {
  const { isLiftMode } = useLiftMode(block.name)

  React.useEffect(() => {
    const components = document.querySelectorAll("[x-chunk]")
    block.chunks?.map((chunk, index) => {
      const $chunk = document.querySelector<HTMLElement>(
        `[x-chunk="${chunk.name}"]`
      )
      const $wrapper = document.querySelector<HTMLElement>(
        `[x-chunk-container="${chunk.name}"]`
      )

      const $component = components[index]

      if (!$chunk || !$component) {
        return
      }

      const position = $component.getBoundingClientRect()
      $chunk.style.zIndex = "40"
      // $chunk.style.position = "absolute"
      // $chunk.style.top = `${position.top}px`
      // $chunk.style.left = `${position.left}px`
      $chunk.style.width = `${position.width}px`
      $chunk.style.height = `${position.height}px`

      if ($wrapper) {
        $wrapper.style.zIndex = "40"
        $wrapper.style.position = "absolute"
        $wrapper.style.top = `${position.top}px`
        $wrapper.style.left = `${position.left}px`
        $wrapper.style.width = `${position.width}px`
        $wrapper.style.height = `${position.height}px`
      }
    })
  }, [block.chunks, isLiftMode])

  return (
    <>
      {children}
      <AnimatePresence>
        {isLiftMode && (
          <motion.div
            className="absolute inset-0 z-30 bg-background/90 fill-mode-backwards"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{
              opacity: 0,
              transition: { ease: "easeOut", duration: 0.38 },
            }}
            transition={{ ease: "easeOut", duration: 0.2, delay: 0.18 }}
          />
        )}
      </AnimatePresence>
    </>
  )
}
