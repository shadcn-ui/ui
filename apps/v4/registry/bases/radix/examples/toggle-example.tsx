import { Toggle } from "@/registry/bases/radix/ui/toggle"
import { CanvaFrame } from "@/app/(design)/design/components/canva"
import { IconPlaceholder } from "@/app/(design)/design/components/icon-placeholder"

export default function ToggleDemo() {
  return (
    <CanvaFrame>
      <div className="flex flex-wrap items-center gap-6">
        <Toggle aria-label="Toggle italic">
          <IconPlaceholder
            lucide="CircleDashedIcon"
            tabler="IconCircleDashed"
            hugeicons="DashedLineCircleIcon"
          />
        </Toggle>
        <Toggle aria-label="Toggle italic" variant="default">
          <IconPlaceholder
            lucide="CircleDashedIcon"
            tabler="IconCircleDashed"
            hugeicons="DashedLineCircleIcon"
          />
        </Toggle>
        <Toggle aria-label="Toggle italic" variant="default" disabled>
          Disabled
        </Toggle>
        <Toggle variant="outline" aria-label="Toggle italic">
          <IconPlaceholder
            lucide="CircleDashedIcon"
            tabler="IconCircleDashed"
            hugeicons="DashedLineCircleIcon"
          />
          Italic
        </Toggle>
        <Toggle
          aria-label="Toggle book"
          className="data-[state=on]:[&_svg]:fill-accent-foreground"
        >
          <IconPlaceholder
            lucide="CircleDashedIcon"
            tabler="IconCircleDashed"
            hugeicons="DashedLineCircleIcon"
          />
        </Toggle>
        <Toggle variant="outline" aria-label="Toggle italic" size="sm">
          Small
        </Toggle>
        <Toggle variant="outline" aria-label="Toggle italic" size="lg">
          Large
        </Toggle>
      </div>
    </CanvaFrame>
  )
}
