import { Toggle } from "@/styles/aria-nova/ui/toggle"

export function ToggleDisabled() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Toggle aria-label="Toggle disabled" isDisabled>
        Disabled
      </Toggle>
      <Toggle variant="outline" aria-label="Toggle disabled outline" isDisabled>
        Disabled
      </Toggle>
    </div>
  )
}
