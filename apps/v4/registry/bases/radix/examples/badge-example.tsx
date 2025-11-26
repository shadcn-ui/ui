import { CanvaFrame } from "@/components/canva"
import { Badge } from "@/registry/bases/radix/ui/badge"
import { Spinner } from "@/registry/bases/radix/ui/spinner"
import { IconPlaceholder } from "@/app/(design)/design/components/icon-placeholder"

export default function BadgeDemo() {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-6 lg:p-12">
      <div className="flex w-full max-w-lg flex-col gap-12">
        <BadgeVariants />
        <BadgeWithIconLeft />
        <BadgeWithIconRight />
        <BadgeWithSpinner />
        <BadgeAsLink />
        <BadgeLongText />
        <BadgeCustomColors />
      </div>
    </div>
  )
}

function BadgeVariants() {
  return (
    <CanvaFrame title="Variants">
      <div className="flex flex-wrap gap-2">
        <Badge>Default</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="destructive">Destructive</Badge>
        <Badge variant="outline">Outline</Badge>
        <Badge variant="ghost">Ghost</Badge>
        <Badge variant="link">Link</Badge>
      </div>
    </CanvaFrame>
  )
}

function BadgeWithIconLeft() {
  return (
    <CanvaFrame title="Icon Left">
      <div className="flex flex-wrap gap-2">
        <Badge>
          <IconPlaceholder
            lucide="BadgeCheck"
            tabler="IconRosetteDiscountCheck"
            hugeicons="CheckmarkBadge02Icon"
          />
          Default
        </Badge>
        <Badge variant="secondary">
          <IconPlaceholder
            lucide="BadgeCheck"
            tabler="IconRosetteDiscountCheck"
            hugeicons="CheckmarkBadge02Icon"
          />
          Secondary
        </Badge>
        <Badge variant="destructive">
          <IconPlaceholder
            lucide="BadgeCheck"
            tabler="IconRosetteDiscountCheck"
            hugeicons="CheckmarkBadge02Icon"
          />
          Destructive
        </Badge>
        <Badge variant="outline">
          <IconPlaceholder
            lucide="BadgeCheck"
            tabler="IconRosetteDiscountCheck"
            hugeicons="CheckmarkBadge02Icon"
          />
          Outline
        </Badge>
        <Badge variant="ghost">
          <IconPlaceholder
            lucide="BadgeCheck"
            tabler="IconRosetteDiscountCheck"
            hugeicons="CheckmarkBadge02Icon"
          />
          Ghost
        </Badge>
        <Badge variant="link">
          <IconPlaceholder
            lucide="BadgeCheck"
            tabler="IconRosetteDiscountCheck"
            hugeicons="CheckmarkBadge02Icon"
          />
          Link
        </Badge>
      </div>
    </CanvaFrame>
  )
}

function BadgeWithIconRight() {
  return (
    <CanvaFrame title="Icon Right">
      <div className="flex flex-wrap gap-2">
        <Badge>
          Default
          <IconPlaceholder
            lucide="ArrowRightIcon"
            tabler="IconArrowRight"
            hugeicons="ArrowRight02Icon"
          />
        </Badge>
        <Badge variant="secondary">
          Secondary
          <IconPlaceholder
            lucide="ArrowRightIcon"
            tabler="IconArrowRight"
            hugeicons="ArrowRight02Icon"
          />
        </Badge>
        <Badge variant="destructive">
          Destructive
          <IconPlaceholder
            lucide="ArrowRightIcon"
            tabler="IconArrowRight"
            hugeicons="ArrowRight02Icon"
          />
        </Badge>
        <Badge variant="outline">
          Outline
          <IconPlaceholder
            lucide="ArrowRightIcon"
            tabler="IconArrowRight"
            hugeicons="ArrowRight02Icon"
          />
        </Badge>
        <Badge variant="ghost">
          Ghost
          <IconPlaceholder
            lucide="ArrowRightIcon"
            tabler="IconArrowRight"
            hugeicons="ArrowRight02Icon"
          />
        </Badge>
        <Badge variant="link">
          Link
          <IconPlaceholder
            lucide="ArrowRightIcon"
            tabler="IconArrowRight"
            hugeicons="ArrowRight02Icon"
          />
        </Badge>
      </div>
    </CanvaFrame>
  )
}

