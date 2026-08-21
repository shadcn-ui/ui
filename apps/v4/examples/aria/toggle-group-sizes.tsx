import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/styles/aria-nova/ui/toggle-group"

export function ToggleGroupSizes() {
  return (
    <div className="flex flex-col gap-4">
      <ToggleGroup size="sm" defaultSelectedKeys={["top"]} variant="outline">
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
      <ToggleGroup defaultSelectedKeys={["top"]} variant="outline">
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
    </div>
  )
}
