import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { Label } from "../registry/new-york-v4/ui/label"
import {
  RadioGroup,
  RadioGroupItem,
} from "../registry/new-york-v4/ui/radio-group"

const meta = {
  title: "Shadcn/Components/Radio Group",
  component: RadioGroup,
  tags: ["autodocs"],
  args: { defaultValue: "comfortable" },
  render: (args) => (
    <RadioGroup {...args}>
      <div className="flex items-center gap-3">
        <RadioGroupItem value="default" id="radio-default" />
        <Label htmlFor="radio-default">Default</Label>
      </div>
      <div className="flex items-center gap-3">
        <RadioGroupItem value="comfortable" id="radio-comfortable" />
        <Label htmlFor="radio-comfortable">Comfortable</Label>
      </div>
      <div className="flex items-center gap-3">
        <RadioGroupItem value="compact" id="radio-compact" />
        <Label htmlFor="radio-compact">Compact</Label>
      </div>
    </RadioGroup>
  ),
} satisfies Meta<typeof RadioGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
