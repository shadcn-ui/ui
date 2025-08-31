import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

import { Badge } from "@/registry/new-york-v4/ui/badge"

export function Announcement() {
  return (
    <Badge asChild variant="secondary" className="rounded-full">
      <Link href="/docs/changelog">
        Now available: shadcn CLI 3.0 and MCP Server <ArrowRightIcon />
      </Link>
    </Badge>
  )
}
