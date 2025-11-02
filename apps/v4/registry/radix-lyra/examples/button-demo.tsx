import { IconPlaceholder } from "@/registry/icon-placeholder"
import { Button } from "@/registry/radix-lyra/ui/button"

export default function ButtonDemo() {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-2 md:flex-row">
        <Button>Default</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="link">Link</Button>
      </div>
      <div className="flex flex-wrap items-center gap-2 md:flex-row">
        <Button>
          <IconPlaceholder name="SelectItemCheck" /> Icon
        </Button>
      </div>
    </div>
  )
}
