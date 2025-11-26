import { CanvaFrame } from "@/components/canva"
import { Button } from "@/registry/bases/radix/ui/button"
import { Toggle } from "@/registry/bases/radix/ui/toggle"
import { IconPlaceholder } from "@/app/(design)/design/components/icon-placeholder"

export default function ToggleExample() {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-6 lg:p-12">
      <div className="flex w-full max-w-lg flex-col gap-12">
        <ToggleBasic />
        <ToggleOutline />
        <ToggleSizes />
        <ToggleWithButtonText />
        <ToggleWithButtonIcon />
        <ToggleWithButtonIconText />
        <ToggleDisabled />
        <ToggleWithIcon />
      </div>
    </div>
  )
}

function ToggleBasic() {
  return (
    <CanvaFrame title="Basic">
      <div className="flex flex-wrap items-center gap-2">
        <Toggle aria-label="Toggle bold" defaultPressed>
          <IconPlaceholder
            lucide="BoldIcon"
            tabler="IconBold"
            hugeicons="TextBoldIcon"
          />
        </Toggle>
        <Toggle aria-label="Toggle italic">
          <IconPlaceholder
            lucide="ItalicIcon"
            tabler="IconItalic"
            hugeicons="TextItalicIcon"
          />
        </Toggle>
        <Toggle aria-label="Toggle underline">
          <IconPlaceholder
            lucide="UnderlineIcon"
            tabler="IconUnderline"
            hugeicons="TextUnderlineIcon"
          />
        </Toggle>
      </div>
    </CanvaFrame>
  )
}

function ToggleOutline() {
  return (
    <CanvaFrame title="Outline">
      <div className="flex flex-wrap items-center gap-2">
        <Toggle variant="outline" aria-label="Toggle italic">
          <IconPlaceholder
            lucide="ItalicIcon"
            tabler="IconItalic"
            hugeicons="TextItalicIcon"
          />
          Italic
        </Toggle>
        <Toggle variant="outline" aria-label="Toggle bold">
          <IconPlaceholder
            lucide="BoldIcon"
            tabler="IconBold"
            hugeicons="TextBoldIcon"
          />
          Bold
        </Toggle>
      </div>
    </CanvaFrame>
  )
}

function ToggleSizes() {
  return (
    <CanvaFrame title="Sizes">
      <div className="flex flex-wrap items-center gap-2">
        <Toggle variant="outline" aria-label="Toggle small" size="sm">
          Small
        </Toggle>
        <Toggle variant="outline" aria-label="Toggle default" size="default">
          Default
        </Toggle>
        <Toggle variant="outline" aria-label="Toggle large" size="lg">
          Large
        </Toggle>
      </div>
    </CanvaFrame>
  )
}

function ToggleWithButtonText() {
  return (
    <CanvaFrame title="With Button Text">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline">
            Button
          </Button>
          <Toggle variant="outline" aria-label="Toggle sm" size="sm">
            Toggle
          </Toggle>
        </div>
        <div className="flex items-center gap-2">
          <Button size="default" variant="outline">
            Button
          </Button>
          <Toggle variant="outline" aria-label="Toggle default" size="default">
            Toggle
          </Toggle>
        </div>
        <div className="flex items-center gap-2">
          <Button size="lg" variant="outline">
            Button
          </Button>
          <Toggle variant="outline" aria-label="Toggle lg" size="lg">
            Toggle
          </Toggle>
        </div>
      </div>
    </CanvaFrame>
  )
}

