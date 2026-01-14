import { Badge } from "@/examples/base/ui/badge"
import { Spinner } from "@/examples/base/ui/spinner"

export function BadgeWithSpinner() {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge>
        <Spinner data-icon="inline-start" />
        Default
      </Badge>
      <Badge variant="secondary">
        <Spinner data-icon="inline-start" />
        Secondary
      </Badge>
      <Badge variant="destructive">
        <Spinner data-icon="inline-start" />
        Destructive
      </Badge>
      <Badge variant="outline">
        <Spinner data-icon="inline-start" />
        Outline
      </Badge>
      <Badge variant="ghost">
        <Spinner data-icon="inline-start" />
        Ghost
      </Badge>
      <Badge variant="link">
        <Spinner data-icon="inline-start" />
        Link
      </Badge>
    </div>
  )
}
