import {
  Example,
  ExampleWrapper,
} from "@/registry/bases/base/components/example"
import { Button } from "@/registry/bases/base/ui/button"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function ButtonExample() {
  return (
    <ExampleWrapper className="lg:grid-cols-1 2xl:grid-cols-1">
      <ButtonVariantsAndSizes />
      <ButtonIconRight />
      <ButtonIconLeft />
      <ButtonIconOnly />
      <ButtonInvalidStates />
      <ButtonExamples />
    </ExampleWrapper>
  )
}

function ButtonVariantsAndSizes() {
  return (
    <Example title="Variants & Sizes">
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
    </Example>
  )
}

function ButtonIconRight() {
  return (
    <Example title="Icon Right">
      <div className="flex flex-wrap items-center gap-2">
        <Button size="xs">
          Default{" "}
          <IconPlaceholder
            lucide="ArrowRightIcon"
            tabler="IconArrowRight"
            hugeicons="ArrowRight02Icon"
            phosphor="ArrowRightIcon"
            remixicon="RiArrowRightLine"
            data-icon="inline-end"
          />
        </Button>
        <Button size="xs" variant="secondary">
          Secondary{" "}
          <IconPlaceholder
            lucide="ArrowRightIcon"
            tabler="IconArrowRight"
            hugeicons="ArrowRight02Icon"
            phosphor="ArrowRightIcon"
            remixicon="RiArrowRightLine"
            data-icon="inline-end"
          />
        </Button>
        <Button size="xs" variant="outline">
          Outline{" "}
          <IconPlaceholder
            lucide="ArrowRightIcon"
            tabler="IconArrowRight"
            hugeicons="ArrowRight02Icon"
            phosphor="ArrowRightIcon"
            remixicon="RiArrowRightLine"
            data-icon="inline-end"
          />
        </Button>
        <Button size="xs" variant="ghost">
          Ghost{" "}
          <IconPlaceholder
            lucide="ArrowRightIcon"
            tabler="IconArrowRight"
            hugeicons="ArrowRight02Icon"
            phosphor="ArrowRightIcon"
            remixicon="RiArrowRightLine"
            data-icon="inline-end"
          />
        </Button>
        <Button size="xs" variant="destructive">
          Destructive{" "}
          <IconPlaceholder
            lucide="ArrowRightIcon"
            tabler="IconArrowRight"
            hugeicons="ArrowRight02Icon"
            phosphor="ArrowRightIcon"
            remixicon="RiArrowRightLine"
            data-icon="inline-end"
          />
        </Button>
        <Button size="xs" variant="link">
          Link{" "}
          <IconPlaceholder
            lucide="ArrowRightIcon"
            tabler="IconArrowRight"
            hugeicons="ArrowRight02Icon"
            phosphor="ArrowRightIcon"
            remixicon="RiArrowRightLine"
            data-icon="inline-end"
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
            phosphor="ArrowRightIcon"
            remixicon="RiArrowRightLine"
            data-icon="inline-end"
          />
        </Button>
        <Button size="sm" variant="secondary">
          Secondary{" "}
          <IconPlaceholder
            lucide="ArrowRightIcon"
            tabler="IconArrowRight"
            hugeicons="ArrowRight02Icon"
            phosphor="ArrowRightIcon"
            remixicon="RiArrowRightLine"
            data-icon="inline-end"
          />
        </Button>
        <Button size="sm" variant="outline">
          Outline{" "}
          <IconPlaceholder
            lucide="ArrowRightIcon"
            tabler="IconArrowRight"
            hugeicons="ArrowRight02Icon"
            phosphor="ArrowRightIcon"
            remixicon="RiArrowRightLine"
          />
        </Button>
        <Button size="sm" variant="ghost">
          Ghost{" "}
          <IconPlaceholder
            lucide="ArrowRightIcon"
            tabler="IconArrowRight"
            hugeicons="ArrowRight02Icon"
            phosphor="ArrowRightIcon"
            remixicon="RiArrowRightLine"
            data-icon="inline-end"
          />
        </Button>
        <Button size="sm" variant="destructive">
          Destructive{" "}
          <IconPlaceholder
            lucide="ArrowRightIcon"
            tabler="IconArrowRight"
            hugeicons="ArrowRight02Icon"
            phosphor="ArrowRightIcon"
            remixicon="RiArrowRightLine"
            data-icon="inline-end"
          />
        </Button>
        <Button size="sm" variant="link">
          Link{" "}
          <IconPlaceholder
            lucide="ArrowRightIcon"
            tabler="IconArrowRight"
            hugeicons="ArrowRight02Icon"
            phosphor="ArrowRightIcon"
            remixicon="RiArrowRightLine"
            data-icon="inline-end"
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
            phosphor="ArrowRightIcon"
            remixicon="RiArrowRightLine"
            data-icon="inline-end"
          />
        </Button>
        <Button variant="secondary">
          Secondary{" "}
          <IconPlaceholder
            lucide="ArrowRightIcon"
            tabler="IconArrowRight"
            hugeicons="ArrowRight02Icon"
            phosphor="ArrowRightIcon"
            remixicon="RiArrowRightLine"
            data-icon="inline-end"
          />
        </Button>
        <Button variant="outline">
          Outline{" "}
          <IconPlaceholder
            lucide="ArrowRightIcon"
            tabler="IconArrowRight"
            hugeicons="ArrowRight02Icon"
            phosphor="ArrowRightIcon"
            remixicon="RiArrowRightLine"
            data-icon="inline-end"
          />
        </Button>
        <Button variant="ghost">
          Ghost{" "}
          <IconPlaceholder
            lucide="ArrowRightIcon"
            tabler="IconArrowRight"
            hugeicons="ArrowRight02Icon"
            phosphor="ArrowRightIcon"
            remixicon="RiArrowRightLine"
            data-icon="inline-end"
          />
        </Button>
        <Button variant="destructive">
          Destructive{" "}
          <IconPlaceholder
            lucide="ArrowRightIcon"
            tabler="IconArrowRight"
            hugeicons="ArrowRight02Icon"
            phosphor="ArrowRightIcon"
            remixicon="RiArrowRightLine"
            data-icon="inline-end"
          />
        </Button>
        <Button variant="link">
          Link{" "}
          <IconPlaceholder
            lucide="ArrowRightIcon"
            tabler="IconArrowRight"
            hugeicons="ArrowRight02Icon"
            phosphor="ArrowRightIcon"
            remixicon="RiArrowRightLine"
            data-icon="inline-end"
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
            phosphor="ArrowRightIcon"
            remixicon="RiArrowRightLine"
            data-icon="inline-end"
          />
        </Button>
        <Button size="lg" variant="secondary">
          Secondary{" "}
          <IconPlaceholder
            lucide="ArrowRightIcon"
            tabler="IconArrowRight"
            hugeicons="ArrowRight02Icon"
            phosphor="ArrowRightIcon"
            remixicon="RiArrowRightLine"
            data-icon="inline-end"
          />
        </Button>
        <Button size="lg" variant="outline">
          Outline{" "}
          <IconPlaceholder
            lucide="ArrowRightIcon"
            tabler="IconArrowRight"
            hugeicons="ArrowRight02Icon"
            phosphor="ArrowRightIcon"
            remixicon="RiArrowRightLine"
            data-icon="inline-end"
          />
        </Button>
        <Button size="lg" variant="ghost">
          Ghost{" "}
          <IconPlaceholder
            lucide="ArrowRightIcon"
            tabler="IconArrowRight"
            hugeicons="ArrowRight02Icon"
            phosphor="ArrowRightIcon"
            remixicon="RiArrowRightLine"
            data-icon="inline-end"
          />
        </Button>
        <Button size="lg" variant="destructive">
          Destructive{" "}
          <IconPlaceholder
            lucide="ArrowRightIcon"
            tabler="IconArrowRight"
            hugeicons="ArrowRight02Icon"
            phosphor="ArrowRightIcon"
            remixicon="RiArrowRightLine"
            data-icon="inline-end"
          />
        </Button>
        <Button size="lg" variant="link">
          Link{" "}
          <IconPlaceholder
            lucide="ArrowRightIcon"
            tabler="IconArrowRight"
            hugeicons="ArrowRight02Icon"
            phosphor="ArrowRightIcon"
            remixicon="RiArrowRightLine"
            data-icon="inline-end"
          />
        </Button>
      </div>
    </Example>
  )
}

