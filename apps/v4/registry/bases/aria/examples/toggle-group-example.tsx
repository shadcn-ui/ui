"use client"

import * as React from "react"

import {
  Example,
  ExampleWrapper,
} from "@/registry/bases/aria/components/example"
import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@/registry/bases/aria/ui/field"
import { Input } from "@/registry/bases/aria/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/bases/aria/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/registry/bases/aria/ui/toggle-group"
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
      <ToggleGroup selectionMode="multiple" spacing={1}>
        <ToggleGroupItem id="bold" aria-label="Toggle bold">
          <IconPlaceholder
            lucide="BoldIcon"
            tabler="IconBold"
            hugeicons="TextBoldIcon"
            phosphor="TextBIcon"
            remixicon="RiBold"
          />
        </ToggleGroupItem>
        <ToggleGroupItem id="italic" aria-label="Toggle italic">
          <IconPlaceholder
            lucide="ItalicIcon"
            tabler="IconItalic"
            hugeicons="TextItalicIcon"
            phosphor="TextItalicIcon"
            remixicon="RiItalic"
          />
        </ToggleGroupItem>
        <ToggleGroupItem id="underline" aria-label="Toggle underline">
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
      <ToggleGroup variant="outline" defaultSelectedKeys={["all"]}>
        <ToggleGroupItem id="all" aria-label="Toggle all">
          All
        </ToggleGroupItem>
        <ToggleGroupItem id="missed" aria-label="Toggle missed">
          Missed
        </ToggleGroupItem>
      </ToggleGroup>
    </Example>
  )
}

function ToggleGroupOutlineWithIcons() {
  return (
    <Example title="Outline With Icons">
      <ToggleGroup variant="outline" selectionMode="multiple" size="sm">
        <ToggleGroupItem id="bold" aria-label="Toggle bold">
          <IconPlaceholder
            lucide="BoldIcon"
            tabler="IconBold"
            hugeicons="TextBoldIcon"
            phosphor="TextBIcon"
            remixicon="RiBold"
          />
        </ToggleGroupItem>
        <ToggleGroupItem id="italic" aria-label="Toggle italic">
          <IconPlaceholder
            lucide="ItalicIcon"
            tabler="IconItalic"
            hugeicons="TextItalicIcon"
            phosphor="TextItalicIcon"
            remixicon="RiItalic"
          />
        </ToggleGroupItem>
        <ToggleGroupItem id="underline" aria-label="Toggle underline">
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
        <ToggleGroup size="sm" defaultSelectedKeys={["top"]} variant="outline">
          <ToggleGroupItem id="top" aria-label="Toggle top">
            Top
          </ToggleGroupItem>
          <ToggleGroupItem id="bottom" aria-label="Toggle bottom">
            Bottom
          </ToggleGroupItem>
          <ToggleGroupItem id="left" aria-label="Toggle left">
            Left
          </ToggleGroupItem>
          <ToggleGroupItem id="right" aria-label="Toggle right">
            Right
          </ToggleGroupItem>
        </ToggleGroup>
        <ToggleGroup defaultSelectedKeys={["top"]} variant="outline">
          <ToggleGroupItem id="top" aria-label="Toggle top">
            Top
          </ToggleGroupItem>
          <ToggleGroupItem id="bottom" aria-label="Toggle bottom">
            Bottom
          </ToggleGroupItem>
          <ToggleGroupItem id="left" aria-label="Toggle left">
            Left
          </ToggleGroupItem>
          <ToggleGroupItem id="right" aria-label="Toggle right">
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
      <ToggleGroup size="sm" defaultSelectedKeys={["top"]} spacing={2}>
        <ToggleGroupItem id="top" aria-label="Toggle top">
          Top
        </ToggleGroupItem>
        <ToggleGroupItem id="bottom" aria-label="Toggle bottom">
          Bottom
        </ToggleGroupItem>
        <ToggleGroupItem id="left" aria-label="Toggle left">
          Left
        </ToggleGroupItem>
        <ToggleGroupItem id="right" aria-label="Toggle right">
          Right
        </ToggleGroupItem>
      </ToggleGroup>
    </Example>
  )
}

function ToggleGroupWithIcons() {
  return (
    <Example title="With Icons">
      <ToggleGroup
        selectionMode="multiple"
        variant="outline"
        spacing={2}
        size="sm"
      >
        <ToggleGroupItem
          id="star"
          aria-label="Toggle star"
          className="data-selected:bg-transparent data-selected:*:[svg]:fill-foreground data-selected:*:[svg]:stroke-foreground"
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
          id="heart"
          aria-label="Toggle heart"
          className="data-selected:bg-transparent data-selected:*:[svg]:fill-foreground data-selected:*:[svg]:stroke-foreground"
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
          id="bookmark"
          aria-label="Toggle bookmark"
          className="data-selected:bg-transparent data-selected:*:[svg]:fill-foreground data-selected:*:[svg]:stroke-foreground"
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
      <ToggleGroup defaultSelectedKeys={["all"]} variant="outline" size="sm">
        <ToggleGroupItem id="all" aria-label="All">
          All
        </ToggleGroupItem>
        <ToggleGroupItem id="active" aria-label="Active">
          Active
        </ToggleGroupItem>
        <ToggleGroupItem id="completed" aria-label="Completed">
          Completed
        </ToggleGroupItem>
        <ToggleGroupItem id="archived" aria-label="Archived">
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
        defaultSelectedKeys={["today"]}
        variant="outline"
        size="sm"
        spacing={2}
      >
        <ToggleGroupItem id="today" aria-label="Today">
          Today
        </ToggleGroupItem>
        <ToggleGroupItem id="week" aria-label="This Week">
          This Week
        </ToggleGroupItem>
        <ToggleGroupItem id="month" aria-label="This Month">
          This Month
        </ToggleGroupItem>
        <ToggleGroupItem id="year" aria-label="This Year">
          This Year
        </ToggleGroupItem>
      </ToggleGroup>
    </Example>
  )
}

