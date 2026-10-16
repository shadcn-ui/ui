import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "../registry/new-york-v4/ui/alert"

const meta = {
  title: "Shadcn/Components/Alert",
  component: Alert,
  tags: ["autodocs"],
  args: { variant: "default" },
  render: (args) => (
    <Alert {...args}>
      <AlertTitle>Heads up</AlertTitle>
      <AlertDescription>
        This preview is composed from the registry Alert components.
      </AlertDescription>
    </Alert>
  ),
} satisfies Meta<typeof Alert>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    unselectable: "undefined",
    popover: "hint",
    inputMode: "search",
    "aria-sort": "descending",
    translate: "no",
    "aria-autocomplete": "undefined",
  },
}
