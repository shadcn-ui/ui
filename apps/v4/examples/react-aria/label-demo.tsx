import { Checkbox } from "@/examples/react-aria/ui/checkbox"
import { Label } from "@/examples/react-aria/ui/label"

export default function LabelDemo() {
  return (
    <div className="flex gap-2">
      <Checkbox id="terms" />
      <Label htmlFor="terms">Accept terms and conditions</Label>
    </div>
  )
}
