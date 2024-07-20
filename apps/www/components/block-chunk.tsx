"use client"

import * as React from "react"
import { AnimatePresence, motion } from "framer-motion"

import { cn } from "@/lib/utils"
import { useLiftMode } from "@/hooks/use-lift-mode"
import { BlockCopyButton } from "@/components/block-copy-button"
import { V0Button } from "@/components/v0-button"
import { Block, type BlockChunk } from "@/registry/schema"

export function BlockChunk({
  block,
  chunk,
  children,
  ...props
}: React.PropsWithChildren<{ block: Block; chunk?: BlockChunk }>) {
  const { isLiftMode } = useLiftMode(block.name)

  if (!chunk) {
    return null
  }

  return (
    <AnimatePresence>
      {isLiftMode && (
        <motion.div
          key={chunk.name}
          x-chunk-container={chunk.name}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { ease: "easeOut", duration: 0.2 } }}
          transition={{ ease: "easeIn", duration: 0.2 }}
          className={cn(
            "group rounded-xl bg-background shadow-xl transition",
            chunk.container?.className
          )}
          {...props}
        >
          <div className="relative z-30">{children}</div>
          {chunk.code && (
            <div className="absolute inset-x-0 top-0 z-30 flex px-4 py-3 opacity-0 transition-all duration-200 ease-in group-hover:-translate-y-12 group-hover:opacity-100">
              <div className="flex w-full items-center justify-end gap-2">
                <BlockCopyButton
                  event="copy_chunk_code"
                  name={chunk.name}
                  code={chunk.code}
                />
                <V0Button
                  size="icon"
                  block={{
                    name: chunk.name,
                    description: chunk.description || "",
                    code: chunk.code,
                    style: block.style,
                  }}
                />
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
