import { Separator } from "@/examples/base/ui/separator"

export function SeparatorVertical() {
  return (
    <div className="style-lyra:text-xs/relaxed flex h-5 items-center gap-4 text-sm">
      <div>Blog</div>
      <Separator orientation="vertical" />
      <div>Docs</div>
      <Separator orientation="vertical" />
      <div>Source</div>
    </div>
  )
}