function ToggleWithButtonIcon() {
  return (
    <CanvaFrame title="With Button Icon">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon-sm">
            <IconPlaceholder
              lucide="BoldIcon"
              tabler="IconBold"
              hugeicons="TextBoldIcon"
            />
          </Button>
          <Toggle variant="outline" aria-label="Toggle sm icon" size="sm">
            <IconPlaceholder
              lucide="BoldIcon"
              tabler="IconBold"
              hugeicons="TextBoldIcon"
            />
          </Toggle>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon">
            <IconPlaceholder
              lucide="ItalicIcon"
              tabler="IconItalic"
              hugeicons="TextItalicIcon"
            />
          </Button>
          <Toggle
            variant="outline"
            aria-label="Toggle default icon"
            size="default"
          >
            <IconPlaceholder
              lucide="ItalicIcon"
              tabler="IconItalic"
              hugeicons="TextItalicIcon"
            />
          </Toggle>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon-lg">
            <IconPlaceholder
              lucide="UnderlineIcon"
              tabler="IconUnderline"
              hugeicons="TextUnderlineIcon"
            />
          </Button>
          <Toggle variant="outline" aria-label="Toggle lg icon" size="lg">
            <IconPlaceholder
              lucide="UnderlineIcon"
              tabler="IconUnderline"
              hugeicons="TextUnderlineIcon"
            />
          </Toggle>
        </div>
      </div>
    </CanvaFrame>
  )
}

function ToggleWithButtonIconText() {
  return (
    <CanvaFrame title="With Button Icon + Text">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline">
            <IconPlaceholder
              lucide="BoldIcon"
              tabler="IconBold"
              hugeicons="TextBoldIcon"
              data-slot="icon-inline-start"
            />
            Button
          </Button>
          <Toggle variant="outline" aria-label="Toggle sm icon text" size="sm">
            <IconPlaceholder
              lucide="BoldIcon"
              tabler="IconBold"
              hugeicons="TextBoldIcon"
            />
            Toggle
          </Toggle>
        </div>
        <div className="flex items-center gap-2">
          <Button size="default" variant="outline">
            <IconPlaceholder
              lucide="ItalicIcon"
              tabler="IconItalic"
              hugeicons="TextItalicIcon"
              data-slot="icon-inline-start"
            />
            Button
          </Button>
          <Toggle
            variant="outline"
            aria-label="Toggle default icon text"
            size="default"
          >
            <IconPlaceholder
              lucide="ItalicIcon"
              tabler="IconItalic"
              hugeicons="TextItalicIcon"
            />
            Toggle
          </Toggle>
        </div>
        <div className="flex items-center gap-2">
          <Button size="lg" variant="outline">
            <IconPlaceholder
              lucide="UnderlineIcon"
              tabler="IconUnderline"
              hugeicons="TextUnderlineIcon"
              data-slot="icon-inline-start"
            />
            Button
          </Button>
          <Toggle variant="outline" aria-label="Toggle lg icon text" size="lg">
            <IconPlaceholder
              lucide="UnderlineIcon"
              tabler="IconUnderline"
              hugeicons="TextUnderlineIcon"
            />
            Toggle
          </Toggle>
        </div>
      </div>
    </CanvaFrame>
  )
}

function ToggleDisabled() {
  return (
    <CanvaFrame title="Disabled">
      <div className="flex flex-wrap items-center gap-2">
        <Toggle aria-label="Toggle disabled" disabled>
          Disabled
        </Toggle>
        <Toggle variant="outline" aria-label="Toggle disabled outline" disabled>
          Disabled
        </Toggle>
      </div>
    </CanvaFrame>
  )
}

function ToggleWithIcon() {
  return (
    <CanvaFrame title="With Icon">
      <div className="flex flex-wrap items-center gap-2">
        <Toggle aria-label="Toggle bookmark" defaultPressed>
          <IconPlaceholder
            lucide="BookmarkIcon"
            tabler="IconBookmark"
            hugeicons="BookmarkIcon"
            className="group-data-[state=on]/toggle:fill-accent-foreground"
          />
        </Toggle>
        <Toggle variant="outline" aria-label="Toggle bookmark outline">
          <IconPlaceholder
            lucide="BookmarkIcon"
            tabler="IconBookmark"
            hugeicons="BookmarkIcon"
            className="group-data-[state=on]/toggle:fill-accent-foreground"
          />
          Bookmark
        </Toggle>
      </div>
    </CanvaFrame>
  )
}
