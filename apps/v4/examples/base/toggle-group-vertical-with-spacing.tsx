import { ToggleGroup, ToggleGroupItem } from "@/examples/base/ui/toggle-group"

export function ToggleGroupVerticalWithSpacing() {
  return (
    <ToggleGroup
      size="sm"
      defaultValue={["top"]}
      variant="outline"
      orientation="vertical"
      spacing={1}
    >
      <ToggleGroupItem value="top" aria-label="Toggle top">
        Top
      </ToggleGroupItem>
      <ToggleGroupItem value="bottom" aria-label="Toggle bottom">
        Bottom
      </ToggleGroupItem>
      <ToggleGroupItem value="left" aria-label="Toggle left">
        Left
      </ToggleGroupItem>
      <ToggleGroupItem value="right" aria-label="Toggle right">
        Right
      </ToggleGroupItem>
    </ToggleGroup>
  )
}
