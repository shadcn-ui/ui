import { Label } from "@/registry/radix-nova/ui/label"
import { Switch } from "@/registry/radix-nova/ui/switch"

export function SwitchDemo() {
  return (
    <div className="flex items-center space-x-2">
      <Switch id="airplane-mode" />
      <Label htmlFor="airplane-mode">Airplane Mode</Label>
    </div>
  )
}
