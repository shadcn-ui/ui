import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/registry/bases/radix/ui/toggle-group"
import Frame from "@/app/(design)/design/components/frame"
import { IconPlaceholder } from "@/app/(design)/design/components/icon-placeholder"

export default function ToggleGroupExample() {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-6 lg:p-12">
      <div className="flex w-full max-w-lg flex-col gap-12">
        <ToggleGroupBasic />
        <ToggleGroupOutline />
        <ToggleGroupOutlineWithIcons />
        <ToggleGroupSizes />
        <ToggleGroupSpacing />
        <ToggleGroupWithIcons />
        <ToggleGroupFilter />
        <ToggleGroupDateRange />
        <ToggleGroupSort />
        <ToggleGroupVertical />
        <ToggleGroupVerticalOutline />
        <ToggleGroupVerticalOutlineWithIcons />
        <ToggleGroupVerticalWithSpacing />
      </div>
    </div>
  )
}

function ToggleGroupBasic() {
  return (
    <Frame title="Basic">
      <ToggleGroup type="multiple" spacing={2}>
        <ToggleGroupItem value="bold" aria-label="Toggle bold">
          <IconPlaceholder
            lucide="BoldIcon"
            tabler="IconBold"
            hugeicons="TextBoldIcon"
          />
        </ToggleGroupItem>
        <ToggleGroupItem value="italic" aria-label="Toggle italic">
          <IconPlaceholder
            lucide="ItalicIcon"
            tabler="IconItalic"
            hugeicons="TextItalicIcon"
          />
        </ToggleGroupItem>
        <ToggleGroupItem value="underline" aria-label="Toggle underline">
          <IconPlaceholder
            lucide="UnderlineIcon"
            tabler="IconUnderline"
            hugeicons="TextUnderlineIcon"
          />
        </ToggleGroupItem>
      </ToggleGroup>
    </Frame>
  )
}

function ToggleGroupOutline() {
  return (
    <Frame title="Outline">
      <ToggleGroup variant="outline" type="single" defaultValue="all">
        <ToggleGroupItem value="all" aria-label="Toggle all">
          All
        </ToggleGroupItem>
        <ToggleGroupItem value="missed" aria-label="Toggle missed">
          Missed
        </ToggleGroupItem>
      </ToggleGroup>
    </Frame>
  )
}

function ToggleGroupOutlineWithIcons() {
  return (
    <Frame title="Outline With Icons">
      <ToggleGroup variant="outline" type="multiple" size="sm">
        <ToggleGroupItem value="bold" aria-label="Toggle bold">
          <IconPlaceholder
            lucide="BoldIcon"
            tabler="IconBold"
            hugeicons="TextBoldIcon"
          />
        </ToggleGroupItem>
        <ToggleGroupItem value="italic" aria-label="Toggle italic">
          <IconPlaceholder
            lucide="ItalicIcon"
            tabler="IconItalic"
            hugeicons="TextItalicIcon"
          />
        </ToggleGroupItem>
        <ToggleGroupItem value="underline" aria-label="Toggle underline">
          <IconPlaceholder
            lucide="UnderlineIcon"
            tabler="IconUnderline"
            hugeicons="TextUnderlineIcon"
          />
        </ToggleGroupItem>
      </ToggleGroup>
    </Frame>
  )
}

function ToggleGroupSizes() {
  return (
    <Frame title="Sizes">
      <div className="flex flex-col gap-4">
        <ToggleGroup
          type="single"
          size="sm"
          defaultValue="top"
          variant="outline"
        >
          <ToggleGroupItem value="top" aria-label="Toggle top">
            Top
          </ToggleGroupItem>
          <ToggleGroupItem value="bottom" aria-label="Toggle bottom">
            Bottom
          </ToggleGroupItem>
          <ToggleGroupItem value="left" aria-label="Toggle left">
            Left
          </ToggleGroupItem>
          <ToggleGroupItem value="right" aria-label="Toggle right">
            Right
          </ToggleGroupItem>
        </ToggleGroup>
        <ToggleGroup type="single" defaultValue="top" variant="outline">
          <ToggleGroupItem value="top" aria-label="Toggle top">
            Top
          </ToggleGroupItem>
          <ToggleGroupItem value="bottom" aria-label="Toggle bottom">
            Bottom
          </ToggleGroupItem>
          <ToggleGroupItem value="left" aria-label="Toggle left">
            Left
          </ToggleGroupItem>
          <ToggleGroupItem value="right" aria-label="Toggle right">
            Right
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </Frame>
  )
}

