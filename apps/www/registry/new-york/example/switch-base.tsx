import { Label } from "@/registry/new-york/ui/label"
import { Switch } from "@/registry/new-york/ui/switch"

export default function SwitchBase() {
  return (
    <div className="flex items-center space-x-2">
      <Switch size="base" id="switch-base" />
      <Label htmlFor="switch-base">Base Size</Label>
    </div>
  )
}
