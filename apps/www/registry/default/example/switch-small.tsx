import { Label } from "@/registry/default/ui/label"
import { Switch } from "@/registry/default/ui/switch"

export default function SwitchSmall() {
  return (
    <div className="flex items-center space-x-2">
      <Switch size="sm" id="switch-small" />
      <Label htmlFor="switch-small">Small Size</Label>
    </div>
  )
}