function ToggleGroupSort() {
  return (
    <Example title="Sort">
      <ToggleGroup defaultSelectedKeys={["newest"]} variant="outline" size="sm">
        <ToggleGroupItem id="newest" aria-label="Newest">
          <IconPlaceholder
            lucide="ArrowDownIcon"
            tabler="IconArrowDown"
            hugeicons="ArrowDownIcon"
            phosphor="ArrowDownIcon"
            remixicon="RiArrowDownLine"
          />
          Newest
        </ToggleGroupItem>
        <ToggleGroupItem id="oldest" aria-label="Oldest">
          <IconPlaceholder
            lucide="ArrowUpIcon"
            tabler="IconArrowUp"
            hugeicons="ArrowUpIcon"
            phosphor="ArrowUpIcon"
            remixicon="RiArrowUpLine"
          />
          Oldest
        </ToggleGroupItem>
        <ToggleGroupItem id="popular" aria-label="Popular">
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
  const items = [
    { label: "All", value: "all" },
    { label: "Active", value: "active" },
    { label: "Archived", value: "archived" },
  ]
  return (
    <Example title="With Input and Select">
      <div className="flex items-center gap-2">
        <Input type="search" placeholder="Search..." className="flex-1" />
        <Select defaultValue={items[0].value}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {items.map((item) => (
                <SelectItem key={item.value} id={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <ToggleGroup defaultSelectedKeys={["grid"]} variant="outline">
          <ToggleGroupItem id="grid" aria-label="Grid view">
            Grid
          </ToggleGroupItem>
          <ToggleGroupItem id="list" aria-label="List view">
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
      <ToggleGroup selectionMode="multiple" orientation="vertical" spacing={1}>
        <ToggleGroupItem id="bold" aria-label="Toggle bold">
          <IconPlaceholder
            lucide="BoldIcon"
            tabler="IconBold"
            hugeicons="TextBoldIcon"
            phosphor="TextBIcon"
            remixicon="RiBold"
          />
        </ToggleGroupItem>
        <ToggleGroupItem id="italic" aria-label="Toggle italic">
          <IconPlaceholder
            lucide="ItalicIcon"
            tabler="IconItalic"
            hugeicons="TextItalicIcon"
            phosphor="TextItalicIcon"
            remixicon="RiItalic"
          />
        </ToggleGroupItem>
        <ToggleGroupItem id="underline" aria-label="Toggle underline">
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
        defaultSelectedKeys={["all"]}
        orientation="vertical"
        size="sm"
      >
        <ToggleGroupItem id="all" aria-label="Toggle all">
          All
        </ToggleGroupItem>
        <ToggleGroupItem id="active" aria-label="Toggle active">
          Active
        </ToggleGroupItem>
        <ToggleGroupItem id="completed" aria-label="Toggle completed">
          Completed
        </ToggleGroupItem>
        <ToggleGroupItem id="archived" aria-label="Toggle archived">
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
        selectionMode="multiple"
        orientation="vertical"
        size="sm"
      >
        <ToggleGroupItem id="bold" aria-label="Toggle bold">
          <IconPlaceholder
            lucide="BoldIcon"
            tabler="IconBold"
            hugeicons="TextBoldIcon"
            phosphor="TextBIcon"
            remixicon="RiBold"
          />
        </ToggleGroupItem>
        <ToggleGroupItem id="italic" aria-label="Toggle italic">
          <IconPlaceholder
            lucide="ItalicIcon"
            tabler="IconItalic"
            hugeicons="TextItalicIcon"
            phosphor="TextItalicIcon"
            remixicon="RiItalic"
          />
        </ToggleGroupItem>
        <ToggleGroupItem id="underline" aria-label="Toggle underline">
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
          selectedKeys={[fontWeight]}
          onSelectionChange={(value) => {
            setFontWeight((Array.from(value)[0] as string) ?? "normal")
          }}
          variant="outline"
          spacing={2}
          size="lg"
        >
          <ToggleGroupItem
            id="light"
            aria-label="Light"
            className="flex size-16 flex-col items-center justify-center rounded-xl"
          >
            <span className="text-2xl leading-none font-light">Aa</span>
            <span className="text-xs text-muted-foreground">Light</span>
          </ToggleGroupItem>
          <ToggleGroupItem
            id="normal"
            aria-label="Normal"
            className="flex size-16 flex-col items-center justify-center rounded-xl"
          >
            <span className="text-2xl leading-none font-normal">Aa</span>
            <span className="text-xs text-muted-foreground">Normal</span>
          </ToggleGroupItem>
          <ToggleGroupItem
            id="medium"
            aria-label="Medium"
            className="flex size-16 flex-col items-center justify-center rounded-xl"
          >
            <span className="text-2xl leading-none font-medium">Aa</span>
            <span className="text-xs text-muted-foreground">Medium</span>
          </ToggleGroupItem>
          <ToggleGroupItem
            id="bold"
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
        size="sm"
        defaultSelectedKeys={["top"]}
        orientation="vertical"
        spacing={1}
      >
        <ToggleGroupItem id="top" aria-label="Toggle top">
          Top
        </ToggleGroupItem>
        <ToggleGroupItem id="bottom" aria-label="Toggle bottom">
          Bottom
        </ToggleGroupItem>
        <ToggleGroupItem id="left" aria-label="Toggle left">
          Left
        </ToggleGroupItem>
        <ToggleGroupItem id="right" aria-label="Toggle right">
          Right
        </ToggleGroupItem>
      </ToggleGroup>
    </Example>
  )
}
