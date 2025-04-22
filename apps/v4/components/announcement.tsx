import Link from "next/link"

import { Badge } from "@/registry/new-york-v4/ui/badge"

export function Announcement() {
  return (
    <Badge asChild variant="secondary">
      <Link href="/docs/tailwind-v4">You are viewing the wip docs.</Link>
    </Badge>
  )
}
