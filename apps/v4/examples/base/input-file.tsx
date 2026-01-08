import { Input } from "@/examples/base/ui/input"
import { Label } from "@/examples/base/ui/label"

export default function InputFile() {
  return (
    <div className="grid w-full max-w-sm items-center gap-3">
      <Label htmlFor="picture">Picture</Label>
      <Input id="picture" type="file" />
    </div>
  )
}
