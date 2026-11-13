"use client"

import { Autocomplete, useFilter } from "react-aria-components"

import {
  Example,
  ExampleWrapper,
} from "@/registry/bases/aria/components/example"
import { Button } from "@/registry/bases/aria/ui/button"
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/registry/bases/aria/ui/dialog"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/registry/bases/aria/ui/field"
import { Input } from "@/registry/bases/aria/ui/input"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/registry/bases/aria/ui/item"
import {
  NativeSelect,
  NativeSelectOption,
} from "@/registry/bases/aria/ui/native-select"
import {
  Select,
  SelectContent,
  SelectEmpty,
  SelectGroup,
  SelectInput,
  SelectItem,
  SelectLabel,
  SelectList,
  SelectPopover,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/registry/bases/aria/ui/select"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function SelectExample() {
  return (
    <ExampleWrapper>
      <SelectBasic />
      <SelectAutocomplete />
      <SelectSides />
      <SelectWithIcons />
      <SelectWithGroups />
      <SelectLargeList />
      <SelectMultiple />
      <SelectSizes />
      <SelectPlan />
      <SelectWithButton />
      <SelectItemAligned />
      <SelectWithField />
      <SelectInvalid />
      <SelectInline />
      <SelectDisabled />
      <SelectInDialog />
    </ExampleWrapper>
  )
}

function SelectBasic() {
  const items = [
    { label: "Apple", value: "apple" },
    { label: "Banana", value: "banana" },
    { label: "Blueberry", value: "blueberry" },
    { label: "Grapes", value: "grapes" },
    { label: "Pineapple", value: "pineapple" },
  ]
  return (
    <Example title="Basic">
      <Select aria-label="Fruits" placeholder="Select a fruit">
        <SelectTrigger>
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
    </Example>
  )
}

