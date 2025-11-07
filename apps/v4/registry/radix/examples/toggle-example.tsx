import { Toggle } from "@/registry/radix/ui/toggle"
import { IconPlaceholder } from "@/app/(app)/design/components/icon-placeholder"

export default function ToggleDemo() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="bg-background w-full max-w-[1500px] rounded-xl p-8">
        <div className="flex flex-wrap items-center gap-6">
          <Toggle aria-label="Toggle italic">
            <IconPlaceholder icon="PlaceholderIcon" />
          </Toggle>
          <Toggle aria-label="Toggle italic" variant="default">
            <IconPlaceholder icon="PlaceholderIcon" />
          </Toggle>
          <Toggle aria-label="Toggle italic" variant="default" disabled>
            Disabled
          </Toggle>
          <Toggle variant="outline" aria-label="Toggle italic">
            <IconPlaceholder icon="PlaceholderIcon" />
            Italic
          </Toggle>
          <Toggle
            aria-label="Toggle book"
            className="data-[state=on]:[&_svg]:fill-accent-foreground"
          >
            <IconPlaceholder icon="PlaceholderIcon" />
          </Toggle>
          <Toggle variant="outline" aria-label="Toggle italic" size="sm">
            Small
          </Toggle>
          <Toggle variant="outline" aria-label="Toggle italic" size="lg">
            Large
          </Toggle>
        </div>
      </div>
    </div>
  )
}
