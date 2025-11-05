import { Button } from "@/registry/radix-nova/ui/button"
import { IconPlaceholder } from "@/app/(design)/components/icon-placeholder"

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
            Default <IconPlaceholder name="ArrowRightIcon" />
          </Button>
          <Button size="sm" variant="outline">
            Outline <IconPlaceholder name="ArrowRightIcon" />
          </Button>
          <Button size="sm" variant="ghost">
            Ghost <IconPlaceholder name="ArrowRightIcon" />
          </Button>
          <Button size="sm" variant="destructive">
            Destructive <IconPlaceholder name="ArrowRightIcon" />
          </Button>
          <Button size="sm" variant="secondary">
            Secondary <IconPlaceholder name="ArrowRightIcon" />
          </Button>
          <Button size="sm" variant="link">
            Link <IconPlaceholder name="ArrowRightIcon" />
          </Button>
        </div>
        <div className="flex flex-wrap items-center gap-2 md:flex-row">
          <Button>
            Default <IconPlaceholder name="ArrowRightIcon" />
          </Button>
          <Button variant="outline">
            Outline <IconPlaceholder name="ArrowRightIcon" />
          </Button>
          <Button variant="ghost">
            Ghost <IconPlaceholder name="ArrowRightIcon" />
          </Button>
          <Button variant="destructive">
            Destructive <IconPlaceholder name="ArrowRightIcon" />
          </Button>
          <Button variant="secondary">
            Secondary <IconPlaceholder name="ArrowRightIcon" />
          </Button>
          <Button variant="link">
            Link <IconPlaceholder name="ArrowRightIcon" />
          </Button>
        </div>
        <div className="flex flex-wrap items-center gap-2 md:flex-row">
          <Button size="lg">
            Default <IconPlaceholder name="ArrowRightIcon" />
          </Button>
          <Button size="lg" variant="outline">
            Outline <IconPlaceholder name="ArrowRightIcon" />
          </Button>
          <Button size="lg" variant="ghost">
            Ghost <IconPlaceholder name="ArrowRightIcon" />
          </Button>
          <Button size="lg" variant="destructive">
            Destructive <IconPlaceholder name="ArrowRightIcon" />
          </Button>
          <Button size="lg" variant="secondary">
            Secondary <IconPlaceholder name="ArrowRightIcon" />
          </Button>
          <Button size="lg" variant="link">
            Link <IconPlaceholder name="ArrowRightIcon" />
          </Button>
        </div>
      </div>

      <div className="flex w-full max-w-2xl flex-col gap-6">
        <div className="flex flex-wrap items-center gap-2 md:flex-row">
          <Button size="sm">
            <IconPlaceholder name="ShareIcon" /> Default
          </Button>
          <Button size="sm" variant="outline">
            <IconPlaceholder name="ShareIcon" /> Outline
          </Button>
          <Button size="sm" variant="ghost">
            <IconPlaceholder name="ShareIcon" /> Ghost
          </Button>
          <Button size="sm" variant="destructive">
            <IconPlaceholder name="ShareIcon" /> Destructive
          </Button>
          <Button size="sm" variant="secondary">
            <IconPlaceholder name="ShareIcon" /> Secondary
          </Button>
          <Button size="sm" variant="link">
            <IconPlaceholder name="ShareIcon" /> Link
          </Button>
        </div>
        <div className="flex flex-wrap items-center gap-2 md:flex-row">
          <Button>
            <IconPlaceholder name="ShareIcon" /> Default
          </Button>
          <Button variant="outline">
            <IconPlaceholder name="ShareIcon" /> Outline
          </Button>
          <Button variant="ghost">
            <IconPlaceholder name="ShareIcon" /> Ghost
          </Button>
          <Button variant="destructive">
            <IconPlaceholder name="ShareIcon" /> Destructive
          </Button>
          <Button variant="secondary">
            <IconPlaceholder name="ShareIcon" /> Secondary
          </Button>
          <Button variant="link">
            <IconPlaceholder name="ShareIcon" /> Link
          </Button>
        </div>
        <div className="flex flex-wrap items-center gap-2 md:flex-row">
          <Button size="lg">
            <IconPlaceholder name="ShareIcon" /> Default
          </Button>
          <Button size="lg" variant="outline">
            <IconPlaceholder name="ShareIcon" /> Outline
          </Button>
          <Button size="lg" variant="ghost">
            <IconPlaceholder name="ShareIcon" /> Ghost
          </Button>
          <Button size="lg" variant="destructive">
            <IconPlaceholder name="ShareIcon" /> Destructive
          </Button>
          <Button size="lg" variant="secondary">
            <IconPlaceholder name="ShareIcon" /> Secondary
          </Button>
          <Button size="lg" variant="link">
            <IconPlaceholder name="ShareIcon" /> Link
          </Button>
        </div>
      </div>

      <div className="flex w-full max-w-2xl flex-col gap-6">
        <div className="flex flex-wrap items-center gap-2 md:flex-row">
          <Button size="icon-sm">
            <IconPlaceholder name="ArrowRightIcon" />
          </Button>
          <Button size="icon-sm" variant="outline">
            <IconPlaceholder name="ArrowRightIcon" />
          </Button>
          <Button size="icon-sm" variant="ghost">
            <IconPlaceholder name="ArrowRightIcon" />
          </Button>
          <Button size="icon-sm" variant="destructive">
            <IconPlaceholder name="ArrowRightIcon" />
          </Button>
          <Button size="icon-sm" variant="secondary">
            <IconPlaceholder name="ArrowRightIcon" />
          </Button>
          <Button size="icon-sm" variant="link">
            <IconPlaceholder name="ArrowRightIcon" />
          </Button>
        </div>
        <div className="flex flex-wrap items-center gap-2 md:flex-row">
          <Button size="icon">
            <IconPlaceholder name="ArrowRightIcon" />
          </Button>
          <Button size="icon" variant="outline">
            <IconPlaceholder name="ArrowRightIcon" />
          </Button>
          <Button size="icon" variant="ghost">
            <IconPlaceholder name="ArrowRightIcon" />
          </Button>
          <Button size="icon" variant="destructive">
            <IconPlaceholder name="ArrowRightIcon" />
          </Button>
          <Button size="icon" variant="secondary">
            <IconPlaceholder name="ArrowRightIcon" />
          </Button>
          <Button size="icon" variant="link">
            <IconPlaceholder name="ArrowRightIcon" />
          </Button>
        </div>
        <div className="flex flex-wrap items-center gap-2 md:flex-row">
          <Button size="icon-lg">
            <IconPlaceholder name="ArrowRightIcon" />
          </Button>
          <Button size="icon-lg" variant="outline">
            <IconPlaceholder name="ArrowRightIcon" />
          </Button>
          <Button size="icon-lg" variant="ghost">
            <IconPlaceholder name="ArrowRightIcon" />
          </Button>
          <Button size="icon-lg" variant="destructive">
            <IconPlaceholder name="ArrowRightIcon" />
          </Button>
          <Button size="icon-lg" variant="secondary">
            <IconPlaceholder name="ArrowRightIcon" />
          </Button>
          <Button size="icon-lg" variant="link">
            <IconPlaceholder name="ArrowRightIcon" />
          </Button>
        </div>
      </div>
      <div className="flex w-full max-w-2xl flex-col gap-6">
        <div className="flex flex-wrap items-center gap-2 md:flex-row">
          <div className="flex items-center gap-2">
            <Button variant="outline">Cancel</Button>
            <Button>
              Submit <IconPlaceholder name="ArrowRightIcon" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="destructive">Delete</Button>
            <Button size="icon">
              <IconPlaceholder name="ArrowRightIcon" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
