"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { CodeBlockWrapper } from "@/components/code-block-wrapper"

export function ComponentSource({
  children,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  src: string
}) {
  return (
    <CodeBlockWrapper
      expandButtonTitle="Expand"
      className={cn("my-6 overflow-hidden rounded-md", className)}
      {...props}
    >
      {children}
    </CodeBlockWrapper>
  )
}
