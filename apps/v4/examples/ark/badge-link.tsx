import { Badge } from "@/styles/ark-nova/ui/badge"
import { ArrowUpRightIcon } from "lucide-react"

export function BadgeAsLink() {
  return (
    <Badge asChild>
      <a href="#link">
        Open Link <ArrowUpRightIcon data-icon="inline-end" />
      </a>
    </Badge>
  )
}
