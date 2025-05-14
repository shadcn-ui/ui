import Link from "next/link"

import { Badge } from "@/registry/new-york-v4/ui/badge"

export function Announcement() {
  return (
    <Badge asChild variant="outline" className="border-0">
      <Link href="/docs ">You are viewing the wip docs.</Link>
    </Badge>
  )
}
