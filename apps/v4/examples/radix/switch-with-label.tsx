import { Label } from "@/examples/radix/ui/label"
import { Switch } from "@/examples/radix/ui/switch"

export function SwitchWithLabel() {
  return (
    <div className="flex items-center gap-2">
      <Switch id="switch-bluetooth" defaultChecked />
      <Label htmlFor="switch-bluetooth">Bluetooth</Label>
    </div>
  )
}
