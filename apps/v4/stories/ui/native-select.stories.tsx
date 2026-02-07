import type { Meta, StoryObj } from "@storybook/react"

import { Label } from "@/registry/new-york-v4/ui/label"
import {
  NativeSelect,
  NativeSelectOptGroup,
  NativeSelectOption,
} from "@/registry/new-york-v4/ui/native-select"

const meta: Meta<typeof NativeSelect> = {
  title: "UI/NativeSelect",
  component: NativeSelect,
  parameters: { layout: "centered" },
}

export default meta
type Story = StoryObj<typeof NativeSelect>

export const Default: Story = {
  render: () => (
    <NativeSelect>
      <NativeSelectOption value="">Select a fruit</NativeSelectOption>
      <NativeSelectOption value="apple">Apple</NativeSelectOption>
      <NativeSelectOption value="banana">Banana</NativeSelectOption>
      <NativeSelectOption value="cherry">Cherry</NativeSelectOption>
    </NativeSelect>
  ),
}

export const WithLabel: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="country">Country</Label>
      <NativeSelect id="country">
        <NativeSelectOption value="">Select a country</NativeSelectOption>
        <NativeSelectOption value="us">United States</NativeSelectOption>
        <NativeSelectOption value="uk">United Kingdom</NativeSelectOption>
        <NativeSelectOption value="ca">Canada</NativeSelectOption>
        <NativeSelectOption value="au">Australia</NativeSelectOption>
      </NativeSelect>
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <NativeSelect disabled>
      <NativeSelectOption value="">Disabled select</NativeSelectOption>
      <NativeSelectOption value="1">Option 1</NativeSelectOption>
    </NativeSelect>
  ),
}

export const WithOptGroups: Story = {
  render: () => (
    <NativeSelect>
      <NativeSelectOption value="">Select a car</NativeSelectOption>
      <NativeSelectOptGroup label="Swedish Cars">
        <NativeSelectOption value="volvo">Volvo</NativeSelectOption>
        <NativeSelectOption value="saab">Saab</NativeSelectOption>
      </NativeSelectOptGroup>
      <NativeSelectOptGroup label="German Cars">
        <NativeSelectOption value="mercedes">Mercedes</NativeSelectOption>
        <NativeSelectOption value="audi">Audi</NativeSelectOption>
      </NativeSelectOptGroup>
    </NativeSelect>
  ),
}
