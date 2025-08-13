import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

import { Badge } from "@/registry/new-york-v4/ui/badge"

export function Announcement() {
  return (
    <Badge asChild variant="secondary" className="rounded-full">
      <Link href="/docs/registry/namespace">
        Introducing Namespaced Registries <ArrowRightIcon />
      </Link>
    </Badge>
  )
}
