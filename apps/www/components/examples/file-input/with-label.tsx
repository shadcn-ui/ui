import { FileInput } from "@/components/ui/file-input"
import { Label } from "@/components/ui/label"

export function FileInputWithLabel() {
  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="image">Image</Label>
      <FileInput id="image" />
    </div>
  )
}
