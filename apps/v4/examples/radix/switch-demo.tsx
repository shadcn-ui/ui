import { Label } from "@/styles/radix-force-ui/ui/label"
import { Switch } from "@/styles/radix-force-ui/ui/switch"

export function SwitchDemo() {
  return (
    <div className="flex items-center space-x-2">
      <Switch id="airplane-mode" />
      <Label htmlFor="airplane-mode">Airplane Mode</Label>
    </div>
  )
}
