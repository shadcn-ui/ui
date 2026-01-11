"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/new-york-v4/ui/card"
import { Input } from "@/registry/new-york-v4/ui/input"
import { Button } from "@/registry/new-york-v4/ui/button"
import { Badge } from "@/registry/new-york-v4/ui/badge"
import { Separator } from "@/registry/new-york-v4/ui/separator"
import { GitBranch, Search } from "lucide-react"

export default function TraceLandingPage() {
  const router = useRouter()
  const [orderId, setOrderId] = useState("")
  const [eventId, setEventId] = useState("")
  const [journalId, setJournalId] = useState("")

  const go = (path: string) => (value: string) => {
    if (!value) return
    router.push(`/erp/trace/${path}/${encodeURIComponent(value)}`)
  }

  return (
    <div className="space-y-6 p-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Transaction Trace</h1>
          <p className="text-muted-foreground">Follow Anchor events from orders to journals, payments, and returns</p>
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <Badge variant="outline" className="gap-1">
              <GitBranch className="h-4 w-4" />
              Read-only lineage
            </Badge>
            <Badge variant="secondary">Source IDs only</Badge>
          </div>
        </div>
      </div>

      <Card className="border-none bg-gradient-to-br from-background to-muted/40 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-primary" />
            Start a trace
          </CardTitle>
          <CardDescription>Jump into an order, Anchor event, or journal-centered trace</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2 rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">Order</span>
              <Badge variant="secondary">Order ID / number</Badge>
            </div>
            <Input value={orderId} onChange={(e) => setOrderId(e.target.value)} placeholder="SO-1001 or UUID" />
            <Button className="w-full" onClick={() => go("order")(orderId)}>Trace Order</Button>
          </div>
          <div className="space-y-2 rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">Anchor Event</span>
              <Badge variant="secondary">event_id</Badge>
            </div>
            <Input value={eventId} onChange={(e) => setEventId(e.target.value)} placeholder="event UUID" />
            <Button className="w-full" onClick={() => go("event")(eventId)}>Trace Event</Button>
          </div>
          <div className="space-y-2 rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">Journal</span>
              <Badge variant="secondary">ID or entry #</Badge>
            </div>
            <Input value={journalId} onChange={(e) => setJournalId(e.target.value)} placeholder="UUID or JE-..." />
            <Button className="w-full" onClick={() => go("journal")(journalId)}>Trace Journal</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>How trace connects your data</CardTitle>
          <CardDescription>source_event_id and reference_number drive the lineage graph</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2 text-foreground">
            <Badge variant="outline">1</Badge>
            Orders attach Anchor event ids at creation.
          </div>
          <Separator />
          <div className="flex items-center gap-2 text-foreground">
            <Badge variant="outline">2</Badge>
            Inventory moves (ship/return) carry the same source_event_id and reference_number.
          </div>
          <Separator />
          <div className="flex items-center gap-2 text-foreground">
            <Badge variant="outline">3</Badge>
            Journals, receipts, and refunds post with source_event_id and order reference, making downstream impact auditable.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
