import {
  Example,
  ExampleWrapper,
} from "@/registry/bases/base/components/example"
import { Button } from "@/registry/bases/base/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/registry/bases/base/ui/field"
import { Input } from "@/registry/bases/base/ui/input"
import {
  NativeSelect,
  NativeSelectOption,
} from "@/registry/bases/base/ui/native-select"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/registry/bases/base/ui/select"
import { IconPlaceholder } from "@/app/(design)/components/icon-placeholder"

export default function SelectExample() {
  return (
    <ExampleWrapper>
      <SelectBasic />
      <SelectWithIcons />
      <SelectWithGroups />
      <SelectLargeList />
      <SelectSizes />
      <SelectWithButton />
      <SelectItemAligned />
      <SelectWithField />
      <SelectInvalid />
      <SelectInline />
      <SelectDisabled />
    </ExampleWrapper>
  )
}

function SelectBasic() {
  return (
    <Example title="Basic">
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
    </Example>
  )
}

function SelectWithIcons() {
  return (
    <Example title="With Icons">
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
    </Example>
  )
}

function SelectWithGroups() {
  return (
    <Example title="With Groups & Labels">
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
    </Example>
  )
}

function SelectLargeList() {
  return (
    <Example title="Large List">
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
    </Example>
  )
}

function SelectSizes() {
  return (
    <Example title="Sizes">
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
    </Example>
  )
}

function SelectWithButton() {
  return (
    <Example title="With Button">
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
    </Example>
  )
}

function SelectItemAligned() {
  return (
    <Example title="Item Aligned">
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
    </Example>
  )
}

function SelectWithField() {
  return (
    <Example title="With Field">
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
    </Example>
  )
}

function SelectInvalid() {
  return (
    <Example title="Invalid">
      <div className="flex flex-col gap-4">
        <Select>
          <SelectTrigger aria-invalid="true">
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
        <Field data-invalid>
          <FieldLabel htmlFor="select-fruit-invalid">Favorite Fruit</FieldLabel>
          <Select>
            <SelectTrigger id="select-fruit-invalid" aria-invalid>
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
          <FieldError errors={[{ message: "Please select a valid fruit." }]} />
        </Field>
      </div>
    </Example>
  )
}

function SelectInline() {
  return (
    <Example title="Inline with Input & NativeSelect">
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
    </Example>
  )
}

function SelectDisabled() {
  return (
    <Example title="Disabled">
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
    </Example>
  )
}
