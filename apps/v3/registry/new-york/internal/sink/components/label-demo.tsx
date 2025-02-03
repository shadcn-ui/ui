import { Checkbox } from "@/registry/new-york/ui/checkbox"
import { Input } from "@/registry/new-york/ui/input"
import { Label } from "@/registry/new-york/ui/label"
import { Textarea } from "@/registry/new-york/ui/textarea"

export function LabelDemo() {
  return (
    <div className="grid gap-6 w-full max-w-sm">
      <div className="flex items-center gap-3">
        <Checkbox id="label-demo-terms" />
        <Label htmlFor="label-demo-terms">Accept terms and conditions</Label>
      </div>
      <div className="grid gap-3">
        <Label htmlFor="label-demo-username">Username</Label>
        <Input id="label-demo-username" placeholder="Username" />
      </div>
      <div className="grid gap-3 group" data-disabled={true}>
        <Label htmlFor="label-demo-disabled">Disabled</Label>
        <Input id="label-demo-disabled" placeholder="Disabled" disabled />
      </div>
      <div className="grid gap-3">
        <Label htmlFor="label-demo-message">Message</Label>
        <Textarea id="label-demo-message" placeholder="Message" />
      </div>
    </div>
  )
}
