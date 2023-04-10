import { FileInput } from "@/components/ui/file-input"
import { Label } from "@/components/ui/label"

export function FileInputWithText() {
  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="image-2">Image</Label>
      <FileInput id="image-2" />
      <p className="text-sm text-slate-500">Recommended size (800x600)</p>
    </div>
  )
}
