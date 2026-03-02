"use client"

import * as React from "react"

import {
  Example,
  ExampleWrapper,
} from "@/registry/bases/radix/components/example"
import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@/registry/bases/radix/ui/field"
import { Input } from "@/registry/bases/radix/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/bases/radix/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/registry/bases/radix/ui/toggle-group"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function ToggleGroupExample() {
  return (
    <ExampleWrapper>
      <ToggleGroupBasic />
      <ToggleGroupOutline />
      <ToggleGroupOutlineWithIcons />
      <ToggleGroupSizes />
      <ToggleGroupSpacing />
      <ToggleGroupWithIcons />
      <ToggleGroupFilter />
      <ToggleGroupDateRange />
      <ToggleGroupSort />
      <ToggleGroupWithInputAndSelect />
      <ToggleGroupVertical />
      <ToggleGroupVerticalOutline />
      <ToggleGroupVerticalOutlineWithIcons />
      <ToggleGroupVerticalWithSpacing />
      <ToggleGroupFontWeightSelector />
    </ExampleWrapper>
  )
}

function ToggleGroupBasic() {
  return (
    <Example title="Basic">
      <ToggleGroup type="multiple" spacing={1}>
        <ToggleGroupItem value="bold" aria-label="Toggle bold">
          <IconPlaceholder
            lucide="BoldIcon"
            tabler="IconBold"
            hugeicons="TextBoldIcon"
            phosphor="TextBIcon"
            remixicon="RiBold"
          />
        </ToggleGroupItem>
        <ToggleGroupItem value="italic" aria-label="Toggle italic">
          <IconPlaceholder
            lucide="ItalicIcon"
            tabler="IconItalic"
            hugeicons="TextItalicIcon"
            phosphor="TextItalicIcon"
            remixicon="RiItalic"
          />
        </ToggleGroupItem>
        <ToggleGroupItem value="underline" aria-label="Toggle underline">
          <IconPlaceholder
            lucide="UnderlineIcon"
            tabler="IconUnderline"
            hugeicons="TextUnderlineIcon"
            phosphor="TextUnderlineIcon"
            remixicon="RiUnderline"
          />
        </ToggleGroupItem>
      </ToggleGroup>
    </Example>
  )
}

function ToggleGroupOutline() {
  return (
    <Example title="Outline">
      <ToggleGroup variant="outline" type="single" defaultValue="all">
        <ToggleGroupItem value="all" aria-label="Toggle all">
          All
        </ToggleGroupItem>
        <ToggleGroupItem value="missed" aria-label="Toggle missed">
          Missed
        </ToggleGroupItem>
      </ToggleGroup>
    </Example>
  )
}

function ToggleGroupOutlineWithIcons() {
  return (
    <Example title="Outline With Icons">
      <ToggleGroup variant="outline" type="multiple" size="sm">
        <ToggleGroupItem value="bold" aria-label="Toggle bold">
          <IconPlaceholder
            lucide="BoldIcon"
            tabler="IconBold"
            hugeicons="TextBoldIcon"
            phosphor="TextBIcon"
            remixicon="RiBold"
          />
        </ToggleGroupItem>
        <ToggleGroupItem value="italic" aria-label="Toggle italic">
          <IconPlaceholder
            lucide="ItalicIcon"
            tabler="IconItalic"
            hugeicons="TextItalicIcon"
            phosphor="TextItalicIcon"
            remixicon="RiItalic"
          />
        </ToggleGroupItem>
        <ToggleGroupItem value="underline" aria-label="Toggle underline">
          <IconPlaceholder
            lucide="UnderlineIcon"
            tabler="IconUnderline"
            hugeicons="TextUnderlineIcon"
            phosphor="TextUnderlineIcon"
            remixicon="RiUnderline"
          />
        </ToggleGroupItem>
      </ToggleGroup>
    </Example>
  )
}

function ToggleGroupSizes() {
  return (
    <Example title="Sizes">
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
    </Example>
  )
}

