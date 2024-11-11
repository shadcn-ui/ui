import { Checkbox } from "@/registry/new-york/ui/checkbox"
import { Label } from "@/registry/new-york/ui/label"

export function LabelDemo() {
  return (
    <div>
      <div className="flex items-center space-x-2">
        <Checkbox id="terms" />
        <Label htmlFor="terms">Accept terms and conditions</Label>
      </div>
    </div>
  )
}
