---
title: Combobox
description: Autocomplete input with a list of suggestions.
base: aria
component: true
links:
  doc: https://react-aria.adobe.com/ComboBox
  api: https://react-aria.adobe.com/ComboBox#api
---

<ComponentPreview
  styleName="aria-nova"
  name="combobox-demo"
  description="A combobox with a list of frameworks."
/>

## Installation

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">Command</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add combobox
```

</TabsContent>
<TabsContent value="manual">

<Steps className="mb-0 pt-2">

<Step>Install the following dependencies:</Step>

```bash
npm install react-aria-components
```

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource
  name="combobox"
  title="components/ui/combobox.tsx"
  styleName="aria-nova"
/>

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Usage

```tsx showLineNumbers
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
```

```tsx showLineNumbers
const frameworks = ["Next.js", "SvelteKit", "Nuxt.js", "Remix", "Astro"]

export function ExampleCombobox() {
  return (
    <Combobox allowsEmptyCollection>
      <ComboboxInput placeholder="Select a framework" />
      <ComboboxContent>
        <ComboboxList
          renderEmptyState={() => (
            <ComboboxEmpty>No items found.</ComboboxEmpty>
          )}
        >
          {frameworks.map((item) => (
            <ComboboxItem key={item} id={item}>
              {item}
            </ComboboxItem>
          ))}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}
```

## Composition

### Simple

A single-line input and a flat list (see [Basic](#basic)).

```text
Combobox
├── ComboboxInput
└── ComboboxContent
    └── ComboboxList
        ├── ComboboxItem
        └── ComboboxItem
```

### With chips

Multi-select with `multiple`, chips, and a chips input (see [Multiple](#multiple)).

```text
Combobox
├── ComboboxChips
│   ├── ComboboxChipList
│   │   └── ComboboxChip
│   └── ComboboxChipsInput
└── ComboboxContent
    └── ComboboxList
        ├── ComboboxItem
        └── ComboboxItem
```

### With groups and collection

Nested items per group using `ComboboxGroup`, with a separator between groups (see [Groups](#groups)).

```text
Combobox
├── ComboboxInput
└── ComboboxContent
    └── ComboboxList
        ├── ComboboxGroup
        │   ├── ComboboxLabel
        │   ├── ComboboxItem
        │   └── ComboboxItem
        ├── ComboboxSeparator
        └── ComboboxGroup
            ├── ComboboxLabel
            ├── ComboboxItem
            └── ComboboxItem
```

## Custom Items

Use `textValue` when your items render JSX children.

```tsx showLineNumbers
import * as React from "react"

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"

type Framework = {
  label: string
  value: string
}

const frameworks: Framework[] = [
  { label: "Next.js", value: "next" },
  { label: "SvelteKit", value: "sveltekit" },
  { label: "Nuxt", value: "nuxt" },
]

export function ExampleComboboxCustomItems() {
  return (
    <Combobox allowsEmptyCollection>
      <ComboboxInput placeholder="Select a framework" />
      <ComboboxContent>
        <ComboboxList
          renderEmptyState={() => (
            <ComboboxEmpty>No items found.</ComboboxEmpty>
          )}
          items={frameworks}
        >
          {(framework) => (
            <ComboboxItem id={framework.value} textValue={framework.label}>
              <span>{framework.label}</span>
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}
```

## Multiple Selection

Use `multiple` with chips for multi-select behavior.

```tsx showLineNumbers
import * as React from "react"

import {
  Combobox,
  ComboboxChip,
  ComboboxChipList,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"

const frameworks = ["Next.js", "SvelteKit", "Nuxt.js", "Remix", "Astro"]

export function ExampleComboboxMultiple() {
  const [value, setValue] = React.useState<string[]>([])

  return (
    <Combobox
      selectionMode="multiple"
      value={value}
      onChange={setValue}
      allowsEmptyCollection
    >
      <ComboboxChips>
        <ComboboxChipList<{ name: string }>>
          {(value) => <ComboboxChip id={value.name}>{value.name}</ComboboxChip>}
        </ComboboxChipList>
        <ComboboxChipsInput placeholder="Add framework" />
      </ComboboxChips>
      <ComboboxContent>
        <ComboboxList
          renderEmptyState={() => (
            <ComboboxEmpty>No items found.</ComboboxEmpty>
          )}
        >
          {frameworks.map((item) => (
            <ComboboxItem key={item} id={item}>
              {item}
            </ComboboxItem>
          ))}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}
```

## Basic

A simple combobox with a list of frameworks.

<ComponentPreview styleName="aria-nova" name="combobox-basic" />

## Multiple

A combobox with multiple selection using `multiple` and `ComboboxChips`.

<ComponentPreview styleName="aria-nova" name="combobox-multiple" />

## Clear Button

Use the `showClear` prop to show a clear button.

<ComponentPreview styleName="aria-nova" name="combobox-clear" />

## Groups

Use `ComboboxGroup` and `ComboboxSeparator` to group items.

<ComponentPreview styleName="aria-nova" name="combobox-groups" />

## Custom Items

You can render custom component inside `ComboboxItem`.

<ComponentPreview styleName="aria-nova" name="combobox-custom" />

## Invalid

Use the `isInvalid` prop to make the combobox invalid.

<ComponentPreview styleName="aria-nova" name="combobox-invalid" />

## Disabled

Use the `isDisabled` prop to disable the combobox.

<ComponentPreview styleName="aria-nova" name="combobox-disabled" />

## Input Group

You can add an addon to the combobox by using the `InputGroupAddon` component inside the `ComboboxInput`.

<ComponentPreview styleName="aria-nova" name="combobox-input-group" />

## RTL

To enable RTL support in shadcn/ui, see the [RTL configuration guide](/docs/rtl).

<ComponentPreview
  styleName="aria-nova"
  name="combobox-rtl"
  direction="rtl"
  align="start"
/>

## API Reference

See the [React Aria](https://react-aria.adobe.com/ComboBox#api) documentation for more information.