function ToggleGroupSpacing() {
  return (
    <Example title="With Spacing">
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
    </Example>
  )
}

function ToggleGroupWithIcons() {
  return (
    <Example title="With Icons">
      <ToggleGroup type="multiple" variant="outline" spacing={1} size="sm">
        <ToggleGroupItem
          value="star"
          aria-label="Toggle star"
          className="aria-pressed:*:[svg]:stroke-foregfill-foreground aria-pressed:bg-transparent aria-pressed:*:[svg]:fill-foreground"
        >
          <IconPlaceholder
            lucide="StarIcon"
            tabler="IconStar"
            hugeicons="StarIcon"
            phosphor="StarIcon"
            remixicon="RiStarLine"
          />
          Star
        </ToggleGroupItem>
        <ToggleGroupItem
          value="heart"
          aria-label="Toggle heart"
          className="aria-pressed:bg-transparent aria-pressed:*:[svg]:fill-foreground aria-pressed:*:[svg]:stroke-foreground"
        >
          <IconPlaceholder
            lucide="HeartIcon"
            tabler="IconHeart"
            hugeicons="FavouriteIcon"
            phosphor="HeartIcon"
            remixicon="RiHeartLine"
          />
          Heart
        </ToggleGroupItem>
        <ToggleGroupItem
          value="bookmark"
          aria-label="Toggle bookmark"
          className="aria-pressed:bg-transparent aria-pressed:*:[svg]:fill-foreground aria-pressed:*:[svg]:stroke-foreground"
        >
          <IconPlaceholder
            lucide="BookmarkIcon"
            tabler="IconBookmark"
            hugeicons="BookmarkIcon"
            phosphor="BookmarkIcon"
            remixicon="RiBookmarkLine"
          />
          Bookmark
        </ToggleGroupItem>
      </ToggleGroup>
    </Example>
  )
}

function ToggleGroupFilter() {
  return (
    <Example title="Filter">
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
    </Example>
  )
}

function ToggleGroupDateRange() {
  return (
    <Example title="Date Range">
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
    </Example>
  )
}

function ToggleGroupSort() {
  return (
    <Example title="Sort">
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
            phosphor="ArrowDownIcon"
            remixicon="RiArrowDownLine"
          />
          Newest
        </ToggleGroupItem>
        <ToggleGroupItem value="oldest" aria-label="Oldest">
          <IconPlaceholder
            lucide="ArrowUpIcon"
            tabler="IconArrowUp"
            hugeicons="ArrowUpIcon"
            phosphor="ArrowUpIcon"
            remixicon="RiArrowUpLine"
          />
          Oldest
        </ToggleGroupItem>
        <ToggleGroupItem value="popular" aria-label="Popular">
          <IconPlaceholder
            lucide="TrendingUpIcon"
            tabler="IconTrendingUp"
            hugeicons="TradeUpIcon"
            phosphor="TrendUpIcon"
            remixicon="RiLineChartLine"
          />
          Popular
        </ToggleGroupItem>
      </ToggleGroup>
    </Example>
  )
}

function ToggleGroupWithInputAndSelect() {
  return (
    <Example title="With Input and Select">
      <div className="flex items-center gap-2">
        <Input type="search" placeholder="Search..." className="flex-1" />
        <Select defaultValue="all">
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <ToggleGroup type="single" defaultValue="grid" variant="outline">
          <ToggleGroupItem value="grid" aria-label="Grid view">
            Grid
          </ToggleGroupItem>
          <ToggleGroupItem value="list" aria-label="List view">
            List
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </Example>
  )
}

