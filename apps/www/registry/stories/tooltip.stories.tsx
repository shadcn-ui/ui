import { Meta, StoryObj } from "@storybook/react"
import { Plus } from "lucide-react"

import { Button } from "@/registry/default/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/registry/default/ui/tooltip"

/**
 * A popup that displays information related to an element when the element 
 * receives keyboard focus or the mouse hovers over it.
 */
const meta: Meta<typeof Tooltip> = {
  title: "ui/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
  argTypes: {},
}
export default meta

type Story = StoryObj<typeof Tooltip>

export const Base: Story = {
  render: (args) => (
    <TooltipProvider>
      <Tooltip {...args}>
        <TooltipTrigger asChild>
          <Button variant="outline" className="w-10 rounded-full p-0">
            <Plus className="h-4 w-4" />
            <span className="sr-only">Add</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Add to library</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
  args: {},
}