function BadgeWithSpinner() {
  return (
    <CanvaFrame title="With Spinner">
      <div className="flex flex-wrap gap-2">
        <Badge>
          <Spinner />
          Default
        </Badge>
        <Badge variant="secondary">
          <Spinner />
          Secondary
        </Badge>
        <Badge variant="destructive">
          <Spinner />
          Destructive
        </Badge>
        <Badge variant="outline">
          <Spinner />
          Outline
        </Badge>
        <Badge variant="ghost">
          <Spinner />
          Ghost
        </Badge>
        <Badge variant="link">
          <Spinner />
          Link
        </Badge>
      </div>
    </CanvaFrame>
  )
}

function BadgeAsLink() {
  return (
    <CanvaFrame title="asChild">
      <div className="flex flex-wrap gap-2">
        <Badge asChild>
          <a href="#">
            Link{" "}
            <IconPlaceholder
              lucide="ArrowUpRightIcon"
              tabler="IconArrowUpRight"
              hugeicons="ArrowUpRightIcon"
            />
          </a>
        </Badge>
        <Badge asChild variant="secondary">
          <a href="#">
            Link{" "}
            <IconPlaceholder
              lucide="ArrowUpRightIcon"
              tabler="IconArrowUpRight"
              hugeicons="ArrowUpRightIcon"
            />
          </a>
        </Badge>
        <Badge asChild variant="destructive">
          <a href="#">
            Link{" "}
            <IconPlaceholder
              lucide="ArrowUpRightIcon"
              tabler="IconArrowUpRight"
              hugeicons="ArrowUpRightIcon"
            />
          </a>
        </Badge>
        <Badge asChild variant="outline">
          <a href="#">
            Link{" "}
            <IconPlaceholder
              lucide="ArrowUpRightIcon"
              tabler="IconArrowUpRight"
              hugeicons="ArrowUpRightIcon"
            />
          </a>
        </Badge>
        <Badge asChild variant="ghost">
          <a href="#">
            Link{" "}
            <IconPlaceholder
              lucide="ArrowUpRightIcon"
              tabler="IconArrowRight"
              hugeicons="ArrowRight02Icon"
            />
          </a>
        </Badge>
        <Badge asChild variant="link">
          <a href="#">
            Link{" "}
            <IconPlaceholder
              lucide="ArrowUpRightIcon"
              tabler="IconArrowUpRight"
              hugeicons="ArrowRight02Icon"
            />
          </a>
        </Badge>
      </div>
    </CanvaFrame>
  )
}

function BadgeLongText() {
  return (
    <CanvaFrame title="Long Text">
      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary">
          A badge with a lot of text to see how it wraps
        </Badge>
      </div>
    </CanvaFrame>
  )
}

function BadgeCustomColors() {
  return (
    <CanvaFrame title="Custom Colors">
      <div className="flex flex-wrap gap-2">
        <Badge className="bg-blue-600 text-blue-50 dark:bg-blue-600 dark:text-blue-50">
          Blue
        </Badge>
        <Badge className="bg-green-600 text-green-50 dark:bg-green-600 dark:text-green-50">
          Green
        </Badge>
        <Badge className="bg-sky-600 text-sky-50 dark:bg-sky-600 dark:text-sky-50">
          Sky
        </Badge>
        <Badge className="bg-purple-600 text-purple-50 dark:bg-purple-600 dark:text-purple-50">
          Purple
        </Badge>
        <Badge className="bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
          Blue
        </Badge>
        <Badge className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">
          Green
        </Badge>
        <Badge className="bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300">
          Sky
        </Badge>
        <Badge className="bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
          Purple
        </Badge>
        <Badge className="bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300">
          Red
        </Badge>
      </div>
    </CanvaFrame>
  )
}
