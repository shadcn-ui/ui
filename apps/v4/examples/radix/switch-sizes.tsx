import { Label } from "@/examples/radix/ui/label"
import { Switch } from "@/examples/radix/ui/switch"

export function SwitchSizes() {
  return (
    <div className="flex flex-col gap-12">
      <div className="flex items-center gap-2">
        <Switch id="switch-size-sm" size="sm" />
        <Label htmlFor="switch-size-sm">Small</Label>
      </div>
      <div className="flex items-center gap-2">
        <Switch id="switch-size-default" size="default" />
        <Label htmlFor="switch-size-default">Default</Label>
      </div>
    </div>
  )
}
