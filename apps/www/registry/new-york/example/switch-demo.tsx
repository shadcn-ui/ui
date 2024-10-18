import { Label } from "@/registry/new-york/ui/label"
import { Switch } from "@/registry/new-york/ui/switch"

export default function SwitchDemo() {
  return (
    <div className="flex items-center">
      <Switch id="airplane-mode" />
      <Label htmlFor="airplane-mode" className="pl-2">Airplane Mode</Label>
    </div>
  )
}
