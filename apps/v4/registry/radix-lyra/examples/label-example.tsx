import { Checkbox } from "@/registry/bases/radix/ui/checkbox"
import { Input } from "@/registry/bases/radix/ui/input"
import { Label } from "@/registry/bases/radix/ui/label"
import { Textarea } from "@/registry/bases/radix/ui/textarea"
import { CanvaFrame } from "@/app/(design)/design/components/canva"

export default function LabelDemo() {
  return (
    <CanvaFrame>
      <div className="grid w-full max-w-sm gap-6">
        <div className="flex items-center gap-3">
          <Checkbox id="label-demo-terms" />
          <Label htmlFor="label-demo-terms">Accept terms and conditions</Label>
        </div>
        <div className="grid gap-3">
          <Label htmlFor="label-demo-username">Username</Label>
          <Input id="label-demo-username" placeholder="Username" />
        </div>
        <div className="group grid gap-3" data-disabled={true}>
          <Label htmlFor="label-demo-disabled">Disabled</Label>
          <Input id="label-demo-disabled" placeholder="Disabled" disabled />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="label-demo-message">Message</Label>
          <Textarea id="label-demo-message" placeholder="Message" />
        </div>
      </div>
    </CanvaFrame>
  )
}
