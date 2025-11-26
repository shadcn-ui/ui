import { CanvaFrame } from "@/components/canva"
import { Button } from "@/registry/bases/radix/ui/button"
import { IconPlaceholder } from "@/app/(design)/design/components/icon-placeholder"

export default function ButtonDemo() {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-6 lg:p-12">
      <div className="flex w-full max-w-lg flex-col gap-12">
        <ButtonVariantsAndSizes />
        <ButtonIconRight />
        <ButtonIconLeft />
        <ButtonIconOnly />
        <ButtonExamples />
      </div>
    </div>
  )
}

function ButtonVariantsAndSizes() {
  return (
    <CanvaFrame title="Variants & Sizes">
      <div className="flex flex-wrap items-center gap-2">
        <Button size="xs">Default</Button>
        <Button size="xs" variant="secondary">
          Secondary
        </Button>
        <Button size="xs" variant="outline">
          Outline
        </Button>
        <Button size="xs" variant="ghost">
          Ghost
        </Button>
        <Button size="xs" variant="destructive">
          Destructive
        </Button>
        <Button size="xs" variant="link">
          Link
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-2">
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
      <div className="flex flex-wrap items-center gap-2">
        <Button>Default</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="link">Link</Button>
      </div>
      <div className="flex flex-wrap items-center gap-2">
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
    </CanvaFrame>
  )
}

