import type { SearchParams } from "nuqs/server"

import { ConfigForm } from "@/app/(new)/components/config-form"
import { Preview } from "@/app/(new)/components/preview"

import {
  canvaSearchParamsCache,
  designSystemSearchParamsCache,
  styleSearchParamsCache,
} from "../lib/search-params"

export default async function NewPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  await Promise.all([
    designSystemSearchParamsCache.parse(searchParams),
    canvaSearchParamsCache.parse(searchParams),
    styleSearchParamsCache.parse(searchParams),
  ])

  return (
    <div className="flex h-svh flex-1">
      <div className="bg-background w-64 shrink-0 border-r p-6">
        <ConfigForm />
      </div>
      <Preview />
    </div>
  )
}
