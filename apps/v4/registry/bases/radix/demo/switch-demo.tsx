import { Label } from "@/registry/bases/radix/ui/label"
import { Switch } from "@/registry/bases/radix/ui/switch"

export function SwitchDemo() {
  return (
    <div className="flex items-center space-x-2">
      <Switch id="airplane-mode" />
      <Label htmlFor="airplane-mode">Airplane Mode</Label>
    </div>
  )
}