function ToggleGroupSpacing() {
  return (
    <Frame title="With Spacing">
      <ToggleGroup
        type="single"
        size="sm"
        defaultValue="top"
        variant="outline"
        spacing={2}
      >
        <ToggleGroupItem value="top" aria-label="Toggle top">
          Top
        </ToggleGroupItem>
        <ToggleGroupItem value="bottom" aria-label="Toggle bottom">
          Bottom
        </ToggleGroupItem>
        <ToggleGroupItem value="left" aria-label="Toggle left">
          Left
        </ToggleGroupItem>
        <ToggleGroupItem value="right" aria-label="Toggle right">
          Right
        </ToggleGroupItem>
      </ToggleGroup>
    </Frame>
  )
}

function ToggleGroupWithIcons() {
  return (
    <Frame title="With Icons">
      <ToggleGroup type="multiple" variant="outline" spacing={2} size="sm">
        <ToggleGroupItem
          value="star"
          aria-label="Toggle star"
          className="data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-yellow-500 data-[state=on]:*:[svg]:stroke-yellow-500"
        >
          <IconPlaceholder
            lucide="StarIcon"
            tabler="IconStar"
            hugeicons="StarIcon"
          />
          Star
        </ToggleGroupItem>
        <ToggleGroupItem
          value="heart"
          aria-label="Toggle heart"
          className="data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-red-500 data-[state=on]:*:[svg]:stroke-red-500"
        >
          <IconPlaceholder
            lucide="HeartIcon"
            tabler="IconHeart"
            hugeicons="FavouriteIcon"
          />
          Heart
        </ToggleGroupItem>
        <ToggleGroupItem
          value="bookmark"
          aria-label="Toggle bookmark"
          className="data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-blue-500 data-[state=on]:*:[svg]:stroke-blue-500"
        >
          <IconPlaceholder
            lucide="BookmarkIcon"
            tabler="IconBookmark"
            hugeicons="BookmarkIcon"
          />
          Bookmark
        </ToggleGroupItem>
      </ToggleGroup>
    </Frame>
  )
}

function ToggleGroupFilter() {
  return (
    <Frame title="Filter">
      <ToggleGroup type="single" defaultValue="all" variant="outline" size="sm">
        <ToggleGroupItem value="all" aria-label="All">
          All
        </ToggleGroupItem>
        <ToggleGroupItem value="active" aria-label="Active">
          Active
        </ToggleGroupItem>
        <ToggleGroupItem value="completed" aria-label="Completed">
          Completed
        </ToggleGroupItem>
        <ToggleGroupItem value="archived" aria-label="Archived">
          Archived
        </ToggleGroupItem>
      </ToggleGroup>
    </Frame>
  )
}

function ToggleGroupDateRange() {
  return (
    <Frame title="Date Range">
      <ToggleGroup
        type="single"
        defaultValue="today"
        variant="outline"
        size="sm"
        spacing={2}
      >
        <ToggleGroupItem value="today" aria-label="Today">
          Today
        </ToggleGroupItem>
        <ToggleGroupItem value="week" aria-label="This Week">
          This Week
        </ToggleGroupItem>
        <ToggleGroupItem value="month" aria-label="This Month">
          This Month
        </ToggleGroupItem>
        <ToggleGroupItem value="year" aria-label="This Year">
          This Year
        </ToggleGroupItem>
      </ToggleGroup>
    </Frame>
  )
}

