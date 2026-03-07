import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

import { Badge } from "@/registry/new-york-v4/ui/badge"

export function Announcement() {
  return (
    <Badge asChild variant="secondary" className="bg-muted">
      <Link href="/docs/changelog/2026-03-cli-v4">
        shadcn/skills, presets and more <ArrowRightIcon />
      </Link>
    </Badge>
  )
}
