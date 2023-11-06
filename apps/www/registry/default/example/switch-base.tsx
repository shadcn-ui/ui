import { Label } from "@/registry/default/ui/label"
import { Switch } from "@/registry/default/ui/switch"

export default function SwitchBase() {
  return (
    <div className="flex items-center space-x-2">
      <Switch size="base" id="switch-base" />
      <Label htmlFor="switch-base">Base Size</Label>
    </div>
  )
}
