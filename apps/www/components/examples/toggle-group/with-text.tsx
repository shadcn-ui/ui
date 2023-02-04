import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

export function ToggleGroupWithText() {
  return (
    <ToggleGroup
      type="single"
      defaultValue="center"
      aria-label="Text alignment"
      size="sm"
    >
      <ToggleGroupItem value="left" aria-label="Left aligned">
        Align left
      </ToggleGroupItem>
      <ToggleGroupItem value="center" aria-label="Center aligned">
        Align center
      </ToggleGroupItem>
      <ToggleGroupItem value="right" aria-label="Right aligned">
        Align right
      </ToggleGroupItem>
    </ToggleGroup>
  )
}
