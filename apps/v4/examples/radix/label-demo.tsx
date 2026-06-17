import { Checkbox } from "@/styles/radix-force-ui/ui/checkbox"
import { Label } from "@/styles/radix-force-ui/ui/label"

export default function LabelDemo() {
  return (
    <div className="flex gap-2">
      <Checkbox id="terms" />
      <Label htmlFor="terms">Accept terms and conditions</Label>
    </div>
  )
}
