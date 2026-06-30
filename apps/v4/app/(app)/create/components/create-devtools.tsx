"use client"

import * as React from "react"

import { BASES } from "@/registry/config"
import { Button } from "@/registry/new-york-v4/ui/button"
import { getDocsPathForItem } from "@/app/(app)/create/lib/devtools"
import {
  serializeDesignSystemSearchParams,
  useDesignSystemSearchParams,
} from "@/app/(app)/create/lib/search-params"

export function CreateDevtools() {
  const [params, setParams] = useDesignSystemSearchParams()

  const previewUrl = React.useMemo(
    () =>
      serializeDesignSystemSearchParams(
        `/preview/${params.base}/${params.item}`,
        params
      ),
    [params]
  )

  const docsUrl = React.useMemo(
    () => getDocsPathForItem(params.base, params.item),
    [params.base, params.item]
  )

  if (process.env.NODE_ENV === "production") {
    return null
  }

  return (
    <div className="dark absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 items-center gap-0.5 rounded-xl bg-card/90 p-1 shadow-xl backdrop-blur-xl">
      {BASES.map((base) => (
        <Button
          key={base.name}
          variant="ghost"
          size="sm"
          data-active={params.base === base.name}
          className="h-7 min-w-8 cursor-pointer rounded-lg px-2.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground data-[active=true]:bg-accent data-[active=true]:text-accent-foreground"
          onClick={() => setParams({ base: base.name })}
        >
          {base.name === "radix" ? "Radix" : "Base"}
        </Button>
      ))}
      <div className="mx-0.5 h-4 w-px bg-border/80" />
      <Button
        asChild
        variant="ghost"
        size="sm"
        className="h-7 rounded-lg px-2.5 text-xs font-medium text-muted-foreground hover:text-foreground"
      >
        <a href={previewUrl} target="_blank" rel="noreferrer">
          Open in New Tab
        </a>
      </Button>
      <div className="mx-0.5 h-4 w-px bg-border/80" />
      <Button
        asChild
        variant="ghost"
        size="sm"
        className="h-7 rounded-lg px-2.5 text-xs font-medium text-muted-foreground hover:text-foreground"
      >
        <a href={docsUrl} target="_blank" rel="noreferrer">
          Open Docs
        </a>
      </Button>
    </div>
  )
}
