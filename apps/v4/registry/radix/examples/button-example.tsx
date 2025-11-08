import { Button } from "@/registry/radix/ui/button"
import { CanvaFrame } from "@/app/(design)/design/components/canva"
import { IconPlaceholder } from "@/app/(design)/design/components/icon-placeholder"

export default function ButtonDemo() {
  return (
    <CanvaFrame className="items-start justify-start">
      <div className="flex flex-col gap-20">
        <div className="flex w-full max-w-2xl flex-col gap-6">
          <div className="flex flex-wrap items-center gap-2 md:flex-row">
            <Button size="sm">Default</Button>
            <Button size="sm" variant="secondary">
              Secondary
            </Button>
            <Button size="sm" variant="outline">
              Outline
            </Button>
            <Button size="sm" variant="ghost">
              Ghost
            </Button>
            <Button size="sm" variant="destructive">
              Destructive
            </Button>
            <Button size="sm" variant="link">
              Link
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-2 md:flex-row">
            <Button>Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="link">Link</Button>
          </div>
          <div className="flex flex-wrap items-center gap-2 md:flex-row">
            <Button size="lg">Default</Button>
            <Button size="lg" variant="secondary">
              Secondary
            </Button>
            <Button size="lg" variant="outline">
              Outline
            </Button>
            <Button size="lg" variant="ghost">
              Ghost
            </Button>
            <Button size="lg" variant="destructive">
              Destructive
            </Button>
            <Button size="lg" variant="link">
              Link
            </Button>
          </div>
        </div>
        <div className="flex w-full max-w-2xl flex-col gap-6">
          <div className="flex flex-wrap items-center gap-2 md:flex-row">
            <Button size="sm">
              Default <IconPlaceholder icon="ArrowRightIcon" />
            </Button>
            <Button size="sm" variant="secondary">
              Secondary <IconPlaceholder icon="ArrowRightIcon" />
            </Button>
            <Button size="sm" variant="outline">
              Outline <IconPlaceholder icon="ArrowRightIcon" />
            </Button>
            <Button size="sm" variant="ghost">
              Ghost <IconPlaceholder icon="ArrowRightIcon" />
            </Button>
            <Button size="sm" variant="destructive">
              Destructive <IconPlaceholder icon="ArrowRightIcon" />
            </Button>
            <Button size="sm" variant="link">
              Link <IconPlaceholder icon="ArrowRightIcon" />
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-2 md:flex-row">
            <Button>
              Default <IconPlaceholder icon="ArrowRightIcon" />
            </Button>
            <Button variant="secondary">
              Secondary <IconPlaceholder icon="ArrowRightIcon" />
            </Button>
            <Button variant="outline">
              Outline <IconPlaceholder icon="ArrowRightIcon" />
            </Button>
            <Button variant="ghost">
              Ghost <IconPlaceholder icon="ArrowRightIcon" />
            </Button>
            <Button variant="destructive">
              Destructive <IconPlaceholder icon="ArrowRightIcon" />
            </Button>
            <Button variant="link">
              Link <IconPlaceholder icon="ArrowRightIcon" />
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-2 md:flex-row">
            <Button size="lg">
              Default <IconPlaceholder icon="ArrowRightIcon" />
            </Button>
            <Button size="lg" variant="secondary">
              Secondary <IconPlaceholder icon="ArrowRightIcon" />
            </Button>
            <Button size="lg" variant="outline">
              Outline <IconPlaceholder icon="ArrowRightIcon" />
            </Button>
            <Button size="lg" variant="ghost">
              Ghost <IconPlaceholder icon="ArrowRightIcon" />
            </Button>
            <Button size="lg" variant="destructive">
              Destructive <IconPlaceholder icon="ArrowRightIcon" />
            </Button>
            <Button size="lg" variant="link">
              Link <IconPlaceholder icon="ArrowRightIcon" />
            </Button>
          </div>
        </div>
        <div className="flex w-full max-w-2xl flex-col gap-6">
          <div className="flex flex-wrap items-center gap-2 md:flex-row">
            <Button size="sm">
              <IconPlaceholder icon="ArrowRightIcon" /> Default
            </Button>
            <Button size="sm" variant="secondary">
              <IconPlaceholder icon="ArrowRightIcon" /> Secondary
            </Button>
            <Button size="sm" variant="outline">
              <IconPlaceholder icon="ArrowRightIcon" /> Outline
            </Button>
            <Button size="sm" variant="ghost">
              <IconPlaceholder icon="ArrowRightIcon" /> Ghost
            </Button>
            <Button size="sm" variant="destructive">
              <IconPlaceholder icon="ArrowRightIcon" /> Destructive
            </Button>
            <Button size="sm" variant="link">
              <IconPlaceholder icon="ArrowRightIcon" /> Link
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-2 md:flex-row">
            <Button>
              <IconPlaceholder icon="ArrowRightIcon" /> Default
            </Button>
            <Button variant="secondary">
              <IconPlaceholder icon="ArrowRightIcon" /> Secondary
            </Button>
            <Button variant="outline">
              <IconPlaceholder icon="ArrowRightIcon" /> Outline
            </Button>
            <Button variant="ghost">
              <IconPlaceholder icon="ArrowRightIcon" /> Ghost
            </Button>
            <Button variant="destructive">
              <IconPlaceholder icon="ArrowRightIcon" /> Destructive
            </Button>
            <Button variant="link">
              <IconPlaceholder icon="ArrowRightIcon" /> Link
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-2 md:flex-row">
            <Button size="lg">
              <IconPlaceholder icon="ArrowRightIcon" /> Default
            </Button>
            <Button size="lg" variant="secondary">
              <IconPlaceholder icon="ArrowRightIcon" /> Secondary
            </Button>
            <Button size="lg" variant="outline">
              <IconPlaceholder icon="ArrowRightIcon" /> Outline
            </Button>
            <Button size="lg" variant="ghost">
              <IconPlaceholder icon="ArrowRightIcon" /> Ghost
            </Button>
            <Button size="lg" variant="destructive">
              <IconPlaceholder icon="ArrowRightIcon" /> Destructive
            </Button>
            <Button size="lg" variant="link">
              <IconPlaceholder icon="ArrowRightIcon" /> Link
            </Button>
          </div>
        </div>
        <div className="flex w-full max-w-2xl flex-col gap-6">
          <div className="flex flex-wrap items-center gap-2 md:flex-row">
            <Button size="icon-sm">
              <IconPlaceholder icon="ArrowRightIcon" />
            </Button>
            <Button size="icon-sm" variant="secondary">
              <IconPlaceholder icon="ArrowRightIcon" />
            </Button>
            <Button size="icon-sm" variant="outline">
              <IconPlaceholder icon="ArrowRightIcon" />
            </Button>
            <Button size="icon-sm" variant="ghost">
              <IconPlaceholder icon="ArrowRightIcon" />
            </Button>
            <Button size="icon-sm" variant="destructive">
              <IconPlaceholder icon="ArrowRightIcon" />
            </Button>
            <Button size="icon-sm" variant="link">
              <IconPlaceholder icon="ArrowRightIcon" />
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-2 md:flex-row">
            <Button size="icon">
              <IconPlaceholder icon="ArrowRightIcon" />
            </Button>
            <Button size="icon" variant="secondary">
              <IconPlaceholder icon="ArrowRightIcon" />
            </Button>
            <Button size="icon" variant="outline">
              <IconPlaceholder icon="ArrowRightIcon" />
            </Button>
            <Button size="icon" variant="ghost">
              <IconPlaceholder icon="ArrowRightIcon" />
            </Button>
            <Button size="icon" variant="destructive">
              <IconPlaceholder icon="ArrowRightIcon" />
            </Button>
            <Button size="icon" variant="link">
              <IconPlaceholder icon="ArrowRightIcon" />
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-2 md:flex-row">
            <Button size="icon-lg">
              <IconPlaceholder icon="ArrowRightIcon" />
            </Button>
            <Button size="icon-lg" variant="secondary">
              <IconPlaceholder icon="ArrowRightIcon" />
            </Button>
            <Button size="icon-lg" variant="outline">
              <IconPlaceholder icon="ArrowRightIcon" />
            </Button>
            <Button size="icon-lg" variant="ghost">
              <IconPlaceholder icon="ArrowRightIcon" />
            </Button>
            <Button size="icon-lg" variant="destructive">
              <IconPlaceholder icon="ArrowRightIcon" />
            </Button>
            <Button size="icon-lg" variant="link">
              <IconPlaceholder icon="ArrowRightIcon" />
            </Button>
          </div>
        </div>
        <div className="flex w-full max-w-2xl flex-col gap-6">
          <div className="flex flex-wrap items-center gap-2 md:flex-row">
            <div className="flex items-center gap-2">
              <Button variant="outline">Cancel</Button>
              <Button>
                Submit <IconPlaceholder icon="ArrowRightIcon" />
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="destructive">Delete</Button>
              <Button size="icon">
                <IconPlaceholder icon="ArrowRightIcon" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </CanvaFrame>
  )
}
