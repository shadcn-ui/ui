import { ToggleGroup, ToggleGroupItem } from "@/examples/radix/ui/toggle-group"

export function ToggleGroupFilter() {
  return (
    <ToggleGroup type="single" defaultValue="all" variant="outline" size="sm">
      <ToggleGroupItem value="all" aria-label="All">
        All
      </ToggleGroupItem>
      <ToggleGroupItem value="active" aria-label="Active">
        Active
      </ToggleGroupItem>
      <ToggleGroupItem value="completed" aria-label="Completed">
        Completed
      </ToggleGroupItem>
      <ToggleGroupItem value="archived" aria-label="Archived">
        Archived
      </ToggleGroupItem>
    </ToggleGroup>
  )
}
