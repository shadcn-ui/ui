"use client"

import { useParams } from "next/navigation"
import { TraceView } from "../components/trace-view"

export default function OrderTracePage() {
  const params = useParams()
  const id = (params?.id as string) || ""
  const subtitle = "End-to-end lineage for a sales order and its Anchor-driven artifacts"

  return <TraceView resourceLabel="Order" resourceId={id} apiPath={`/api/trace/order/${encodeURIComponent(id)}`} subtitle={subtitle} />
}
