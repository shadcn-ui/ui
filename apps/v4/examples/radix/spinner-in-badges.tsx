import { Badge } from "@/examples/radix/ui/badge"
import { Spinner } from "@/examples/radix/ui/spinner"

export function SpinnerInBadges() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <Badge>
        <Spinner data-icon="inline-start" />
        Badge
      </Badge>
      <Badge variant="secondary">
        <Spinner data-icon="inline-start" />
        Badge
      </Badge>
      <Badge variant="destructive">
        <Spinner data-icon="inline-start" />
        Badge
      </Badge>
      <Badge variant="outline">
        <Spinner data-icon="inline-start" />
        Badge
      </Badge>
    </div>
  )
}
