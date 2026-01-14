import { Button } from "@/examples/base/ui/button"
import { Toggle } from "@/examples/base/ui/toggle"

export function ToggleWithButtonText() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Button size="sm" variant="outline">
          Button
        </Button>
        <Toggle variant="outline" aria-label="Toggle sm" size="sm">
          Toggle
        </Toggle>
      </div>
      <div className="flex items-center gap-2">
        <Button size="default" variant="outline">
          Button
        </Button>
        <Toggle variant="outline" aria-label="Toggle default" size="default">
          Toggle
        </Toggle>
      </div>
      <div className="flex items-center gap-2">
        <Button size="lg" variant="outline">
          Button
        </Button>
        <Toggle variant="outline" aria-label="Toggle lg" size="lg">
          Toggle
        </Toggle>
      </div>
    </div>
  )
}