function ToggleGroupSort() {
  return (
    <Frame title="Sort">
      <ToggleGroup
        type="single"
        defaultValue="newest"
        variant="outline"
        size="sm"
      >
        <ToggleGroupItem value="newest" aria-label="Newest">
          <IconPlaceholder
            lucide="ArrowDownIcon"
            tabler="IconArrowDown"
            hugeicons="ArrowDownIcon"
          />
          Newest
        </ToggleGroupItem>
        <ToggleGroupItem value="oldest" aria-label="Oldest">
          <IconPlaceholder
            lucide="ArrowUpIcon"
            tabler="IconArrowUp"
            hugeicons="ArrowUpIcon"
          />
          Oldest
        </ToggleGroupItem>
        <ToggleGroupItem value="popular" aria-label="Popular">
          <IconPlaceholder
            lucide="TrendingUpIcon"
            tabler="IconTrendingUp"
            hugeicons="TradeUpIcon"
          />
          Popular
        </ToggleGroupItem>
      </ToggleGroup>
    </Frame>
  )
}

function ToggleGroupVertical() {
  return (
    <Frame title="Vertical">
      <ToggleGroup type="multiple" orientation="vertical" spacing={2}>
        <ToggleGroupItem value="bold" aria-label="Toggle bold">
          <IconPlaceholder
            lucide="BoldIcon"
            tabler="IconBold"
            hugeicons="TextBoldIcon"
          />
        </ToggleGroupItem>
        <ToggleGroupItem value="italic" aria-label="Toggle italic">
          <IconPlaceholder
            lucide="ItalicIcon"
            tabler="IconItalic"
            hugeicons="TextItalicIcon"
          />
        </ToggleGroupItem>
        <ToggleGroupItem value="underline" aria-label="Toggle underline">
          <IconPlaceholder
            lucide="UnderlineIcon"
            tabler="IconUnderline"
            hugeicons="TextUnderlineIcon"
          />
        </ToggleGroupItem>
      </ToggleGroup>
    </Frame>
  )
}

function ToggleGroupVerticalOutline() {
  return (
    <Frame title="Vertical Outline">
      <ToggleGroup
        variant="outline"
        type="single"
        defaultValue="all"
        orientation="vertical"
        size="sm"
      >
        <ToggleGroupItem value="all" aria-label="Toggle all">
          All
        </ToggleGroupItem>
        <ToggleGroupItem value="active" aria-label="Toggle active">
          Active
        </ToggleGroupItem>
        <ToggleGroupItem value="completed" aria-label="Toggle completed">
          Completed
        </ToggleGroupItem>
        <ToggleGroupItem value="archived" aria-label="Toggle archived">
          Archived
        </ToggleGroupItem>
      </ToggleGroup>
    </Frame>
  )
}

function ToggleGroupVerticalOutlineWithIcons() {
  return (
    <Frame title="Vertical Outline With Icons">
      <ToggleGroup
        variant="outline"
        type="multiple"
        orientation="vertical"
        size="sm"
      >
        <ToggleGroupItem value="bold" aria-label="Toggle bold">
          <IconPlaceholder
            lucide="BoldIcon"
            tabler="IconBold"
            hugeicons="TextBoldIcon"
          />
        </ToggleGroupItem>
        <ToggleGroupItem value="italic" aria-label="Toggle italic">
          <IconPlaceholder
            lucide="ItalicIcon"
            tabler="IconItalic"
            hugeicons="TextItalicIcon"
          />
        </ToggleGroupItem>
        <ToggleGroupItem value="underline" aria-label="Toggle underline">
          <IconPlaceholder
            lucide="UnderlineIcon"
            tabler="IconUnderline"
            hugeicons="TextUnderlineIcon"
          />
        </ToggleGroupItem>
      </ToggleGroup>
    </Frame>
  )
}

function ToggleGroupVerticalWithSpacing() {
  return (
    <Frame title="Vertical With Spacing">
      <ToggleGroup
        type="single"
        size="sm"
        defaultValue="top"
        variant="outline"
        orientation="vertical"
        spacing={2}
      >
        <ToggleGroupItem value="top" aria-label="Toggle top">
          Top
        </ToggleGroupItem>
        <ToggleGroupItem value="bottom" aria-label="Toggle bottom">
          Bottom
        </ToggleGroupItem>
        <ToggleGroupItem value="left" aria-label="Toggle left">
          Left
        </ToggleGroupItem>
        <ToggleGroupItem value="right" aria-label="Toggle right">
          Right
        </ToggleGroupItem>
      </ToggleGroup>
    </Frame>
  )
}
