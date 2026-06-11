import { Checkbox } from "@/styles/base-nova/ui/checkbox"
import { Label } from "@/styles/base-nova/ui/label"

export default function LabelDemo() {
  return (
    <div className="flex gap-2">
      <Checkbox id="terms" />
      <Label htmlFor="terms">Accept terms and conditions</Label>
    </div>
  )
}
