import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../registry/new-york-v4/ui/card"

const meta = {
  title: "Shadcn/Components/Card",
  component: Card,
  tags: ["autodocs"],
  render: (args) => (
    <Card {...args} className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Card title</CardTitle>
        <CardDescription>Card description</CardDescription>
      </CardHeader>
      <CardContent>Card content</CardContent>
    </Card>
  ),
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    defaultChecked: {},
    draggable: {},
  },
}