function ButtonIconRight() {
  return (
    <CanvaFrame title="Icon Right">
      <div className="flex flex-wrap items-center gap-2">
        <Button size="xs">
          Default{" "}
          <IconPlaceholder
            lucide="ArrowRightIcon"
            tabler="IconArrowRight"
            hugeicons="ArrowRight02Icon"
            data-slot="icon-inline-end"
          />
        </Button>
        <Button size="xs" variant="secondary">
          Secondary{" "}
          <IconPlaceholder
            lucide="ArrowRightIcon"
            tabler="IconArrowRight"
            hugeicons="ArrowRight02Icon"
            data-slot="icon-inline-end"
          />
        </Button>
        <Button size="xs" variant="outline">
          Outline{" "}
          <IconPlaceholder
            lucide="ArrowRightIcon"
            tabler="IconArrowRight"
            hugeicons="ArrowRight02Icon"
            data-slot="icon-inline-end"
          />
        </Button>
        <Button size="xs" variant="ghost">
          Ghost{" "}
          <IconPlaceholder
            lucide="ArrowRightIcon"
            tabler="IconArrowRight"
            hugeicons="ArrowRight02Icon"
            data-slot="icon-inline-end"
          />
        </Button>
        <Button size="xs" variant="destructive">
          Destructive{" "}
          <IconPlaceholder
            lucide="ArrowRightIcon"
            tabler="IconArrowRight"
            hugeicons="ArrowRight02Icon"
            data-slot="icon-inline-end"
          />
        </Button>
        <Button size="xs" variant="link">
          Link{" "}
          <IconPlaceholder
            lucide="ArrowRightIcon"
            tabler="IconArrowRight"
            hugeicons="ArrowRight02Icon"
            data-slot="icon-inline-end"
          />
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm">
          Default
          <IconPlaceholder
            lucide="ArrowRightIcon"
            tabler="IconArrowRight"
            hugeicons="ArrowRight02Icon"
            data-slot="icon-inline-end"
          />
        </Button>
        <Button size="sm" variant="secondary">
          Secondary{" "}
          <IconPlaceholder
            lucide="ArrowRightIcon"
            tabler="IconArrowRight"
            hugeicons="ArrowRight02Icon"
            data-slot="icon-inline-end"
          />
        </Button>
        <Button size="sm" variant="outline">
          Outline{" "}
          <IconPlaceholder
            lucide="ArrowRightIcon"
            tabler="IconArrowRight"
            hugeicons="ArrowRight02Icon"
          />
        </Button>
        <Button size="sm" variant="ghost">
          Ghost{" "}
          <IconPlaceholder
            lucide="ArrowRightIcon"
            tabler="IconArrowRight"
            hugeicons="ArrowRight02Icon"
            data-slot="icon-inline-end"
          />
        </Button>
        <Button size="sm" variant="destructive">
          Destructive{" "}
          <IconPlaceholder
            lucide="ArrowRightIcon"
            tabler="IconArrowRight"
            hugeicons="ArrowRight02Icon"
            data-slot="icon-inline-end"
          />
        </Button>
        <Button size="sm" variant="link">
          Link{" "}
          <IconPlaceholder
            lucide="ArrowRightIcon"
            tabler="IconArrowRight"
            hugeicons="ArrowRight02Icon"
            data-slot="icon-inline-end"
          />
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button>
          Default{" "}
          <IconPlaceholder
            lucide="ArrowRightIcon"
            tabler="IconArrowRight"
            hugeicons="ArrowRight02Icon"
            data-slot="icon-inline-end"
          />
        </Button>
        <Button variant="secondary">
          Secondary{" "}
          <IconPlaceholder
            lucide="ArrowRightIcon"
            tabler="IconArrowRight"
            hugeicons="ArrowRight02Icon"
            data-slot="icon-inline-end"
          />
        </Button>
        <Button variant="outline">
          Outline{" "}
          <IconPlaceholder
            lucide="ArrowRightIcon"
            tabler="IconArrowRight"
            hugeicons="ArrowRight02Icon"
            data-slot="icon-inline-end"
          />
        </Button>
        <Button variant="ghost">
          Ghost{" "}
          <IconPlaceholder
            lucide="ArrowRightIcon"
            tabler="IconArrowRight"
            hugeicons="ArrowRight02Icon"
            data-slot="icon-inline-end"
          />
        </Button>
        <Button variant="destructive">
          Destructive{" "}
          <IconPlaceholder
            lucide="ArrowRightIcon"
            tabler="IconArrowRight"
            hugeicons="ArrowRight02Icon"
            data-slot="icon-inline-end"
          />
        </Button>
        <Button variant="link">
          Link{" "}
          <IconPlaceholder
            lucide="ArrowRightIcon"
            tabler="IconArrowRight"
            hugeicons="ArrowRight02Icon"
            data-slot="icon-inline-end"
          />
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button size="lg">
          Default{" "}
          <IconPlaceholder
            lucide="ArrowRightIcon"
            tabler="IconArrowRight"
            hugeicons="ArrowRight02Icon"
            data-slot="icon-inline-end"
          />
        </Button>
        <Button size="lg" variant="secondary">
          Secondary{" "}
          <IconPlaceholder
            lucide="ArrowRightIcon"
            tabler="IconArrowRight"
            hugeicons="ArrowRight02Icon"
            data-slot="icon-inline-end"
          />
        </Button>
        <Button size="lg" variant="outline">
          Outline{" "}
          <IconPlaceholder
            lucide="ArrowRightIcon"
            tabler="IconArrowRight"
            hugeicons="ArrowRight02Icon"
            data-slot="icon-inline-end"
          />
        </Button>
        <Button size="lg" variant="ghost">
          Ghost{" "}
          <IconPlaceholder
            lucide="ArrowRightIcon"
            tabler="IconArrowRight"
            hugeicons="ArrowRight02Icon"
            data-slot="icon-inline-end"
          />
        </Button>
        <Button size="lg" variant="destructive">
          Destructive{" "}
          <IconPlaceholder
            lucide="ArrowRightIcon"
            tabler="IconArrowRight"
            hugeicons="ArrowRight02Icon"
            data-slot="icon-inline-end"
          />
        </Button>
        <Button size="lg" variant="link">
          Link{" "}
          <IconPlaceholder
            lucide="ArrowRightIcon"
            tabler="IconArrowRight"
            hugeicons="ArrowRight02Icon"
            data-slot="icon-inline-end"
          />
        </Button>
      </div>
    </CanvaFrame>
  )
}

