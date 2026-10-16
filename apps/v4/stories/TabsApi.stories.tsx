import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../registry/new-york-v4/ui/tabs"

const meta = {
  title: "Shadcn/Components/Tabs",
  component: Tabs,
  tags: ["autodocs"],
  args: { defaultValue: "overview" },
  render: (args) => (
    <Tabs {...args} className="w-full max-w-sm">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="details">Details</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">Overview content</TabsContent>
      <TabsContent value="details">Details content</TabsContent>
    </Tabs>
  ),
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
