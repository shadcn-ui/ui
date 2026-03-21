"use client"

import * as React from "react"

import {
  Example,
  ExampleWrapper,
} from "@/registry/bases/ark/components/example"
import { Button } from "@/registry/bases/ark/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/registry/bases/ark/ui/dialog"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/registry/bases/ark/ui/field"
import { Input } from "@/registry/bases/ark/ui/input"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/registry/bases/ark/ui/item"
import {
  NativeSelect,
  NativeSelectOption,
} from "@/registry/bases/ark/ui/native-select"
import {
  createListCollection,
  Select,
  SelectContent,
  SelectItem,
  SelectItemGroup,
  SelectItemGroupLabel,
  SelectItemIndicator,
  SelectItemText,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  type SelectValueChangeDetails,
} from "@/registry/bases/ark/ui/select"
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

const fruitsOnlyCollection = createListCollection({
  items: [
    { label: "Apple", value: "apple" },
    { label: "Banana", value: "banana" },
    { label: "Blueberry", value: "blueberry" },
  ],
})

const vegetablesCollection = createListCollection({
  items: [
    { label: "Carrot", value: "carrot" },
    { label: "Broccoli", value: "broccoli" },
    { label: "Spinach", value: "spinach" },
  ],
})

const fruitsAndVegetablesCollection = createListCollection({
  items: [...fruitsOnlyCollection.items, ...vegetablesCollection.items],
})

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
        <SelectTrigger>
          <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
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
        <SelectTrigger>
          <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
        <SelectContent>
          <SelectItemGroup>
            <SelectItemGroupLabel>Fruits</SelectItemGroupLabel>
            {fruitsOnlyCollection.items.map((item) => (
              <SelectItem key={item.value} item={item}>
                <SelectItemText>{item.label}</SelectItemText>
                <SelectItemIndicator />
              </SelectItem>
            ))}
          </SelectItemGroup>
          <SelectSeparator />
          <SelectItemGroup>
            <SelectItemGroupLabel>Vegetables</SelectItemGroupLabel>
            {vegetablesCollection.items.map((item) => (
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

function SelectLargeList() {
  return (
    <Example title="Large List">
      <Select collection={largeListCollection}>
        <SelectTrigger>
          <SelectValue placeholder="Select an item" />
        </SelectTrigger>
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
        <Select collection={fruitsOnlyCollection}>
          <SelectTrigger size="sm">
            <SelectValue placeholder="Small size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItemGroup>
              {fruitsOnlyCollection.items.map((item) => (
                <SelectItem key={item.value} item={item}>
                  <SelectItemText>{item.label}</SelectItemText>
                  <SelectItemIndicator />
                </SelectItem>
              ))}
            </SelectItemGroup>
          </SelectContent>
        </Select>
        <Select collection={fruitsOnlyCollection}>
          <SelectTrigger size="default">
            <SelectValue placeholder="Default size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItemGroup>
              {fruitsOnlyCollection.items.map((item) => (
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
          <Select collection={fruitsOnlyCollection}>
            <SelectTrigger size="sm">
              <SelectValue placeholder="Small" />
            </SelectTrigger>
            <SelectContent>
              <SelectItemGroup>
                {fruitsOnlyCollection.items.map((item) => (
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
          <Select collection={fruitsOnlyCollection}>
            <SelectTrigger>
              <SelectValue placeholder="Default" />
            </SelectTrigger>
            <SelectContent>
              <SelectItemGroup>
                {fruitsOnlyCollection.items.map((item) => (
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
        <SelectTrigger>
          <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
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
          <SelectTrigger id="select-fruit">
            <SelectValue placeholder="Select a fruit" />
          </SelectTrigger>
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
          <SelectTrigger aria-invalid="true">
            <SelectValue placeholder="Select a fruit" />
          </SelectTrigger>
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
            <SelectTrigger id="select-fruit-invalid" aria-invalid>
              <SelectValue placeholder="Select a fruit" />
            </SelectTrigger>
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
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
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
        <SelectTrigger>
          <SelectValue placeholder="Disabled" />
        </SelectTrigger>
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
        <SelectTrigger className="h-auto! w-72">
          <SelectValue>
            {selectedPlan && <SelectPlanItem plan={selectedPlan} />}
          </SelectValue>
        </SelectTrigger>
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
            <SelectTrigger>
              <SelectValue placeholder="Select a fruit" />
            </SelectTrigger>
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
