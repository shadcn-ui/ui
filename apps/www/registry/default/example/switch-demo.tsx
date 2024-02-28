import { Label } from "@/registry/default/ui/label"
import { Switch } from "@/registry/default/ui/switch"

export default function SwitchDemo() {
  return (
    <div className="flex items-center">
      <Switch id="airplane-mode" />
      <Label htmlFor="airplane-mode" className="pl-2">Airplane Mode</Label>
    </div>
  )
}
