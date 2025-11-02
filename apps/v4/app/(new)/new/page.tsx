import type { SearchParams } from "nuqs/server"

import { ConfigForm } from "@/app/(new)/components/config-form"
import { Preview } from "@/app/(new)/components/preview"

import {
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
    styleSearchParamsCache.parse(searchParams),
  ])

  return (
    <div className="flex h-svh flex-1">
      <div className="bg-background w-64 p-6">
        <ConfigForm />
      </div>
      <Preview />
    </div>
  )
}
