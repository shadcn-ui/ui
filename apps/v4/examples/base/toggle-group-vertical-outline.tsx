import { ToggleGroup, ToggleGroupItem } from "@/examples/base/ui/toggle-group"

export function ToggleGroupVerticalOutline() {
  return (
    <ToggleGroup
      variant="outline"
      defaultValue={["all"]}
      orientation="vertical"
      size="sm"
    >
      <ToggleGroupItem value="all" aria-label="Toggle all">
        All
      </ToggleGroupItem>
      <ToggleGroupItem value="active" aria-label="Toggle active">
        Active
      </ToggleGroupItem>
      <ToggleGroupItem value="completed" aria-label="Toggle completed">
        Completed
      </ToggleGroupItem>
      <ToggleGroupItem value="archived" aria-label="Toggle archived">
        Archived
      </ToggleGroupItem>
    </ToggleGroup>
  )
}
