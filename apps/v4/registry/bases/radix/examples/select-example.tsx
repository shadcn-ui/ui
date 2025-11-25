import { Button } from "@/registry/bases/radix/ui/button"
import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@/registry/bases/radix/ui/field"
import { Input } from "@/registry/bases/radix/ui/input"
import {
  NativeSelect,
  NativeSelectOption,
} from "@/registry/bases/radix/ui/native-select"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/registry/bases/radix/ui/select"
import Frame from "@/app/(design)/design/components/frame"
import { IconPlaceholder } from "@/app/(design)/design/components/icon-placeholder"

export default function SelectExample() {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-6 lg:p-12">
      <div className="flex w-full max-w-lg flex-col gap-12">
        <SelectBasic />
        <SelectWithIcons />
        <SelectWithGroups />
        <SelectSizes />
        <SelectWithButton />
        <SelectItemAligned />
        <SelectWithField />
        <SelectInline />
        <SelectLargeList />
        <SelectDisabled />
      </div>
    </div>
  )
}

function SelectBasic() {
  return (
    <Frame title="Basic">
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="blueberry">Blueberry</SelectItem>
          <SelectItem value="grapes" disabled>
            Grapes
          </SelectItem>
          <SelectItem value="pineapple">Pineapple</SelectItem>
        </SelectContent>
      </Select>
    </Frame>
  )
}

function SelectWithIcons() {
  return (
    <Frame title="With Icons">
      <div className="flex flex-col gap-4">
        <Select>
          <SelectTrigger size="sm">
            <SelectValue
              placeholder={
                <>
                  <IconPlaceholder
                    lucide="ChartLineIcon"
                    tabler="IconChartLine"
                    hugeicons="Chart03Icon"
                  />
                  Chart Type
                </>
              }
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="line">
              <IconPlaceholder
                lucide="ChartLineIcon"
                tabler="IconChartLine"
                hugeicons="Chart03Icon"
              />
              Line
            </SelectItem>
            <SelectItem value="bar">
              <IconPlaceholder
                lucide="ChartBarIcon"
                tabler="IconChartBar"
                hugeicons="Chart03Icon"
              />
              Bar
            </SelectItem>
            <SelectItem value="pie">
              <IconPlaceholder
                lucide="ChartPieIcon"
                tabler="IconChartPie"
                hugeicons="Chart03Icon"
              />
              Pie
            </SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger size="default">
            <SelectValue
              placeholder={
                <>
                  <IconPlaceholder
                    lucide="ChartLineIcon"
                    tabler="IconChartLine"
                    hugeicons="Chart03Icon"
                  />
                  Chart Type
                </>
              }
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="line">
              <IconPlaceholder
                lucide="ChartLineIcon"
                tabler="IconChartLine"
                hugeicons="Chart03Icon"
              />
              Line
            </SelectItem>
            <SelectItem value="bar">
              <IconPlaceholder
                lucide="ChartBarIcon"
                tabler="IconChartBar"
                hugeicons="Chart03Icon"
              />
              Bar
            </SelectItem>
            <SelectItem value="pie">
              <IconPlaceholder
                lucide="ChartPieIcon"
                tabler="IconChartPie"
                hugeicons="Chart03Icon"
              />
              Pie
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </Frame>
  )
}

function SelectWithGroups() {
  return (
    <Frame title="With Groups & Labels">
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Fruits</SelectLabel>
            <SelectItem value="apple">Apple</SelectItem>
            <SelectItem value="banana">Banana</SelectItem>
            <SelectItem value="blueberry">Blueberry</SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Vegetables</SelectLabel>
            <SelectItem value="carrot">Carrot</SelectItem>
            <SelectItem value="broccoli">Broccoli</SelectItem>
            <SelectItem value="spinach">Spinach</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </Frame>
  )
}

function SelectLargeList() {
  return (
    <Frame title="Large List">
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select an item" />
        </SelectTrigger>
        <SelectContent>
          {Array.from({ length: 100 }).map((_, i) => (
            <SelectItem key={i} value={`item-${i}`}>
              Item {i}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Frame>
  )
}

function SelectSizes() {
  return (
    <Frame title="Sizes">
      <div className="flex flex-col gap-4">
        <Select>
          <SelectTrigger size="sm">
            <SelectValue placeholder="Small size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="apple">Apple</SelectItem>
            <SelectItem value="banana">Banana</SelectItem>
            <SelectItem value="blueberry">Blueberry</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger size="default">
            <SelectValue placeholder="Default size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="apple">Apple</SelectItem>
            <SelectItem value="banana">Banana</SelectItem>
            <SelectItem value="blueberry">Blueberry</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </Frame>
  )
}

function SelectWithButton() {
  return (
    <Frame title="With Button">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Select>
            <SelectTrigger size="sm">
              <SelectValue placeholder="Small" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="apple">Apple</SelectItem>
              <SelectItem value="banana">Banana</SelectItem>
              <SelectItem value="blueberry">Blueberry</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            Submit
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Default" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="apple">Apple</SelectItem>
              <SelectItem value="banana">Banana</SelectItem>
              <SelectItem value="blueberry">Blueberry</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">Submit</Button>
        </div>
      </div>
    </Frame>
  )
}

function SelectItemAligned() {
  return (
    <Frame title="Item Aligned">
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
        <SelectContent position="item-aligned">
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="blueberry">Blueberry</SelectItem>
          <SelectItem value="grapes" disabled>
            Grapes
          </SelectItem>
          <SelectItem value="pineapple">Pineapple</SelectItem>
        </SelectContent>
      </Select>
    </Frame>
  )
}

function SelectWithField() {
  return (
    <Frame title="With Field">
      <Field>
        <FieldLabel htmlFor="select-fruit">Favorite Fruit</FieldLabel>
        <Select>
          <SelectTrigger id="select-fruit">
            <SelectValue placeholder="Select a fruit" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="apple">Apple</SelectItem>
            <SelectItem value="banana">Banana</SelectItem>
            <SelectItem value="blueberry">Blueberry</SelectItem>
            <SelectItem value="grapes">Grapes</SelectItem>
            <SelectItem value="pineapple">Pineapple</SelectItem>
          </SelectContent>
        </Select>
        <FieldDescription>
          Choose your favorite fruit from the list.
        </FieldDescription>
      </Field>
    </Frame>
  )
}

function SelectInline() {
  return (
    <Frame title="Inline with Input & NativeSelect">
      <div className="flex items-center gap-2">
        <Input placeholder="Search..." className="flex-1" />
        <Select>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
        <NativeSelect className="w-[140px]">
          <NativeSelectOption value="">Sort by</NativeSelectOption>
          <NativeSelectOption value="name">Name</NativeSelectOption>
          <NativeSelectOption value="date">Date</NativeSelectOption>
          <NativeSelectOption value="status">Status</NativeSelectOption>
        </NativeSelect>
      </div>
    </Frame>
  )
}

function SelectDisabled() {
  return (
    <Frame title="Disabled">
      <Select disabled>
        <SelectTrigger>
          <SelectValue placeholder="Disabled" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="blueberry">Blueberry</SelectItem>
          <SelectItem value="grapes" disabled>
            Grapes
          </SelectItem>
          <SelectItem value="pineapple">Pineapple</SelectItem>
        </SelectContent>
      </Select>
    </Frame>
  )
}
