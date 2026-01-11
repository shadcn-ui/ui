"use client"

import { useParams } from "next/navigation"
import { TraceView } from "../components/trace-view"

export default function JournalTracePage() {
  const params = useParams()
  const id = (params?.id as string) || ""
  const subtitle = "Journal-centric trace that exposes upstream orders and downstream inventory links"

  return <TraceView resourceLabel="Journal" resourceId={id} apiPath={`/api/trace/journal/${encodeURIComponent(id)}`} subtitle={subtitle} />
}
