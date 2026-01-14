import { Badge } from "@/examples/radix/ui/badge"
import { ArrowRightIcon } from "lucide-react"

export function BadgeWithIconRight() {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge>
        Default
        <ArrowRightIcon />
      </Badge>
      <Badge variant="secondary">
        Secondary
        <ArrowRightIcon />
      </Badge>
      <Badge variant="destructive">
        Destructive
        <ArrowRightIcon />
      </Badge>
      <Badge variant="outline">
        Outline
        <ArrowRightIcon />
      </Badge>
      <Badge variant="ghost">
        Ghost
        <ArrowRightIcon />
      </Badge>
      <Badge variant="link">
        Link
        <ArrowRightIcon />
      </Badge>
    </div>
  )
}
