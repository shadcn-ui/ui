import { Input } from "@/registry/radix-nova/ui/input"
import { Label } from "@/registry/radix-nova/ui/label"

export default function InputFile() {
  return (
    <div className="grid w-full max-w-sm items-center gap-3">
      <Label htmlFor="picture">Picture</Label>
      <Input id="picture" type="file" />
    </div>
  )
}
