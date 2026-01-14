import { Label } from "@/examples/radix/ui/label"
import { Switch } from "@/examples/radix/ui/switch"

export function SwitchDisabled() {
  return (
    <div className="flex flex-col gap-12">
      <div className="flex items-center gap-2">
        <Switch id="switch-disabled-unchecked" disabled />
        <Label htmlFor="switch-disabled-unchecked">Disabled (Unchecked)</Label>
      </div>
      <div className="flex items-center gap-2">
        <Switch id="switch-disabled-checked" defaultChecked disabled />
        <Label htmlFor="switch-disabled-checked">Disabled (Checked)</Label>
      </div>
    </div>
  )
}
