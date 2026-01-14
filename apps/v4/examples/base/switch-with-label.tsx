import { Label } from "@/examples/base/ui/label"
import { Switch } from "@/examples/base/ui/switch"

export function SwitchWithLabel() {
  return (
    <div className="flex items-center gap-2">
      <Switch id="switch-bluetooth" defaultChecked />
      <Label htmlFor="switch-bluetooth">Bluetooth</Label>
    </div>
  )
}