function ButtonIconLeft() {
  return (
    <Example title="Icon Left">
      <div className="flex flex-wrap items-center gap-2">
        <Button size="xs">
          <IconPlaceholder
            lucide="ArrowLeftCircleIcon"
            hugeicons="CircleArrowLeft02Icon"
            tabler="IconCircleArrowLeft"
            phosphor="ArrowCircleLeftIcon"
            remixicon="RiArrowLeftCircleLine"
            data-icon="inline-start"
          />{" "}
          Default
        </Button>
        <Button size="xs" variant="secondary">
          <IconPlaceholder
            lucide="ArrowLeftCircleIcon"
            hugeicons="CircleArrowLeft02Icon"
            tabler="IconCircleArrowLeft"
            phosphor="ArrowCircleLeftIcon"
            remixicon="RiArrowLeftCircleLine"
            data-icon="inline-start"
          />{" "}
          Secondary
        </Button>
        <Button size="xs" variant="outline">
          <IconPlaceholder
            lucide="ArrowLeftCircleIcon"
            hugeicons="CircleArrowLeft02Icon"
            tabler="IconCircleArrowLeft"
            phosphor="ArrowCircleLeftIcon"
            remixicon="RiArrowLeftCircleLine"
            data-icon="inline-start"
          />{" "}
          Outline
        </Button>
        <Button size="xs" variant="ghost">
          <IconPlaceholder
            lucide="ArrowLeftCircleIcon"
            hugeicons="CircleArrowLeft02Icon"
            tabler="IconCircleArrowLeft"
            phosphor="ArrowCircleLeftIcon"
            remixicon="RiArrowLeftCircleLine"
            data-icon="inline-start"
          />{" "}
          Ghost
        </Button>
        <Button size="xs" variant="destructive">
          <IconPlaceholder
            lucide="ArrowLeftCircleIcon"
            hugeicons="CircleArrowLeft02Icon"
            tabler="IconCircleArrowLeft"
            phosphor="ArrowCircleLeftIcon"
            remixicon="RiArrowLeftCircleLine"
            data-icon="inline-start"
          />{" "}
          Destructive
        </Button>
        <Button size="xs" variant="link">
          <IconPlaceholder
            lucide="ArrowLeftCircleIcon"
            hugeicons="CircleArrowLeft02Icon"
            tabler="IconCircleArrowLeft"
            phosphor="ArrowCircleLeftIcon"
            remixicon="RiArrowLeftCircleLine"
            data-icon="inline-start"
          />{" "}
          Link
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm">
          <IconPlaceholder
            lucide="ArrowLeftCircleIcon"
            hugeicons="CircleArrowLeft02Icon"
            tabler="IconCircleArrowLeft"
            phosphor="ArrowCircleLeftIcon"
            remixicon="RiArrowLeftCircleLine"
            data-icon="inline-start"
          />{" "}
          Default
        </Button>
        <Button size="sm" variant="secondary">
          <IconPlaceholder
            lucide="ArrowLeftCircleIcon"
            hugeicons="CircleArrowLeft02Icon"
            tabler="IconCircleArrowLeft"
            phosphor="ArrowCircleLeftIcon"
            remixicon="RiArrowLeftCircleLine"
            data-icon="inline-start"
          />{" "}
          Secondary
        </Button>
        <Button size="sm" variant="outline">
          <IconPlaceholder
            lucide="ArrowLeftCircleIcon"
            hugeicons="CircleArrowLeft02Icon"
            tabler="IconCircleArrowLeft"
            phosphor="ArrowCircleLeftIcon"
            remixicon="RiArrowLeftCircleLine"
            data-icon="inline-start"
          />{" "}
          Outline
        </Button>
        <Button size="sm" variant="ghost">
          <IconPlaceholder
            lucide="ArrowLeftCircleIcon"
            hugeicons="CircleArrowLeft02Icon"
            tabler="IconCircleArrowLeft"
            phosphor="ArrowCircleLeftIcon"
            remixicon="RiArrowLeftCircleLine"
            data-icon="inline-start"
          />{" "}
          Ghost
        </Button>
        <Button size="sm" variant="destructive">
          <IconPlaceholder
            lucide="ArrowLeftCircleIcon"
            hugeicons="CircleArrowLeft02Icon"
            tabler="IconCircleArrowLeft"
            phosphor="ArrowCircleLeftIcon"
            remixicon="RiArrowLeftCircleLine"
            data-icon="inline-start"
          />{" "}
          Destructive
        </Button>
        <Button size="sm" variant="link">
          <IconPlaceholder
            lucide="ArrowLeftCircleIcon"
            hugeicons="CircleArrowLeft02Icon"
            tabler="IconCircleArrowLeft"
            phosphor="ArrowCircleLeftIcon"
            remixicon="RiArrowLeftCircleLine"
            data-icon="inline-start"
          />{" "}
          Link
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button>
          <IconPlaceholder
            lucide="ArrowLeftCircleIcon"
            hugeicons="CircleArrowLeft02Icon"
            tabler="IconCircleArrowLeft"
            phosphor="ArrowCircleLeftIcon"
            remixicon="RiArrowLeftCircleLine"
            data-icon="inline-start"
          />{" "}
          Default
        </Button>
        <Button variant="secondary">
          <IconPlaceholder
            lucide="ArrowLeftCircleIcon"
            hugeicons="CircleArrowLeft02Icon"
            tabler="IconCircleArrowLeft"
            phosphor="ArrowCircleLeftIcon"
            remixicon="RiArrowLeftCircleLine"
            data-icon="inline-start"
          />{" "}
          Secondary
        </Button>
        <Button variant="outline">
          <IconPlaceholder
            lucide="ArrowLeftCircleIcon"
            hugeicons="CircleArrowLeft02Icon"
            tabler="IconCircleArrowLeft"
            phosphor="ArrowCircleLeftIcon"
            remixicon="RiArrowLeftCircleLine"
            data-icon="inline-start"
          />{" "}
          Outline
        </Button>
        <Button variant="ghost">
          <IconPlaceholder
            lucide="ArrowLeftCircleIcon"
            hugeicons="CircleArrowLeft02Icon"
            tabler="IconCircleArrowLeft"
            phosphor="ArrowCircleLeftIcon"
            remixicon="RiArrowLeftCircleLine"
            data-icon="inline-start"
          />{" "}
          Ghost
        </Button>
        <Button variant="destructive">
          <IconPlaceholder
            lucide="ArrowLeftCircleIcon"
            hugeicons="CircleArrowLeft02Icon"
            tabler="IconCircleArrowLeft"
            phosphor="ArrowCircleLeftIcon"
            remixicon="RiArrowLeftCircleLine"
            data-icon="inline-start"
          />{" "}
          Destructive
        </Button>
        <Button variant="link">
          <IconPlaceholder
            lucide="ArrowLeftCircleIcon"
            hugeicons="CircleArrowLeft02Icon"
            tabler="IconCircleArrowLeft"
            phosphor="ArrowCircleLeftIcon"
            remixicon="RiArrowLeftCircleLine"
            data-icon="inline-start"
          />{" "}
          Link
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button size="lg">
          <IconPlaceholder
            lucide="ArrowLeftCircleIcon"
            hugeicons="CircleArrowLeft02Icon"
            tabler="IconCircleArrowLeft"
            phosphor="ArrowCircleLeftIcon"
            remixicon="RiArrowLeftCircleLine"
            data-icon="inline-start"
          />{" "}
          Default
        </Button>
        <Button size="lg" variant="secondary">
          <IconPlaceholder
            lucide="ArrowLeftCircleIcon"
            hugeicons="CircleArrowLeft02Icon"
            tabler="IconCircleArrowLeft"
            phosphor="ArrowCircleLeftIcon"
            remixicon="RiArrowLeftCircleLine"
            data-icon="inline-start"
          />{" "}
          Secondary
        </Button>
        <Button size="lg" variant="outline">
          <IconPlaceholder
            lucide="ArrowLeftCircleIcon"
            hugeicons="CircleArrowLeft02Icon"
            tabler="IconCircleArrowLeft"
            phosphor="ArrowCircleLeftIcon"
            remixicon="RiArrowLeftCircleLine"
            data-icon="inline-start"
          />{" "}
          Outline
        </Button>
        <Button size="lg" variant="ghost">
          <IconPlaceholder
            lucide="ArrowLeftCircleIcon"
            hugeicons="CircleArrowLeft02Icon"
            tabler="IconCircleArrowLeft"
            phosphor="ArrowCircleLeftIcon"
            remixicon="RiArrowLeftCircleLine"
            data-icon="inline-start"
          />{" "}
          Ghost
        </Button>
        <Button size="lg" variant="destructive">
          <IconPlaceholder
            lucide="ArrowLeftCircleIcon"
            hugeicons="CircleArrowLeft02Icon"
            tabler="IconCircleArrowLeft"
            phosphor="ArrowCircleLeftIcon"
            remixicon="RiArrowLeftCircleLine"
            data-icon="inline-start"
          />{" "}
          Destructive
        </Button>
        <Button size="lg" variant="link">
          <IconPlaceholder
            lucide="ArrowLeftCircleIcon"
            hugeicons="CircleArrowLeft02Icon"
            tabler="IconCircleArrowLeft"
            phosphor="ArrowCircleLeftIcon"
            remixicon="RiArrowLeftCircleLine"
            data-icon="inline-start"
          />{" "}
          Link
        </Button>
      </div>
    </Example>
  )
}