function ButtonIconLeft() {
  return (
    <CanvaFrame title="Icon Left">
      <div className="flex flex-wrap items-center gap-2">
        <Button size="xs">
          <IconPlaceholder
            lucide="CopyIcon"
            tabler="IconCopy"
            hugeicons="Copy02Icon"
            data-slot="icon-inline-start"
          />{" "}
          Default
        </Button>
        <Button size="xs" variant="secondary">
          <IconPlaceholder
            lucide="CopyIcon"
            tabler="IconCopy"
            hugeicons="Copy02Icon"
            data-slot="icon-inline-start"
          />{" "}
          Secondary
        </Button>
        <Button size="xs" variant="outline">
          <IconPlaceholder
            lucide="CopyIcon"
            tabler="IconCopy"
            hugeicons="Copy02Icon"
            data-slot="icon-inline-start"
          />{" "}
          Outline
        </Button>
        <Button size="xs" variant="ghost">
          <IconPlaceholder
            lucide="CopyIcon"
            tabler="IconCopy"
            hugeicons="Copy02Icon"
            data-slot="icon-inline-start"
          />{" "}
          Ghost
        </Button>
        <Button size="xs" variant="destructive">
          <IconPlaceholder
            lucide="CopyIcon"
            tabler="IconCopy"
            hugeicons="Copy02Icon"
            data-slot="icon-inline-start"
          />{" "}
          Destructive
        </Button>
        <Button size="xs" variant="link">
          <IconPlaceholder
            lucide="CopyIcon"
            tabler="IconCopy"
            hugeicons="Copy02Icon"
            data-slot="icon-inline-start"
          />{" "}
          Link
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm">
          <IconPlaceholder
            lucide="CopyIcon"
            tabler="IconCopy"
            hugeicons="Copy02Icon"
            data-slot="icon-inline-start"
          />{" "}
          Default
        </Button>
        <Button size="sm" variant="secondary">
          <IconPlaceholder
            lucide="CopyIcon"
            tabler="IconCopy"
            hugeicons="Copy02Icon"
            data-slot="icon-inline-start"
          />{" "}
          Secondary
        </Button>
        <Button size="sm" variant="outline">
          <IconPlaceholder
            lucide="CopyIcon"
            tabler="IconCopy"
            hugeicons="Copy02Icon"
            data-slot="icon-inline-start"
          />{" "}
          Outline
        </Button>
        <Button size="sm" variant="ghost">
          <IconPlaceholder
            lucide="CopyIcon"
            tabler="IconCopy"
            hugeicons="Copy02Icon"
            data-slot="icon-inline-start"
          />{" "}
          Ghost
        </Button>
        <Button size="sm" variant="destructive">
          <IconPlaceholder
            lucide="CopyIcon"
            tabler="IconCopy"
            hugeicons="Copy02Icon"
            data-slot="icon-inline-start"
          />{" "}
          Destructive
        </Button>
        <Button size="sm" variant="link">
          <IconPlaceholder
            lucide="CopyIcon"
            tabler="IconCopy"
            hugeicons="Copy02Icon"
            data-slot="icon-inline-start"
          />{" "}
          Link
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button>
          <IconPlaceholder
            lucide="CopyIcon"
            tabler="IconCopy"
            hugeicons="Copy02Icon"
            data-slot="icon-inline-start"
          />{" "}
          Default
        </Button>
        <Button variant="secondary">
          <IconPlaceholder
            lucide="CopyIcon"
            tabler="IconCopy"
            hugeicons="Copy02Icon"
            data-slot="icon-inline-start"
          />{" "}
          Secondary
        </Button>
        <Button variant="outline">
          <IconPlaceholder
            lucide="CopyIcon"
            tabler="IconCopy"
            hugeicons="Copy02Icon"
            data-slot="icon-inline-start"
          />{" "}
          Outline
        </Button>
        <Button variant="ghost">
          <IconPlaceholder
            lucide="CopyIcon"
            tabler="IconCopy"
            hugeicons="Copy02Icon"
            data-slot="icon-inline-start"
          />{" "}
          Ghost
        </Button>
        <Button variant="destructive">
          <IconPlaceholder
            lucide="CopyIcon"
            tabler="IconCopy"
            hugeicons="Copy02Icon"
            data-slot="icon-inline-start"
          />{" "}
          Destructive
        </Button>
        <Button variant="link">
          <IconPlaceholder
            lucide="CopyIcon"
            tabler="IconCopy"
            hugeicons="Copy02Icon"
            data-slot="icon-inline-start"
          />{" "}
          Link
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button size="lg">
          <IconPlaceholder
            lucide="CopyIcon"
            tabler="IconCopy"
            hugeicons="Copy02Icon"
            data-slot="icon-inline-start"
          />{" "}
          Default
        </Button>
        <Button size="lg" variant="secondary">
          <IconPlaceholder
            lucide="CopyIcon"
            tabler="IconCopy"
            hugeicons="Copy02Icon"
            data-slot="icon-inline-start"
          />{" "}
          Secondary
        </Button>
        <Button size="lg" variant="outline">
          <IconPlaceholder
            lucide="CopyIcon"
            tabler="IconCopy"
            hugeicons="Copy02Icon"
            data-slot="icon-inline-start"
          />{" "}
          Outline
        </Button>
        <Button size="lg" variant="ghost">
          <IconPlaceholder
            lucide="CopyIcon"
            tabler="IconCopy"
            hugeicons="Copy02Icon"
            data-slot="icon-inline-start"
          />{" "}
          Ghost
        </Button>
        <Button size="lg" variant="destructive">
          <IconPlaceholder
            lucide="CopyIcon"
            tabler="IconCopy"
            hugeicons="Copy02Icon"
            data-slot="icon-inline-start"
          />{" "}
          Destructive
        </Button>
        <Button size="lg" variant="link">
          <IconPlaceholder
            lucide="CopyIcon"
            tabler="IconCopy"
            hugeicons="Copy02Icon"
            data-slot="icon-inline-start"
          />{" "}
          Link
        </Button>
      </div>
    </CanvaFrame>
  )
}

