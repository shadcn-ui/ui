"use client"

import * as React from "react"

import { Block } from "@/registry/schema"

export function BlockWrapper({
  block,
  ...props
}: { block: Block } & JSX.IntrinsicElements["div"]) {
  React.useEffect(() => {
    const components = document.querySelectorAll("[x-data-component]")
    block.chunks?.map((chunk, index) => {
      const $chunk = document.querySelector(`[x-data-chunk="${chunk.name}"]`)
      const $component = components[index]

      if (!$chunk || !$component) {
        return
      }

      // Find the position of the component in the DOM.
      const position = $component.getBoundingClientRect()

      // Set the position of the chunk.
      $chunk.style.position = "absolute"
      $chunk.style.top = `${position.top}px`
      $chunk.style.left = `${position.left}px`
      $chunk.style.width = `${position.width}px`
      $chunk.style.height = `${position.height}px`
    })
  }, [block.chunks])

  return <div className="bg-red-100" {...props} />
}