function ButtonIconOnly() {
  return (
    <Example title="Icon Only">
      <div className="flex flex-wrap items-center gap-2">
        <Button size="icon-xs">
          <IconPlaceholder
            lucide="ArrowRightIcon"
            tabler="IconArrowRight"
            hugeicons="ArrowRight02Icon"
            phosphor="ArrowRightIcon"
            remixicon="RiArrowRightLine"
          />
        </Button>
        <Button size="icon-xs" variant="secondary">
          <IconPlaceholder
            lucide="ArrowRightIcon"
            tabler="IconArrowRight"
            hugeicons="ArrowRight02Icon"
            phosphor="ArrowRightIcon"
            remixicon="RiArrowRightLine"
          />
        </Button>
        <Button size="icon-xs" variant="outline">
          <IconPlaceholder
            lucide="ArrowRightIcon"
            tabler="IconArrowRight"
            hugeicons="ArrowRight02Icon"
            phosphor="ArrowRightIcon"
            remixicon="RiArrowRightLine"
          />
        </Button>
        <Button size="icon-xs" variant="ghost">
          <IconPlaceholder
            lucide="ArrowRightIcon"
            tabler="IconArrowRight"
            hugeicons="ArrowRight02Icon"
            phosphor="ArrowRightIcon"
            remixicon="RiArrowRightLine"
          />
        </Button>
        <Button size="icon-xs" variant="destructive">
          <IconPlaceholder
            lucide="ArrowRightIcon"
            tabler="IconArrowRight"
            hugeicons="ArrowRight02Icon"
            phosphor="ArrowRightIcon"
            remixicon="RiArrowRightLine"
          />
        </Button>
        <Button size="icon-xs" variant="link">
          <IconPlaceholder
            lucide="ArrowRightIcon"
            tabler="IconArrowRight"
            hugeicons="ArrowRight02Icon"
            phosphor="ArrowRightIcon"
            remixicon="RiArrowRightLine"
          />
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button size="icon-sm">
          <IconPlaceholder
            lucide="ArrowRightIcon"
            tabler="IconArrowRight"
            hugeicons="ArrowRight02Icon"
            phosphor="ArrowRightIcon"
            remixicon="RiArrowRightLine"
          />
        </Button>
        <Button size="icon-sm" variant="secondary">
          <IconPlaceholder
            lucide="ArrowRightIcon"
            tabler="IconArrowRight"
            hugeicons="ArrowRight02Icon"
            phosphor="ArrowRightIcon"
            remixicon="RiArrowRightLine"
          />
        </Button>
        <Button size="icon-sm" variant="outline">
          <IconPlaceholder
            lucide="ArrowRightIcon"
            tabler="IconArrowRight"
            hugeicons="ArrowRight02Icon"
            phosphor="ArrowRightIcon"
            remixicon="RiArrowRightLine"
          />
        </Button>
        <Button size="icon-sm" variant="ghost">
          <IconPlaceholder
            lucide="ArrowRightIcon"
            tabler="IconArrowRight"
            hugeicons="ArrowRight02Icon"
            phosphor="ArrowRightIcon"
            remixicon="RiArrowRightLine"
          />
        </Button>
        <Button size="icon-sm" variant="destructive">
          <IconPlaceholder
            lucide="ArrowRightIcon"
            tabler="IconArrowRight"
            hugeicons="ArrowRight02Icon"
            phosphor="ArrowRightIcon"
            remixicon="RiArrowRightLine"
          />
        </Button>
        <Button size="icon-sm" variant="link">
          <IconPlaceholder
            lucide="ArrowRightIcon"
            tabler="IconArrowRight"
            hugeicons="ArrowRight02Icon"
            phosphor="ArrowRightIcon"
            remixicon="RiArrowRightLine"
          />
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button size="icon">
          <IconPlaceholder
            lucide="ArrowRightIcon"
            tabler="IconArrowRight"
            hugeicons="ArrowRight02Icon"
            phosphor="ArrowRightIcon"
            remixicon="RiArrowRightLine"
          />
        </Button>
        <Button size="icon" variant="secondary">
          <IconPlaceholder
            lucide="ArrowRightIcon"
            tabler="IconArrowRight"
            hugeicons="ArrowRight02Icon"
            phosphor="ArrowRightIcon"
            remixicon="RiArrowRightLine"
          />
        </Button>
        <Button size="icon" variant="outline">
          <IconPlaceholder
            lucide="ArrowRightIcon"
            tabler="IconArrowRight"
            hugeicons="ArrowRight02Icon"
            phosphor="ArrowRightIcon"
            remixicon="RiArrowRightLine"
          />
        </Button>
        <Button size="icon" variant="ghost">
          <IconPlaceholder
            lucide="ArrowRightIcon"
            tabler="IconArrowRight"
            hugeicons="ArrowRight02Icon"
            phosphor="ArrowRightIcon"
            remixicon="RiArrowRightLine"
          />
        </Button>
        <Button size="icon" variant="destructive">
          <IconPlaceholder
            lucide="ArrowRightIcon"
            tabler="IconArrowRight"
            hugeicons="ArrowRight02Icon"
            phosphor="ArrowRightIcon"
            remixicon="RiArrowRightLine"
          />
        </Button>
        <Button size="icon" variant="link">
          <IconPlaceholder
            lucide="ArrowRightIcon"
            tabler="IconArrowRight"
            hugeicons="ArrowRight02Icon"
            phosphor="ArrowRightIcon"
            remixicon="RiArrowRightLine"
          />
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button size="icon-lg">
          <IconPlaceholder
            lucide="ArrowRightIcon"
            tabler="IconArrowRight"
            hugeicons="ArrowRight02Icon"
            phosphor="ArrowRightIcon"
            remixicon="RiArrowRightLine"
          />
        </Button>
        <Button size="icon-lg" variant="secondary">
          <IconPlaceholder
            lucide="ArrowRightIcon"
            tabler="IconArrowRight"
            hugeicons="ArrowRight02Icon"
            phosphor="ArrowRightIcon"
            remixicon="RiArrowRightLine"
          />
        </Button>
        <Button size="icon-lg" variant="outline">
          <IconPlaceholder
            lucide="ArrowRightIcon"
            tabler="IconArrowRight"
            hugeicons="ArrowRight02Icon"
            phosphor="ArrowRightIcon"
            remixicon="RiArrowRightLine"
          />
        </Button>
        <Button size="icon-lg" variant="ghost">
          <IconPlaceholder
            lucide="ArrowRightIcon"
            tabler="IconArrowRight"
            hugeicons="ArrowRight02Icon"
            phosphor="ArrowRightIcon"
            remixicon="RiArrowRightLine"
          />
        </Button>
        <Button size="icon-lg" variant="destructive">
          <IconPlaceholder
            lucide="ArrowRightIcon"
            tabler="IconArrowRight"
            hugeicons="ArrowRight02Icon"
            phosphor="ArrowRightIcon"
            remixicon="RiArrowRightLine"
          />
        </Button>
        <Button size="icon-lg" variant="link">
          <IconPlaceholder
            lucide="ArrowRightIcon"
            tabler="IconArrowRight"
            hugeicons="ArrowRight02Icon"
            phosphor="ArrowRightIcon"
            remixicon="RiArrowRightLine"
          />
        </Button>
      </div>
    </Example>
  )
}