function ToggleGroupVertical() {
  return (
    <Example title="Vertical">
      <ToggleGroup type="multiple" orientation="vertical" spacing={2}>
        <ToggleGroupItem value="bold" aria-label="Toggle bold">
          <IconPlaceholder
            lucide="BoldIcon"
            tabler="IconBold"
            hugeicons="TextBoldIcon"
            phosphor="TextBIcon"
            remixicon="RiBold"
          />
        </ToggleGroupItem>
        <ToggleGroupItem value="italic" aria-label="Toggle italic">
          <IconPlaceholder
            lucide="ItalicIcon"
            tabler="IconItalic"
            hugeicons="TextItalicIcon"
            phosphor="TextItalicIcon"
            remixicon="RiItalic"
          />
        </ToggleGroupItem>
        <ToggleGroupItem value="underline" aria-label="Toggle underline">
          <IconPlaceholder
            lucide="UnderlineIcon"
            tabler="IconUnderline"
            hugeicons="TextUnderlineIcon"
            phosphor="TextUnderlineIcon"
            remixicon="RiUnderline"
          />
        </ToggleGroupItem>
      </ToggleGroup>
    </Example>
  )
}

function ToggleGroupVerticalOutline() {
  return (
    <Example title="Vertical Outline">
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
    </Example>
  )
}

function ToggleGroupVerticalOutlineWithIcons() {
  return (
    <Example title="Vertical Outline With Icons">
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
            phosphor="TextBIcon"
            remixicon="RiBold"
          />
        </ToggleGroupItem>
        <ToggleGroupItem value="italic" aria-label="Toggle italic">
          <IconPlaceholder
            lucide="ItalicIcon"
            tabler="IconItalic"
            hugeicons="TextItalicIcon"
            phosphor="TextItalicIcon"
            remixicon="RiItalic"
          />
        </ToggleGroupItem>
        <ToggleGroupItem value="underline" aria-label="Toggle underline">
          <IconPlaceholder
            lucide="UnderlineIcon"
            tabler="IconUnderline"
            hugeicons="TextUnderlineIcon"
            phosphor="TextUnderlineIcon"
            remixicon="RiUnderline"
          />
        </ToggleGroupItem>
      </ToggleGroup>
    </Example>
  )
}

function ToggleGroupFontWeightSelector() {
  const [fontWeight, setFontWeight] = React.useState("normal")
  return (
    <Example title="Font Weight Selector">
      <Field>
        <FieldLabel>Font Weight</FieldLabel>
        <ToggleGroup
          type="single"
          value={fontWeight}
          onValueChange={(value) => setFontWeight(value)}
          variant="outline"
          spacing={2}
          size="lg"
        >
          <ToggleGroupItem
            value="light"
            aria-label="Light"
            className="flex size-16 flex-col items-center justify-center rounded-xl"
          >
            <span className="text-2xl leading-none font-light">Aa</span>
            <span className="text-xs text-muted-foreground">Light</span>
          </ToggleGroupItem>
          <ToggleGroupItem
            value="normal"
            aria-label="Normal"
            className="flex size-16 flex-col items-center justify-center rounded-xl"
          >
            <span className="text-2xl leading-none font-normal">Aa</span>
            <span className="text-xs text-muted-foreground">Normal</span>
          </ToggleGroupItem>
          <ToggleGroupItem
            value="medium"
            aria-label="Medium"
            className="flex size-16 flex-col items-center justify-center rounded-xl"
          >
            <span className="text-2xl leading-none font-medium">Aa</span>
            <span className="text-xs text-muted-foreground">Medium</span>
          </ToggleGroupItem>
          <ToggleGroupItem
            value="bold"
            aria-label="Bold"
            className="flex size-16 flex-col items-center justify-center rounded-xl"
          >
            <span className="text-2xl leading-none font-bold">Aa</span>
            <span className="text-xs text-muted-foreground">Bold</span>
          </ToggleGroupItem>
        </ToggleGroup>
        <FieldDescription>
          Use{" "}
          <code className="rounded-md bg-muted px-1 py-0.5 font-mono">
            font-{fontWeight}
          </code>{" "}
          to set the font weight.
        </FieldDescription>
      </Field>
    </Example>
  )
}

function ToggleGroupVerticalWithSpacing() {
  return (
    <Example title="Vertical With Spacing">
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
    </Example>
  )
}
