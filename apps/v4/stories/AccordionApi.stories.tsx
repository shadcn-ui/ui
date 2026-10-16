import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../registry/new-york-v4/ui/accordion"

const meta = {
  title: "Shadcn/Components/Accordion",
  component: Accordion,
  tags: ["autodocs"],
  args: { type: "single", collapsible: true },
  render: (args) => (
    <Accordion {...args} className="w-full max-w-lg">
      <AccordionItem value="item-1">
        <AccordionTrigger>Is the API configurable?</AccordionTrigger>
        <AccordionContent>
          Yes. Change the Accordion props in Controls to preview its behavior.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
} satisfies Meta<typeof Accordion>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    type: "multiple",
  },
}