function ButtonExamples() {
  return (
    <Example title="Examples">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline">Cancel</Button>
          <Button>
            Submit{" "}
            <IconPlaceholder
              lucide="ArrowRightIcon"
              tabler="IconArrowRight"
              hugeicons="ArrowRight02Icon"
              phosphor="ArrowRightIcon"
              remixicon="RiArrowRightLine"
              data-icon="inline-end"
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
              phosphor="ArrowRightIcon"
              remixicon="RiArrowRightLine"
              data-icon="inline-end"
            />
          </Button>
        </div>
        <Button render={<a href="#" />} nativeButton={false}>
          Link
        </Button>
      </div>
    </Example>
  )
}

function ButtonInvalidStates() {
  return (
    <Example title="Invalid States">
      <div className="flex flex-wrap items-center gap-2">
        <Button size="xs" aria-invalid="true">
          Default
        </Button>
        <Button size="xs" variant="secondary" aria-invalid="true">
          Secondary
        </Button>
        <Button size="xs" variant="outline" aria-invalid="true">
          Outline
        </Button>
        <Button size="xs" variant="ghost" aria-invalid="true">
          Ghost
        </Button>
        <Button size="xs" variant="destructive" aria-invalid="true">
          Destructive
        </Button>
        <Button size="xs" variant="link" aria-invalid="true">
          Link
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm" aria-invalid="true">
          Default
        </Button>
        <Button size="sm" variant="secondary" aria-invalid="true">
          Secondary
        </Button>
        <Button size="sm" variant="outline" aria-invalid="true">
          Outline
        </Button>
        <Button size="sm" variant="ghost" aria-invalid="true">
          Ghost
        </Button>
        <Button size="sm" variant="destructive" aria-invalid="true">
          Destructive
        </Button>
        <Button size="sm" variant="link" aria-invalid="true">
          Link
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button aria-invalid="true">Default</Button>
        <Button variant="secondary" aria-invalid="true">
          Secondary
        </Button>
        <Button variant="outline" aria-invalid="true">
          Outline
        </Button>
        <Button variant="ghost" aria-invalid="true">
          Ghost
        </Button>
        <Button variant="destructive" aria-invalid="true">
          Destructive
        </Button>
        <Button variant="link" aria-invalid="true">
          Link
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button size="lg" aria-invalid="true">
          Default
        </Button>
        <Button size="lg" variant="secondary" aria-invalid="true">
          Secondary
        </Button>
        <Button size="lg" variant="outline" aria-invalid="true">
          Outline
        </Button>
        <Button size="lg" variant="ghost" aria-invalid="true">
          Ghost
        </Button>
        <Button size="lg" variant="destructive" aria-invalid="true">
          Destructive
        </Button>
        <Button size="lg" variant="link" aria-invalid="true">
          Link
        </Button>
      </div>
    </Example>
  )
}
