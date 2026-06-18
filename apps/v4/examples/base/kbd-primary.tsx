import { Kbd } from "@/styles/base-force-ui/ui/kbd"

export default function KbdPrimary() {
  return (
    <div className="flex items-center gap-4">
      <Kbd>⌘K</Kbd>
      <div className="rounded-md bg-primary px-3 py-1.5">
        <Kbd variant="primary">⌘K</Kbd>
      </div>
    </div>
  )
}
