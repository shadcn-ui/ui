import { Badge } from "@/examples/base/ui/badge"
import { ArrowUpRightIcon } from "lucide-react"

export function BadgeAsLink() {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge
        render={
          <a href="#">
            Link <ArrowUpRightIcon />
          </a>
        }
      />
      <Badge
        variant="secondary"
        render={
          <a href="#">
            Link <ArrowUpRightIcon />
          </a>
        }
      />
      <Badge
        variant="destructive"
        render={
          <a href="#">
            Link <ArrowUpRightIcon />
          </a>
        }
      />
      <Badge
        variant="ghost"
        render={
          <a href="#">
            Link <ArrowUpRightIcon />
          </a>
        }
      />
    </div>
  )
}
