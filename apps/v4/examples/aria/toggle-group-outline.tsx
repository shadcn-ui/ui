import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/styles/aria-nova/ui/toggle-group"

export function ToggleGroupOutline() {
  return (
    <ToggleGroup variant="outline" defaultSelectedKeys={["all"]}>
      <ToggleGroupItem id="all" aria-label="Toggle all">
        All
      </ToggleGroupItem>
      <ToggleGroupItem id="missed" aria-label="Toggle missed">
        Missed
      </ToggleGroupItem>
    </ToggleGroup>
  )
}
