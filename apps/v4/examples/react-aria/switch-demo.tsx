import { Label } from "@/styles/react-aria-nova/ui/label"
import { Switch } from "@/styles/react-aria-nova/ui/switch"

export function SwitchDemo() {
  return (
    <div className="flex items-center space-x-2">
      <Switch id="airplane-mode" />
      <Label htmlFor="airplane-mode">Airplane Mode</Label>
    </div>
  )
}
