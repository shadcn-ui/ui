import { Badge } from "@/examples/radix/ui/badge"

export function BadgeLongText() {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge variant="secondary">
        A badge with a lot of text to see how it wraps
      </Badge>
    </div>
  )
}
