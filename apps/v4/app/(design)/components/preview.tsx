"use client"

import { useQueryStates } from "nuqs"

import { designSystemSearchParams } from "@/app/(design)/lib/search-params"
import type { DesignSystemStyle } from "@/app/(design)/lib/style"

export function Preview({ style }: { style: DesignSystemStyle["name"] }) {
  const [params] = useQueryStates(designSystemSearchParams, {
    shallow: false,
  })

  if (!params.item) {
    return null
  }

  const iframeSrc = `/design/${style}/${params.item}?iconLibrary=${params.iconLibrary}`

  return (
    <div className="bg-background flex h-full w-full flex-1 flex-col overflow-hidden border">
      <iframe
        src={iframeSrc}
        width="100%"
        height="100%"
        className="flex-1 border-0"
      />
    </div>
  )
}
