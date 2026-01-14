import { Kbd } from "@/examples/base/ui/kbd"

export function KbdArrowKeys() {
  return (
    <div className="flex items-center gap-2">
      <Kbd>↑</Kbd>
      <Kbd>↓</Kbd>
      <Kbd>←</Kbd>
      <Kbd>→</Kbd>
    </div>
  )
}
