import { ArrowUpRightIcon } from "@/examples/material-symbols"

import { Badge } from "@/styles/radix-force-ui/ui/badge"

export function BadgeAsLink() {
  return (
    <Badge asChild>
      <a href="#link">
        Open Link <ArrowUpRightIcon data-icon="inline-end" />
      </a>
    </Badge>
  )
}
