import { Badge } from "@/examples/radix/ui/badge"
import { ArrowUpRightIcon } from "lucide-react"

export function BadgeAsLink() {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge asChild>
        <a href="#">
          Link <ArrowUpRightIcon />
        </a>
      </Badge>
      <Badge asChild variant="secondary">
        <a href="#">
          Link <ArrowUpRightIcon />
        </a>
      </Badge>
      <Badge asChild variant="destructive">
        <a href="#">
          Link <ArrowUpRightIcon />
        </a>
      </Badge>
      <Badge asChild variant="outline">
        <a href="#">
          Link <ArrowUpRightIcon />
        </a>
      </Badge>
      <Badge asChild variant="ghost">
        <a href="#">
          Link <ArrowUpRightIcon />
        </a>
      </Badge>
      <Badge asChild variant="link">
        <a href="#">
          Link <ArrowUpRightIcon />
        </a>
      </Badge>
    </div>
  )
}
