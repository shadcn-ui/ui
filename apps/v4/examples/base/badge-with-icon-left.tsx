import { Badge } from "@/examples/base/ui/badge"
import { BadgeCheck } from "lucide-react"

export function BadgeWithIconLeft() {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge>
        <BadgeCheck />
        Default
      </Badge>
      <Badge variant="secondary">
        <BadgeCheck />
        Secondary
      </Badge>
      <Badge variant="destructive">
        <BadgeCheck />
        Destructive
      </Badge>
      <Badge variant="outline">
        <BadgeCheck />
        Outline
      </Badge>
      <Badge variant="ghost">
        <BadgeCheck />
        Ghost
      </Badge>
      <Badge variant="link">
        <BadgeCheck />
        Link
      </Badge>
    </div>
  )
}