function ButtonIconOnly() {
  return (
    <CanvaFrame title="Icon Only">
      <div className="flex flex-wrap items-center gap-2">
        <Button size="icon-xs">
          <IconPlaceholder
            lucide="ArrowRightIcon"
            tabler="IconArrowRight"
            hugeicons="ArrowRight02Icon"
          />
        </Button>
        <Button size="icon-xs" variant="secondary">
          <IconPlaceholder
            lucide="ArrowRightIcon"
            tabler="IconArrowRight"
            hugeicons="ArrowRight02Icon"
          />
        </Button>
        <Button size="icon-xs" variant="outline">
          <IconPlaceholder
            lucide="ArrowRightIcon"
            tabler="IconArrowRight"
            hugeicons="ArrowRight02Icon"
          />
        </Button>
        <Button size="icon-xs" variant="ghost">
          <IconPlaceholder
            lucide="ArrowRightIcon"
            tabler="IconArrowRight"
            hugeicons="ArrowRight02Icon"
          />
        </Button>
        <Button size="icon-xs" variant="destructive">
          <IconPlaceholder
            lucide="ArrowRightIcon"
            tabler="IconArrowRight"
            hugeicons="ArrowRight02Icon"
          />
        </Button>
        <Button size="icon-xs" variant="link">
          <IconPlaceholder
            lucide="ArrowRightIcon"
            tabler="IconArrowRight"
            hugeicons="ArrowRight02Icon"
          />
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button size="icon-sm">
          <IconPlaceholder
            lucide="ArrowRightIcon"
            tabler="IconArrowRight"
            hugeicons="ArrowRight02Icon"
          />
        </Button>
        <Button size="icon-sm" variant="secondary">
          <IconPlaceholder
            lucide="ArrowRightIcon"
            tabler="IconArrowRight"
            hugeicons="ArrowRight02Icon"
          />
        </Button>
        <Button size="icon-sm" variant="outline">
          <IconPlaceholder
            lucide="ArrowRightIcon"
            tabler="IconArrowRight"
            hugeicons="ArrowRight02Icon"
          />
        </Button>
        <Button size="icon-sm" variant="ghost">
          <IconPlaceholder
            lucide="ArrowRightIcon"
            tabler="IconArrowRight"
            hugeicons="ArrowRight02Icon"
          />
        </Button>
        <Button size="icon-sm" variant="destructive">
          <IconPlaceholder
            lucide="ArrowRightIcon"
            tabler="IconArrowRight"
            hugeicons="ArrowRight02Icon"
          />
        </Button>
        <Button size="icon-sm" variant="link">
          <IconPlaceholder
            lucide="ArrowRightIcon"
            tabler="IconArrowRight"
            hugeicons="ArrowRight02Icon"
          />
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button size="icon">
          <IconPlaceholder
            lucide="ArrowRightIcon"
            tabler="IconArrowRight"
            hugeicons="ArrowRight02Icon"
          />
        </Button>
        <Button size="icon" variant="secondary">
          <IconPlaceholder
            lucide="ArrowRightIcon"
            tabler="IconArrowRight"
            hugeicons="ArrowRight02Icon"
          />
        </Button>
        <Button size="icon" variant="outline">
          <IconPlaceholder
            lucide="ArrowRightIcon"
            tabler="IconArrowRight"
            hugeicons="ArrowRight02Icon"
          />
        </Button>
        <Button size="icon" variant="ghost">
          <IconPlaceholder
            lucide="ArrowRightIcon"
            tabler="IconArrowRight"
            hugeicons="ArrowRight02Icon"
          />
        </Button>
        <Button size="icon" variant="destructive">
          <IconPlaceholder
            lucide="ArrowRightIcon"
            tabler="IconArrowRight"
            hugeicons="ArrowRight02Icon"
          />
        </Button>
        <Button size="icon" variant="link">
          <IconPlaceholder
            lucide="ArrowRightIcon"
            tabler="IconArrowRight"
            hugeicons="ArrowRight02Icon"
          />
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button size="icon-lg">
          <IconPlaceholder
            lucide="ArrowRightIcon"
            tabler="IconArrowRight"
            hugeicons="ArrowRight02Icon"
          />
        </Button>
        <Button size="icon-lg" variant="secondary">
          <IconPlaceholder
            lucide="ArrowRightIcon"
            tabler="IconArrowRight"
            hugeicons="ArrowRight02Icon"
          />
        </Button>
        <Button size="icon-lg" variant="outline">
          <IconPlaceholder
            lucide="ArrowRightIcon"
            tabler="IconArrowRight"
            hugeicons="ArrowRight02Icon"
          />
        </Button>
        <Button size="icon-lg" variant="ghost">
          <IconPlaceholder
            lucide="ArrowRightIcon"
            tabler="IconArrowRight"
            hugeicons="ArrowRight02Icon"
          />
        </Button>
        <Button size="icon-lg" variant="destructive">
          <IconPlaceholder
            lucide="ArrowRightIcon"
            tabler="IconArrowRight"
            hugeicons="ArrowRight02Icon"
          />
        </Button>
        <Button size="icon-lg" variant="link">
          <IconPlaceholder
            lucide="ArrowRightIcon"
            tabler="IconArrowRight"
            hugeicons="ArrowRight02Icon"
          />
        </Button>
      </div>
    </CanvaFrame>
  )
}

function ButtonExamples() {
  return (
    <CanvaFrame title="Examples">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline">Cancel</Button>
          <Button>
            Submit{" "}
            <IconPlaceholder
              lucide="ArrowRightIcon"
              tabler="IconArrowRight"
              hugeicons="ArrowRight02Icon"
            />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="destructive">Delete</Button>
          <Button size="icon">
            <IconPlaceholder
              lucide="ArrowRightIcon"
              tabler="IconArrowRight"
              hugeicons="ArrowRight02Icon"
            />
          </Button>
        </div>
      </div>
    </CanvaFrame>
  )
}
