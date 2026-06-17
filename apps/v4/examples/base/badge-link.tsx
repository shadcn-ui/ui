import { ArrowUpRightIcon } from "lucide-react"

import { Badge } from "@/styles/base-force-ui/ui/badge"

export function BadgeAsLink() {
  return (
    <Badge render={<a href="#link" />}>
      Open Link <ArrowUpRightIcon data-icon="inline-end" />
    </Badge>
  )
}
