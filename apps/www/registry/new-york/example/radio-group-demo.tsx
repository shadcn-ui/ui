import { Label } from "@/registry/new-york/ui/label"
import { RadioGroup, RadioGroupItem } from "@/registry/new-york/ui/radio-group"

export default function RadioGroupDemo() {
  return (
    <RadioGroup defaultValue="comfortable">
      <div className="flex items-center">
        <RadioGroupItem value="default" id="r1" />
        <Label htmlFor="r1" className="pl-2">Default</Label>
      </div>
      <div className="flex items-center">
        <RadioGroupItem value="comfortable" id="r2" />
        <Label htmlFor="r2" className="pl-2">Comfortable</Label>
      </div>
      <div className="flex items-center">
        <RadioGroupItem value="compact" id="r3" />
        <Label htmlFor="r3" className="pl-2">Compact</Label>
      </div>
    </RadioGroup>
  )
}
