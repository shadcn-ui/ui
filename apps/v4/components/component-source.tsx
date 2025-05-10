import * as React from "react"

import { highlightCode } from "@/lib/highlight-code"
import { getRegistryItem } from "@/lib/registry"
import { cn } from "@/lib/utils"
import { CodeCollapsibleWrapper } from "@/components/code-collapsible-wrapper"
import { CopyButton } from "@/components/copy-button"

export async function ComponentSource({
  name,
  src,
  collapsible = true,
  className,
}: React.ComponentProps<"div"> & {
  name?: string
  src?: string
  collapsible?: boolean
}) {
  if (!name && !src) {
    return null
  }

  let code: string | undefined

  if (name) {
    const item = await getRegistryItem(name)
    code = item?.files?.[0]?.content
  } else if (src) {
    code = src
  }

  if (!code) {
    return null
  }

  const highlightedCode = await highlightCode(code)

  if (!collapsible) {
    return (
      <div className={cn("relative", className)}>
        <figure
          data-rehype-pretty-code-figure=""
          dangerouslySetInnerHTML={{ __html: highlightedCode }}
          className="[&>pre]:max-h-96"
        />
        <CopyButton value={code} />
      </div>
    )
  }

  return (
    <CodeCollapsibleWrapper className={className}>
      <figure
        data-rehype-pretty-code-figure=""
        dangerouslySetInnerHTML={{ __html: highlightedCode }}
      />
      <CopyButton value={code} />
    </CodeCollapsibleWrapper>
  )
}
