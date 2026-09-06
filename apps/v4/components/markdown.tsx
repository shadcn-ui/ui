"use client"

import * as React from "react"
import { code } from "@streamdown/code"
import { cn } from "cn"
import { Streamdown } from "streamdown"

const DEFAULT_PLUGINS = { code }

function Markdown({
  className,
  plugins = DEFAULT_PLUGINS,
  controls = false,
  ...props
}: React.ComponentProps<typeof Streamdown>) {
  return (
    <Streamdown
      data-slot="markdown"
      plugins={plugins}
      controls={controls}
      className={cn("cn-markdown w-full min-w-0 overflow-hidden", className)}
      {...props}
    />
  )
}

export { Markdown }
