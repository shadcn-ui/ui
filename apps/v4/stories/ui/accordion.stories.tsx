import type { Meta, StoryObj } from "@storybook/react"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/registry/new-york-v4/ui/accordion"

const meta: Meta<typeof Accordion> = {
  title: "UI/Accordion",
  component: Accordion,
  parameters: { layout: "centered" },
}

export default meta
type Story = StoryObj<typeof Accordion>

export const Single: Story = {
  name: "Single (Default)",
  render: () => (
    <Accordion type="single" collapsible className="w-[400px]">
      <AccordionItem value="item-1">
        <AccordionTrigger>Is it accessible?</AccordionTrigger>
        <AccordionContent>
          Yes. It adheres to the WAI-ARIA design pattern for accordions.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Is it styled?</AccordionTrigger>
        <AccordionContent>
          Yes. It comes with default styles that match the other components'
          aesthetic.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Is it animated?</AccordionTrigger>
        <AccordionContent>
          Yes. It's animated by default, but you can disable it if you prefer.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
}

export const Multiple: Story = {
  render: () => (
    <Accordion
      type="multiple"
      defaultValue={["item-1", "item-3"]}
      className="w-[400px]"
    >
      <AccordionItem value="item-1">
        <AccordionTrigger>Can I open multiple items?</AccordionTrigger>
        <AccordionContent>
          Yes. Set type to "multiple" to allow opening several items at once.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>How does default value work?</AccordionTrigger>
        <AccordionContent>
          Pass an array of values to defaultValue to control which items start
          open.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Is it composable?</AccordionTrigger>
        <AccordionContent>
          Absolutely. Each AccordionItem, AccordionTrigger, and AccordionContent
          can be styled independently.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
}

export const DefaultOpen: Story = {
  name: "Default Open",
  render: () => (
    <Accordion
      type="single"
      collapsible
      defaultValue="item-2"
      className="w-[400px]"
    >
      <AccordionItem value="item-1">
        <AccordionTrigger>First section</AccordionTrigger>
        <AccordionContent>
          Content for the first section. This one starts collapsed.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Second section (starts open)</AccordionTrigger>
        <AccordionContent>
          This section is open by default via the defaultValue prop.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Third section</AccordionTrigger>
        <AccordionContent>
          Content for the third section. Also starts collapsed.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
}

export const Disabled: Story = {
  render: () => (
    <Accordion type="single" collapsible className="w-[400px]">
      <AccordionItem value="item-1">
        <AccordionTrigger>Available item</AccordionTrigger>
        <AccordionContent>This item can be toggled normally.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2" disabled>
        <AccordionTrigger>Disabled item</AccordionTrigger>
        <AccordionContent>
          You should not be able to see this content.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Another available item</AccordionTrigger>
        <AccordionContent>
          This item can also be toggled normally.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
}
