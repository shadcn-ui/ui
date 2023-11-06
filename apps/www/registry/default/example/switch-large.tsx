import { Label } from "@/registry/default/ui/label"
import { Switch } from "@/registry/default/ui/switch"

export default function SwitchLarge() {
  return (
    <div className="flex items-center space-x-2">
      <Switch size="lg" id="switch-large" />
      <Label htmlFor="switch-large">Large Size</Label>
    </div>
  )
}