function SelectSides() {
  const items = [
    { label: "Apple", value: "apple" },
    { label: "Banana", value: "banana" },
    { label: "Blueberry", value: "blueberry" },
  ]
  return (
    <Example title="Sides" containerClassName="col-span-2">
      <div className="flex flex-wrap justify-center gap-2">
        {(["start", "left", "top", "bottom", "right", "end"] as const).map(
          (placement) => (
            <Select key={placement} aria-label="Fruits" placeholder="Select">
              <SelectTrigger className="w-28 capitalize">
                <SelectValue />
              </SelectTrigger>
              <SelectContent placement={placement}>
                <SelectGroup>
                  {items.map((item) => (
                    <SelectItem key={item.value} id={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )
        )}
      </div>
    </Example>
  )
}

function SelectWithIcons() {
  const items = [
    {
      label: (
        <>
          <IconPlaceholder
            lucide="ChartLineIcon"
            tabler="IconChartLine"
            hugeicons="Chart03Icon"
            phosphor="ChartLineIcon"
            remixicon="RiLineChartLine"
          />
          Line
        </>
      ),
      value: "line",
    },
    {
      label: (
        <>
          <IconPlaceholder
            lucide="ChartBarIcon"
            tabler="IconChartBar"
            hugeicons="Chart03Icon"
            phosphor="ChartBarIcon"
            remixicon="RiBarChartLine"
          />
          Bar
        </>
      ),
      value: "bar",
    },
    {
      label: (
        <>
          <IconPlaceholder
            lucide="ChartPieIcon"
            tabler="IconChartPie"
            hugeicons="Chart03Icon"
            phosphor="ChartPieIcon"
            remixicon="RiPieChartLine"
          />
          Pie
        </>
      ),
      value: "pie",
    },
  ]
  return (
    <Example title="With Icons">
      <div className="flex flex-col gap-4">
        <Select aria-label="Chart Type">
          <SelectTrigger size="sm">
            <SelectValue>
              {({ isPlaceholder, defaultChildren }) =>
                isPlaceholder ? (
                  <>
                    <IconPlaceholder
                      lucide="ChartLineIcon"
                      tabler="IconChartLine"
                      hugeicons="Chart03Icon"
                      phosphor="ChartLineIcon"
                      remixicon="RiLineChartLine"
                    />
                    Chart Type
                  </>
                ) : (
                  defaultChildren
                )
              }
            </SelectValue>
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
        <Select aria-label="Chart Type">
          <SelectTrigger size="default">
            <SelectValue>
              {({ isPlaceholder, defaultChildren }) =>
                isPlaceholder ? (
                  <>
                    <IconPlaceholder
                      lucide="ChartLineIcon"
                      tabler="IconChartLine"
                      hugeicons="Chart03Icon"
                      phosphor="ChartLineIcon"
                      remixicon="RiLineChartLine"
                    />
                    Chart Type
                  </>
                ) : (
                  defaultChildren
                )
              }
            </SelectValue>
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
      </div>
    </Example>
  )
}

function SelectWithGroups() {
  const fruits = [
    { label: "Apple", value: "apple" },
    { label: "Banana", value: "banana" },
    { label: "Blueberry", value: "blueberry" },
  ]
  const vegetables = [
    { label: "Carrot", value: "carrot" },
    { label: "Broccoli", value: "broccoli" },
    { label: "Spinach", value: "spinach" },
  ]
  return (
    <Example title="With Groups & Labels">
      <Select aria-label="Fruits and Vegetables">
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Fruits</SelectLabel>
            {fruits.map((item) => (
              <SelectItem key={item.value} id={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Vegetables</SelectLabel>
            {vegetables.map((item) => (
              <SelectItem key={item.value} id={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Example>
  )
}

function SelectLargeList() {
  const items = Array.from({ length: 100 }).map((_, i) => ({
    label: `Item ${i}`,
    value: `item-${i}`,
  }))
  return (
    <Example title="Large List">
      <Select aria-label="Items">
        <SelectTrigger>
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
    </Example>
  )
}

function SelectSizes() {
  const items = [
    { label: "Apple", value: "apple" },
    { label: "Banana", value: "banana" },
    { label: "Blueberry", value: "blueberry" },
  ]
  return (
    <Example title="Sizes">
      <div className="flex flex-col gap-4">
        <Select aria-label="Fruits" placeholder="Select a fruit">
          <SelectTrigger size="sm">
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
        <Select aria-label="Fruits">
          <SelectTrigger size="default">
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
      </div>
    </Example>
  )
}

function SelectWithButton() {
  const items = [
    { label: "Apple", value: "apple" },
    { label: "Banana", value: "banana" },
    { label: "Blueberry", value: "blueberry" },
  ]
  return (
    <Example title="With Button">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Select aria-label="Fruits" placeholder="Select a fruit">
            <SelectTrigger size="sm">
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
          <Button variant="outline" size="sm">
            Submit
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Select aria-label="Fruits">
            <SelectTrigger>
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
          <Button variant="outline">Submit</Button>
        </div>
      </div>
    </Example>
  )
}

function SelectItemAligned() {
  const items = [
    { label: "Apple", value: "apple" },
    { label: "Banana", value: "banana" },
    { label: "Blueberry", value: "blueberry" },
    { label: "Grapes", value: "grapes", disabled: true },
    { label: "Pineapple", value: "pineapple" },
  ]
  return (
    <Example title="Item Aligned">
      <Select aria-label="Fruits" placeholder="Select a fruit">
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {items.map((item) => (
              <SelectItem
                key={item.value}
                id={item.value}
                isDisabled={item.disabled}
              >
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Example>
  )
}

function SelectWithField() {
  const items = [
    { label: "Apple", value: "apple" },
    { label: "Banana", value: "banana" },
    { label: "Blueberry", value: "blueberry" },
    { label: "Grapes", value: "grapes" },
    { label: "Pineapple", value: "pineapple" },
  ]
  return (
    <Example title="With Field">
      <Field>
        <FieldLabel htmlFor="select-fruit">Favorite Fruit</FieldLabel>
        <Select aria-label="Fruits" placeholder="Select a fruit">
          <SelectTrigger id="select-fruit">
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
        <FieldDescription>
          Choose your favorite fruit from the list.
        </FieldDescription>
      </Field>
    </Example>
  )
}

function SelectInvalid() {
  const items = [
    { label: "Apple", value: "apple" },
    { label: "Banana", value: "banana" },
    { label: "Blueberry", value: "blueberry" },
    { label: "Grapes", value: "grapes" },
    { label: "Pineapple", value: "pineapple" },
  ]
  return (
    <Example title="Invalid">
      <div className="flex flex-col gap-4">
        <Select aria-label="Fruits" placeholder="Select a fruit" isInvalid>
          <SelectTrigger>
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
        <Field data-invalid>
          <FieldLabel htmlFor="select-fruit-invalid">Favorite Fruit</FieldLabel>
          <Select aria-label="Fruits" isInvalid>
            <SelectTrigger id="select-fruit-invalid">
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
          <FieldError errors={[{ message: "Please select a valid fruit." }]} />
        </Field>
      </div>
    </Example>
  )
}

function SelectInline() {
  const items = [
    { label: "All", value: "all" },
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" },
  ]
  return (
    <Example title="Inline with Input & NativeSelect">
      <div className="flex items-center gap-2">
        <Input placeholder="Search..." className="flex-1" />
        <Select aria-label="Filter" placeholder="Filter">
          <SelectTrigger className="w-[140px]">
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
  const items = [
    { label: "Apple", value: "apple" },
    { label: "Banana", value: "banana" },
    { label: "Blueberry", value: "blueberry" },
    { label: "Grapes", value: "grapes", disabled: true },
    { label: "Pineapple", value: "pineapple" },
  ]
  return (
    <Example title="Disabled">
      <Select aria-label="Fruits" placeholder="Select a fruit" isDisabled>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {items.map((item) => (
              <SelectItem
                key={item.value}
                id={item.value}
                isDisabled={item.disabled}
              >
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Example>
  )
}

const plans = [
  {
    name: "Starter",
    description: "Perfect for individuals getting started.",
  },
  {
    name: "Professional",
    description: "Ideal for growing teams and businesses.",
  },
  {
    name: "Enterprise",
    description: "Advanced features for large organizations.",
  },
]

function SelectPlan() {
  return (
    <Example title="Subscription Plan">
      <Select aria-label="Subscription Plan" defaultValue={plans[0].name}>
        <SelectTrigger className="h-auto! w-72">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {plans.map((plan) => (
              <SelectItem key={plan.name} id={plan.name} textValue={plan.name}>
                <SelectPlanItem plan={plan} />
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Example>
  )
}

function SelectPlanItem({ plan }: { plan: (typeof plans)[number] }) {
  return (
    <Item size="xs" className="w-full p-0">
      <ItemContent className="gap-0 normal-case">
        <ItemTitle className="font-sans">{plan.name}</ItemTitle>
        <ItemDescription className="text-xs font-normal tracking-normal">
          {plan.description}
        </ItemDescription>
      </ItemContent>
    </Item>
  )
}

function SelectMultiple() {
  const items = [
    { label: "Apple", value: "apple" },
    { label: "Banana", value: "banana" },
    { label: "Blueberry", value: "blueberry" },
    { label: "Grapes", value: "grapes" },
    { label: "Pineapple", value: "pineapple" },
    { label: "Strawberry", value: "strawberry" },
    { label: "Watermelon", value: "watermelon" },
  ]

  return (
    <Example title="Multiple Selection">
      <Select selectionMode="multiple" aria-label="Fruits">
        <SelectTrigger className="w-72">
          <SelectValue<(typeof items)[0]>>
            {({ selectedItems }) =>
              selectedItems.length === 0
                ? "Select fruits"
                : selectedItems.length === 1
                  ? (selectedItems[0]?.label ?? "")
                  : `${selectedItems.length} fruits selected`
            }
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup items={items}>
            {(item) => <SelectItem id={item.value}>{item.label}</SelectItem>}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Example>
  )
}

function SelectInDialog() {
  const items = [
    { label: "Apple", value: "apple" },
    { label: "Banana", value: "banana" },
    { label: "Blueberry", value: "blueberry" },
    { label: "Grapes", value: "grapes" },
    { label: "Pineapple", value: "pineapple" },
  ]
  return (
    <Example title="In Dialog">
      <DialogTrigger>
        <Button variant="outline">Open Dialog</Button>
        <Dialog>
          <DialogHeader>
            <DialogTitle>Select Example</DialogTitle>
            <DialogDescription>
              Use the select below to choose a fruit.
            </DialogDescription>
          </DialogHeader>
          <Select aria-label="Fruits" placeholder="Select a fruit">
            <SelectTrigger>
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
        </Dialog>
      </DialogTrigger>
    </Example>
  )
}

const countries = [
  {
    code: "ar",
    value: "argentina",
    label: "Argentina",
    continent: "South America",
  },
  { code: "au", value: "australia", label: "Australia", continent: "Oceania" },
  { code: "br", value: "brazil", label: "Brazil", continent: "South America" },
  { code: "ca", value: "canada", label: "Canada", continent: "North America" },
  { code: "cn", value: "china", label: "China", continent: "Asia" },
  {
    code: "co",
    value: "colombia",
    label: "Colombia",
    continent: "South America",
  },
  { code: "eg", value: "egypt", label: "Egypt", continent: "Africa" },
  { code: "fr", value: "france", label: "France", continent: "Europe" },
  { code: "de", value: "germany", label: "Germany", continent: "Europe" },
  { code: "it", value: "italy", label: "Italy", continent: "Europe" },
  { code: "jp", value: "japan", label: "Japan", continent: "Asia" },
  { code: "ke", value: "kenya", label: "Kenya", continent: "Africa" },
  { code: "mx", value: "mexico", label: "Mexico", continent: "North America" },
  {
    code: "nz",
    value: "new-zealand",
    label: "New Zealand",
    continent: "Oceania",
  },
  { code: "ng", value: "nigeria", label: "Nigeria", continent: "Africa" },
  {
    code: "za",
    value: "south-africa",
    label: "South Africa",
    continent: "Africa",
  },
  { code: "kr", value: "south-korea", label: "South Korea", continent: "Asia" },
  {
    code: "gb",
    value: "united-kingdom",
    label: "United Kingdom",
    continent: "Europe",
  },
  {
    code: "us",
    value: "united-states",
    label: "United States",
    continent: "North America",
  },
]

function SelectAutocomplete() {
  const { contains } = useFilter({ sensitivity: "base" })

  return (
    <Example title="With Autocomplete">
      <Select placeholder="Select country">
        <SelectTrigger className="w-full max-w-48">
          <SelectValue />
        </SelectTrigger>
        <Autocomplete filter={contains}>
          <SelectPopover>
            <SelectInput />
            <SelectList
              renderEmptyState={() => (
                <SelectEmpty>No items found.</SelectEmpty>
              )}
            >
              <SelectGroup items={countries}>
                {(item) => (
                  <SelectItem id={item.value}>{item.label}</SelectItem>
                )}
              </SelectGroup>
            </SelectList>
          </SelectPopover>
        </Autocomplete>
      </Select>
    </Example>
  )
}
