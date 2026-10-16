import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { Button } from "../registry/new-york-v4/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../registry/new-york-v4/ui/collapsible"

const meta = {
  title: "Shadcn/Components/Collapsible",
  component: Collapsible,
  tags: ["autodocs"],
  args: { defaultOpen: true },
  render: (args) => (
    <Collapsible {...args} className="w-full max-w-sm space-y-2">
      <CollapsibleTrigger asChild>
        <Button variant="outline">Toggle details</Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="rounded-md border p-4">
        Collapsible content
      </CollapsibleContent>
    </Collapsible>
  ),
} satisfies Meta<typeof Collapsible>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
