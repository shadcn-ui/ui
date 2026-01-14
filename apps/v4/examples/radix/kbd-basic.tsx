import { Kbd } from "@/examples/radix/ui/kbd"

export function KbdBasic() {
  return (
    <div className="flex items-center gap-2">
      <Kbd>Ctrl</Kbd>
      <Kbd>⌘K</Kbd>
      <Kbd>Ctrl + B</Kbd>
    </div>
  )
}
