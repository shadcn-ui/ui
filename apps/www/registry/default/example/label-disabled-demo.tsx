import { Label } from "@/registry/default/ui/label"

export default function LabelDemo() {
  return (
    <div>
      <div className="flex items-center space-x-2">
        <Label disabled htmlFor="terms">Accept terms and conditions</Label>
      </div>
    </div>
  )
}
