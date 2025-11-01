import type { SearchParams } from "nuqs/server"

import { ConfigForm } from "@/app/(new)/components/config-form"
import { Preview } from "@/app/(new)/components/preview"

import { designSystemSearchParamsCache } from "../lib/search-params"

export default async function NewPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  await designSystemSearchParamsCache.parse(searchParams)

  return (
    <div className="flex h-svh flex-1">
      <div className="w-64 border-r p-4">
        <ConfigForm />
      </div>
      <Preview />
    </div>
  )
}
