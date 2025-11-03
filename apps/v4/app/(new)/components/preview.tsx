"use client"

import { useQueryStates } from "nuqs"

import { designSystemSearchParams } from "@/app/(new)/lib/search-params"
import type { DesignSystemStyle } from "@/app/(new)/lib/style"

export function Preview({ style }: { style: DesignSystemStyle["name"] }) {
  const [params] = useQueryStates(designSystemSearchParams, {
    shallow: false,
  })

  if (!params.item) {
    return null
  }

  const iframeSrc = `/new/${style}/${params.item}?iconLibrary=${params.iconLibrary}`

  return (
    <div className="bg-background flex h-full w-full max-w-[80vw] flex-1 flex-col overflow-hidden rounded-lg border">
      <iframe
        src={iframeSrc}
        width="100%"
        height="100%"
        className="flex-1 border-0"
      />
    </div>
  )
}
