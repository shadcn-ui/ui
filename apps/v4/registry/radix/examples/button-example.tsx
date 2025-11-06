import { Button } from "@/registry/radix/ui/button"
import { IconPlaceholder } from "@/app/(app)/design/components/icon-placeholder"

export default function ButtonDemo() {
  return (
    <div className="w-fill flex min-h-screen flex-col items-center justify-center gap-20 p-6">
      <div className="flex w-full max-w-2xl flex-col gap-6">
        <div className="flex flex-wrap items-center gap-2 md:flex-row">
          <Button size="sm">Default</Button>
          <Button size="sm" variant="outline">
            Outline
          </Button>
          <Button size="sm" variant="ghost">
            Ghost
          </Button>
          <Button size="sm" variant="destructive">
            Destructive
          </Button>
          <Button size="sm" variant="secondary">
            Secondary
          </Button>
          <Button size="sm" variant="link">
            Link
          </Button>
        </div>
        <div className="flex flex-wrap items-center gap-2 md:flex-row">
          <Button>Default</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="link">Link</Button>
        </div>
        <div className="flex flex-wrap items-center gap-2 md:flex-row">
          <Button size="lg">Default</Button>
          <Button size="lg" variant="outline">
            Outline
          </Button>
          <Button size="lg" variant="ghost">
            Ghost
          </Button>
          <Button size="lg" variant="destructive">
            Destructive
          </Button>
          <Button size="lg" variant="secondary">
            Secondary
          </Button>
          <Button size="lg" variant="link">
            Link
          </Button>
        </div>
      </div>

      <div className="flex w-full max-w-2xl flex-col gap-6">
        <div className="flex flex-wrap items-center gap-2 md:flex-row">
          <Button size="sm">
            Default <IconPlaceholder icon="PlaceholderIcon" />
          </Button>
          <Button size="sm" variant="outline">
            Outline <IconPlaceholder icon="PlaceholderIcon" />
          </Button>
          <Button size="sm" variant="ghost">
            Ghost <IconPlaceholder icon="PlaceholderIcon" />
          </Button>
          <Button size="sm" variant="destructive">
            Destructive <IconPlaceholder icon="PlaceholderIcon" />
          </Button>
          <Button size="sm" variant="secondary">
            Secondary <IconPlaceholder icon="PlaceholderIcon" />
          </Button>
          <Button size="sm" variant="link">
            Link <IconPlaceholder icon="PlaceholderIcon" />
          </Button>
        </div>
        <div className="flex flex-wrap items-center gap-2 md:flex-row">
          <Button>
            Default <IconPlaceholder icon="PlaceholderIcon" />
          </Button>
          <Button variant="outline">
            Outline <IconPlaceholder icon="PlaceholderIcon" />
          </Button>
          <Button variant="ghost">
            Ghost <IconPlaceholder icon="PlaceholderIcon" />
          </Button>
          <Button variant="destructive">
            Destructive <IconPlaceholder icon="PlaceholderIcon" />
          </Button>
          <Button variant="secondary">
            Secondary <IconPlaceholder icon="PlaceholderIcon" />
          </Button>
          <Button variant="link">
            Link <IconPlaceholder icon="PlaceholderIcon" />
          </Button>
        </div>
        <div className="flex flex-wrap items-center gap-2 md:flex-row">
          <Button size="lg">
            Default <IconPlaceholder icon="PlaceholderIcon" />
          </Button>
          <Button size="lg" variant="outline">
            Outline <IconPlaceholder icon="PlaceholderIcon" />
          </Button>
          <Button size="lg" variant="ghost">
            Ghost <IconPlaceholder icon="PlaceholderIcon" />
          </Button>
          <Button size="lg" variant="destructive">
            Destructive <IconPlaceholder icon="PlaceholderIcon" />
          </Button>
          <Button size="lg" variant="secondary">
            Secondary <IconPlaceholder icon="PlaceholderIcon" />
          </Button>
          <Button size="lg" variant="link">
            Link <IconPlaceholder icon="PlaceholderIcon" />
          </Button>
        </div>
      </div>

      <div className="flex w-full max-w-2xl flex-col gap-6">
        <div className="flex flex-wrap items-center gap-2 md:flex-row">
          <Button size="sm">
            <IconPlaceholder icon="PlaceholderIcon" /> Default
          </Button>
          <Button size="sm" variant="outline">
            <IconPlaceholder icon="PlaceholderIcon" /> Outline
          </Button>
          <Button size="sm" variant="ghost">
            <IconPlaceholder icon="PlaceholderIcon" /> Ghost
          </Button>
          <Button size="sm" variant="destructive">
            <IconPlaceholder icon="PlaceholderIcon" /> Destructive
          </Button>
          <Button size="sm" variant="secondary">
            <IconPlaceholder icon="PlaceholderIcon" /> Secondary
          </Button>
          <Button size="sm" variant="link">
            <IconPlaceholder icon="PlaceholderIcon" /> Link
          </Button>
        </div>
        <div className="flex flex-wrap items-center gap-2 md:flex-row">
          <Button>
            <IconPlaceholder icon="PlaceholderIcon" /> Default
          </Button>
          <Button variant="outline">
            <IconPlaceholder icon="PlaceholderIcon" /> Outline
          </Button>
          <Button variant="ghost">
            <IconPlaceholder icon="PlaceholderIcon" /> Ghost
          </Button>
          <Button variant="destructive">
            <IconPlaceholder icon="PlaceholderIcon" /> Destructive
          </Button>
          <Button variant="secondary">
            <IconPlaceholder icon="PlaceholderIcon" /> Secondary
          </Button>
          <Button variant="link">
            <IconPlaceholder icon="PlaceholderIcon" /> Link
          </Button>
        </div>
        <div className="flex flex-wrap items-center gap-2 md:flex-row">
          <Button size="lg">
            <IconPlaceholder icon="PlaceholderIcon" /> Default
          </Button>
          <Button size="lg" variant="outline">
            <IconPlaceholder icon="PlaceholderIcon" /> Outline
          </Button>
          <Button size="lg" variant="ghost">
            <IconPlaceholder icon="PlaceholderIcon" /> Ghost
          </Button>
          <Button size="lg" variant="destructive">
            <IconPlaceholder icon="PlaceholderIcon" /> Destructive
          </Button>
          <Button size="lg" variant="secondary">
            <IconPlaceholder icon="PlaceholderIcon" /> Secondary
          </Button>
          <Button size="lg" variant="link">
            <IconPlaceholder icon="PlaceholderIcon" /> Link
          </Button>
        </div>
      </div>

      <div className="flex w-full max-w-2xl flex-col gap-6">
        <div className="flex flex-wrap items-center gap-2 md:flex-row">
          <Button size="icon-sm">
            <IconPlaceholder icon="PlaceholderIcon" />
          </Button>
          <Button size="icon-sm" variant="outline">
            <IconPlaceholder icon="PlaceholderIcon" />
          </Button>
          <Button size="icon-sm" variant="ghost">
            <IconPlaceholder icon="PlaceholderIcon" />
          </Button>
          <Button size="icon-sm" variant="destructive">
            <IconPlaceholder icon="PlaceholderIcon" />
          </Button>
          <Button size="icon-sm" variant="secondary">
            <IconPlaceholder icon="PlaceholderIcon" />
          </Button>
          <Button size="icon-sm" variant="link">
            <IconPlaceholder icon="PlaceholderIcon" />
          </Button>
        </div>
        <div className="flex flex-wrap items-center gap-2 md:flex-row">
          <Button size="icon">
            <IconPlaceholder icon="PlaceholderIcon" />
          </Button>
          <Button size="icon" variant="outline">
            <IconPlaceholder icon="PlaceholderIcon" />
          </Button>
          <Button size="icon" variant="ghost">
            <IconPlaceholder icon="PlaceholderIcon" />
          </Button>
          <Button size="icon" variant="destructive">
            <IconPlaceholder icon="PlaceholderIcon" />
          </Button>
          <Button size="icon" variant="secondary">
            <IconPlaceholder icon="PlaceholderIcon" />
          </Button>
          <Button size="icon" variant="link">
            <IconPlaceholder icon="PlaceholderIcon" />
          </Button>
        </div>
        <div className="flex flex-wrap items-center gap-2 md:flex-row">
          <Button size="icon-lg">
            <IconPlaceholder icon="PlaceholderIcon" />
          </Button>
          <Button size="icon-lg" variant="outline">
            <IconPlaceholder icon="PlaceholderIcon" />
          </Button>
          <Button size="icon-lg" variant="ghost">
            <IconPlaceholder icon="PlaceholderIcon" />
          </Button>
          <Button size="icon-lg" variant="destructive">
            <IconPlaceholder icon="PlaceholderIcon" />
          </Button>
          <Button size="icon-lg" variant="secondary">
            <IconPlaceholder icon="PlaceholderIcon" />
          </Button>
          <Button size="icon-lg" variant="link">
            <IconPlaceholder icon="PlaceholderIcon" />
          </Button>
        </div>
      </div>
      <div className="flex w-full max-w-2xl flex-col gap-6">
        <div className="flex flex-wrap items-center gap-2 md:flex-row">
          <div className="flex items-center gap-2">
            <Button variant="outline">Cancel</Button>
            <Button>
              Submit <IconPlaceholder icon="PlaceholderIcon" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="destructive">Delete</Button>
            <Button size="icon">
              <IconPlaceholder icon="PlaceholderIcon" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
