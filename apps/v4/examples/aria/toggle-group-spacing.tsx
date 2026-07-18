import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/styles/aria-nova/ui/toggle-group"

export function ToggleGroupSpacing() {
  return (
    <ToggleGroup
      size="sm"
      defaultSelectedKeys={["top"]}
      variant="outline"
      spacing={2}
    >
      <ToggleGroupItem id="top" aria-label="Toggle top">
        Top
      </ToggleGroupItem>
      <ToggleGroupItem id="bottom" aria-label="Toggle bottom">
        Bottom
      </ToggleGroupItem>
      <ToggleGroupItem id="left" aria-label="Toggle left">
        Left
      </ToggleGroupItem>
      <ToggleGroupItem id="right" aria-label="Toggle right">
        Right
      </ToggleGroupItem>
    </ToggleGroup>
  )
}
