"use client"

import * as React from "react"

import {
  Example,
  ExampleWrapper,
} from "@/registry/ark-vega/components/example"
import { Button } from "@/registry/ark-vega/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/registry/ark-vega/ui/dialog"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/registry/ark-vega/ui/field"
import { Input } from "@/registry/ark-vega/ui/input"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/registry/ark-vega/ui/item"
import {
  NativeSelect,
  NativeSelectOption,
} from "@/registry/ark-vega/ui/native-select"
import {
  createListCollection,
  Select,
  SelectContent,
  SelectControl,
  SelectIndicator,
  SelectItem,
  SelectItemGroup,
  SelectItemGroupLabel,
  SelectItemIndicator,
  SelectItemText,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  type SelectValueChangeDetails,
} from "@/registry/ark-vega/ui/select"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function SelectExample() {
  return (
    <ExampleWrapper>
      <SelectBasic />
      <SelectWithIcons />
      <SelectWithGroups />
      <SelectLargeList />
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

const fruitsCollection = createListCollection({
  items: [
    { label: "Apple", value: "apple" },
    { label: "Banana", value: "banana" },
    { label: "Blueberry", value: "blueberry" },
    { label: "Grapes", value: "grapes" },
    { label: "Pineapple", value: "pineapple" },
  ],
})

const fruitsWithDisabledCollection = createListCollection({
  items: [
    { label: "Apple", value: "apple" },
    { label: "Banana", value: "banana" },
    { label: "Blueberry", value: "blueberry" },
    { label: "Grapes", value: "grapes", disabled: true },
    { label: "Pineapple", value: "pineapple" },
  ],
})

const chartCollection = createListCollection({
  items: [
    { label: "Line", value: "line" },
    { label: "Bar", value: "bar" },
    { label: "Pie", value: "pie" },
  ],
})

const fruitsAndVegetablesCollection = createListCollection({
  items: [
    { label: "Apple", value: "apple", type: "fruit" },
    { label: "Banana", value: "banana", type: "fruit" },
    { label: "Blueberry", value: "blueberry", type: "fruit" },
    { label: "Carrot", value: "carrot", type: "vegetable" },
    { label: "Broccoli", value: "broccoli", type: "vegetable" },
    { label: "Spinach", value: "spinach", type: "vegetable" },
  ],
  groupBy: (item) => item.type,
})

const groupLabels: Record<string, string> = {
  fruit: "Fruits",
  vegetable: "Vegetables",
}

const largeListCollection = createListCollection({
  items: Array.from({ length: 100 }, (_, i) => ({
    label: `Item ${i}`,
    value: `item-${i}`,
  })),
})

const filterCollection = createListCollection({
  items: [
    { label: "All", value: "all" },
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" },
  ],
})

const frameworksCollection = createListCollection({
  items: [
    { label: "Next.js", value: "Next.js" },
    { label: "SvelteKit", value: "SvelteKit" },
    { label: "Nuxt.js", value: "Nuxt.js" },
    { label: "Remix", value: "Remix" },
    { label: "Astro", value: "Astro" },
  ],
})

function SelectBasic() {
  return (
    <Example title="Basic">
      <Select collection={fruitsWithDisabledCollection}>
        <SelectControl>
          <SelectTrigger>
            <SelectValue placeholder="Select a fruit" />
          </SelectTrigger>
          <SelectIndicator />
        </SelectControl>
        <SelectContent>
          <SelectItemGroup>
            {fruitsWithDisabledCollection.items.map((item) => (
              <SelectItem key={item.value} item={item}>
                <SelectItemText>{item.label}</SelectItemText>
                <SelectItemIndicator />
              </SelectItem>
            ))}
          </SelectItemGroup>
        </SelectContent>
      </Select>
    </Example>
  )
}

const chartIcons: Record<string, React.ReactNode> = {
  line: (
    <IconPlaceholder
      lucide="ChartLineIcon"
      tabler="IconChartLine"
      hugeicons="Chart03Icon"
      phosphor="ChartBarIcon"
      remixicon="RiBarChartLine"
    />
  ),
  bar: (
    <IconPlaceholder
      lucide="ChartBarIcon"
      tabler="IconChartBar"
      hugeicons="Chart03Icon"
      phosphor="ChartBarIcon"
      remixicon="RiBarChartLine"
    />
  ),
  pie: (
    <IconPlaceholder
      lucide="ChartPieIcon"
      tabler="IconChartPie"
      hugeicons="Chart03Icon"
      phosphor="ChartPieIcon"
      remixicon="RiPieChartLine"
    />
  ),
}

function SelectWithIcons() {
  return (
    <Example title="With Icons">
      <div className="flex flex-col gap-4">
        <Select collection={chartCollection}>
          <SelectControl>
            <SelectTrigger size="sm">
              <SelectValue
                placeholder={
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
                }
              />
            </SelectTrigger>
            <SelectIndicator />
          </SelectControl>
          <SelectContent>
            <SelectItemGroup>
              {chartCollection.items.map((item) => (
                <SelectItem key={item.value} item={item}>
                  <SelectItemText>
                    {chartIcons[item.value]}
                    {item.label}
                  </SelectItemText>
                  <SelectItemIndicator />
                </SelectItem>
              ))}
            </SelectItemGroup>
          </SelectContent>
        </Select>
        <Select collection={chartCollection}>
          <SelectControl>
            <SelectTrigger size="default">
              <SelectValue
                placeholder={
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
                }
              />
            </SelectTrigger>
            <SelectIndicator />
          </SelectControl>
          <SelectContent>
            <SelectItemGroup>
              {chartCollection.items.map((item) => (
                <SelectItem key={item.value} item={item}>
                  <SelectItemText>
                    {chartIcons[item.value]}
                    {item.label}
                  </SelectItemText>
                  <SelectItemIndicator />
                </SelectItem>
              ))}
            </SelectItemGroup>
          </SelectContent>
        </Select>
      </div>
    </Example>
  )
}

function SelectWithGroups() {
  return (
    <Example title="With Groups & Labels">
      <Select collection={fruitsAndVegetablesCollection}>
        <SelectControl>
          <SelectTrigger>
            <SelectValue placeholder="Select a fruit" />
          </SelectTrigger>
          <SelectIndicator />
        </SelectControl>
        <SelectContent>
          {fruitsAndVegetablesCollection.group().map(([type, group], index) => (
            <SelectItemGroup key={type}>
              {index > 0 && <SelectSeparator />}
              <SelectItemGroupLabel>
                {groupLabels[type] ?? type}
              </SelectItemGroupLabel>
              {group.map((item) => (
                <SelectItem key={item.value} item={item}>
                  <SelectItemText>{item.label}</SelectItemText>
                  <SelectItemIndicator />
                </SelectItem>
              ))}
            </SelectItemGroup>
          ))}
        </SelectContent>
      </Select>
    </Example>
  )
}

function SelectLargeList() {
  return (
    <Example title="Large List">
      <Select collection={largeListCollection}>
        <SelectControl>
          <SelectTrigger>
            <SelectValue placeholder="Select an item" />
          </SelectTrigger>
          <SelectIndicator />
        </SelectControl>
        <SelectContent>
          <SelectItemGroup>
            {largeListCollection.items.map((item) => (
              <SelectItem key={item.value} item={item}>
                <SelectItemText>{item.label}</SelectItemText>
                <SelectItemIndicator />
              </SelectItem>
            ))}
          </SelectItemGroup>
        </SelectContent>
      </Select>
    </Example>
  )
}

function SelectSizes() {
  return (
    <Example title="Sizes">
      <div className="flex flex-col gap-4">
        <Select collection={fruitsCollection}>
          <SelectControl>
            <SelectTrigger size="sm">
              <SelectValue placeholder="Small size" />
            </SelectTrigger>
            <SelectIndicator />
          </SelectControl>
          <SelectContent>
            <SelectItemGroup>
              {fruitsCollection.items.map((item) => (
                <SelectItem key={item.value} item={item}>
                  <SelectItemText>{item.label}</SelectItemText>
                  <SelectItemIndicator />
                </SelectItem>
              ))}
            </SelectItemGroup>
          </SelectContent>
        </Select>
        <Select collection={fruitsCollection}>
          <SelectControl>
            <SelectTrigger size="default">
              <SelectValue placeholder="Default size" />
            </SelectTrigger>
            <SelectIndicator />
          </SelectControl>
          <SelectContent>
            <SelectItemGroup>
              {fruitsCollection.items.map((item) => (
                <SelectItem key={item.value} item={item}>
                  <SelectItemText>{item.label}</SelectItemText>
                  <SelectItemIndicator />
                </SelectItem>
              ))}
            </SelectItemGroup>
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
          <Select collection={fruitsCollection}>
            <SelectControl>
              <SelectTrigger size="sm">
                <SelectValue placeholder="Small" />
              </SelectTrigger>
              <SelectIndicator />
            </SelectControl>
            <SelectContent>
              <SelectItemGroup>
                {fruitsCollection.items.map((item) => (
                  <SelectItem key={item.value} item={item}>
                    <SelectItemText>{item.label}</SelectItemText>
                    <SelectItemIndicator />
                  </SelectItem>
                ))}
              </SelectItemGroup>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            Submit
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Select collection={fruitsCollection}>
            <SelectControl>
              <SelectTrigger>
                <SelectValue placeholder="Default" />
              </SelectTrigger>
              <SelectIndicator />
            </SelectControl>
            <SelectContent>
              <SelectItemGroup>
                {fruitsCollection.items.map((item) => (
                  <SelectItem key={item.value} item={item}>
                    <SelectItemText>{item.label}</SelectItemText>
                    <SelectItemIndicator />
                  </SelectItem>
                ))}
              </SelectItemGroup>
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
    <Example title="Popper">
      <Select collection={fruitsWithDisabledCollection}>
        <SelectControl>
          <SelectTrigger>
            <SelectValue placeholder="Select a fruit" />
          </SelectTrigger>
          <SelectIndicator />
        </SelectControl>
        <SelectContent position="popper">
          <SelectItemGroup>
            {fruitsWithDisabledCollection.items.map((item) => (
              <SelectItem key={item.value} item={item}>
                <SelectItemText>{item.label}</SelectItemText>
                <SelectItemIndicator />
              </SelectItem>
            ))}
          </SelectItemGroup>
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
        <Select collection={fruitsCollection}>
          <SelectControl>
            <SelectTrigger id="select-fruit">
              <SelectValue placeholder="Select a fruit" />
            </SelectTrigger>
            <SelectIndicator />
          </SelectControl>
          <SelectContent>
            <SelectItemGroup>
              {fruitsCollection.items.map((item) => (
                <SelectItem key={item.value} item={item}>
                  <SelectItemText>{item.label}</SelectItemText>
                  <SelectItemIndicator />
                </SelectItem>
              ))}
            </SelectItemGroup>
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
        <Select collection={fruitsCollection}>
          <SelectControl>
            <SelectTrigger aria-invalid="true">
              <SelectValue placeholder="Select a fruit" />
            </SelectTrigger>
            <SelectIndicator />
          </SelectControl>
          <SelectContent>
            <SelectItemGroup>
              {fruitsCollection.items.map((item) => (
                <SelectItem key={item.value} item={item}>
                  <SelectItemText>{item.label}</SelectItemText>
                  <SelectItemIndicator />
                </SelectItem>
              ))}
            </SelectItemGroup>
          </SelectContent>
        </Select>
        <Field data-invalid>
          <FieldLabel htmlFor="select-fruit-invalid">Favorite Fruit</FieldLabel>
          <Select collection={fruitsCollection}>
            <SelectControl>
              <SelectTrigger id="select-fruit-invalid" aria-invalid>
                <SelectValue placeholder="Select a fruit" />
              </SelectTrigger>
              <SelectIndicator />
            </SelectControl>
            <SelectContent>
              <SelectItemGroup>
                {fruitsCollection.items.map((item) => (
                  <SelectItem key={item.value} item={item}>
                    <SelectItemText>{item.label}</SelectItemText>
                    <SelectItemIndicator />
                  </SelectItem>
                ))}
              </SelectItemGroup>
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
        <Select collection={filterCollection}>
          <SelectControl className="w-[140px]">
            <SelectTrigger>
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectIndicator />
          </SelectControl>
          <SelectContent>
            <SelectItemGroup>
              {filterCollection.items.map((item) => (
                <SelectItem key={item.value} item={item}>
                  <SelectItemText>{item.label}</SelectItemText>
                  <SelectItemIndicator />
                </SelectItem>
              ))}
            </SelectItemGroup>
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
      <Select collection={fruitsWithDisabledCollection} disabled>
        <SelectControl>
          <SelectTrigger>
            <SelectValue placeholder="Disabled" />
          </SelectTrigger>
          <SelectIndicator />
        </SelectControl>
        <SelectContent>
          <SelectItemGroup>
            {fruitsWithDisabledCollection.items.map((item) => (
              <SelectItem key={item.value} item={item}>
                <SelectItemText>{item.label}</SelectItemText>
                <SelectItemIndicator />
              </SelectItem>
            ))}
          </SelectItemGroup>
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

const plansCollection = createListCollection({
  items: plans.map((plan) => ({
    label: plan.name,
    value: plan.name,
    description: plan.description,
  })),
})

function SelectPlan() {
  const [plan, setPlan] = React.useState<string[]>([plans[0].name])

  const selectedPlan = plans.find((p) => p.name === plan[0])

  return (
    <Example title="Subscription Plan">
      <Select
        collection={plansCollection}
        value={plan}
        onValueChange={(details: SelectValueChangeDetails) =>
          setPlan(details.value)
        }
      >
        <SelectControl>
          <SelectTrigger className="h-auto! w-72">
            <SelectValue>
              {selectedPlan && <SelectPlanItem plan={selectedPlan} />}
            </SelectValue>
          </SelectTrigger>
          <SelectIndicator />
        </SelectControl>
        <SelectContent>
          <SelectItemGroup>
            {plansCollection.items.map((item) => (
              <SelectItem key={item.value} item={item}>
                <SelectItemText>
                  <SelectPlanItem
                    plan={{
                      name: item.label,
                      description: item.description,
                    }}
                  />
                </SelectItemText>
                <SelectItemIndicator />
              </SelectItem>
            ))}
          </SelectItemGroup>
        </SelectContent>
      </Select>
    </Example>
  )
}

function SelectPlanItem({ plan }: { plan: (typeof plans)[number] }) {
  return (
    <Item size="xs" className="w-full p-0">
      <ItemContent className="gap-0">
        <ItemTitle>{plan.name}</ItemTitle>
        <ItemDescription className="text-xs">
          {plan.description}
        </ItemDescription>
      </ItemContent>
    </Item>
  )
}

function SelectInDialog() {
  return (
    <Example title="In Dialog">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Open Dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Example</DialogTitle>
            <DialogDescription>
              Use the select below to choose a fruit.
            </DialogDescription>
          </DialogHeader>
          <Select collection={fruitsCollection}>
            <SelectControl>
              <SelectTrigger>
                <SelectValue placeholder="Select a fruit" />
              </SelectTrigger>
              <SelectIndicator />
            </SelectControl>
            <SelectContent>
              <SelectItemGroup>
                {fruitsCollection.items.map((item) => (
                  <SelectItem key={item.value} item={item}>
                    <SelectItemText>{item.label}</SelectItemText>
                    <SelectItemIndicator />
                  </SelectItem>
                ))}
              </SelectItemGroup>
            </SelectContent>
          </Select>
        </DialogContent>
      </Dialog>
    </Example>
  )
}
