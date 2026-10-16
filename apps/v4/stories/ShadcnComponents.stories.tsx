import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import AccordionDemo from "../registry/new-york-v4/examples/accordion-demo"
import AlertDemo from "../registry/new-york-v4/examples/alert-demo"
import AvatarDemo from "../registry/new-york-v4/examples/avatar-demo"
import BadgeDemo from "../registry/new-york-v4/examples/badge-demo"
import BreadcrumbDemo from "../registry/new-york-v4/examples/breadcrumb-demo"
import CardDemo from "../registry/new-york-v4/examples/card-demo"
import CheckboxDemo from "../registry/new-york-v4/examples/checkbox-demo"
import CollapsibleDemo from "../registry/new-york-v4/examples/collapsible-demo"
import ComboboxDemo from "../registry/new-york-v4/examples/combobox-demo"
import DialogDemo from "../registry/new-york-v4/examples/dialog-demo"
import DropdownMenuDemo from "../registry/new-york-v4/examples/dropdown-menu-demo"
import InputDemo from "../registry/new-york-v4/examples/input-demo"
import PaginationDemo from "../registry/new-york-v4/examples/pagination-demo"
import ProgressDemo from "../registry/new-york-v4/examples/progress-demo"
import RadioGroupDemo from "../registry/new-york-v4/examples/radio-group-demo"
import SelectDemo from "../registry/new-york-v4/examples/select-demo"
import SliderDemo from "../registry/new-york-v4/examples/slider-demo"
import SwitchDemo from "../registry/new-york-v4/examples/switch-demo"
import TabsDemo from "../registry/new-york-v4/examples/tabs-demo"
import TextareaDemo from "../registry/new-york-v4/examples/textarea-demo"
import ToggleDemo from "../registry/new-york-v4/examples/toggle-demo"
import ToggleGroupDemo from "../registry/new-york-v4/examples/toggle-group-demo"
import TooltipDemo from "../registry/new-york-v4/examples/tooltip-demo"
import { TooltipProvider } from "../registry/new-york-v4/ui/tooltip"

const meta = {
  title: "Shadcn/Examples",
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Accordion: Story = { render: () => <AccordionDemo /> }
export const Alert: Story = { render: () => <AlertDemo /> }
export const Avatar: Story = { render: () => <AvatarDemo /> }
export const Badge: Story = { render: () => <BadgeDemo /> }
export const Breadcrumb: Story = { render: () => <BreadcrumbDemo /> }
export const Card: Story = { render: () => <CardDemo /> }
export const Checkbox: Story = { render: () => <CheckboxDemo /> }
export const Collapsible: Story = { render: () => <CollapsibleDemo /> }
export const Combobox: Story = { render: () => <ComboboxDemo /> }
export const Dialog: Story = { render: () => <DialogDemo /> }
export const DropdownMenu: Story = { render: () => <DropdownMenuDemo /> }
export const Input: Story = { render: () => <InputDemo /> }
export const Pagination: Story = { render: () => <PaginationDemo /> }
export const Progress: Story = { render: () => <ProgressDemo /> }
export const RadioGroup: Story = { render: () => <RadioGroupDemo /> }
export const Select: Story = { render: () => <SelectDemo /> }
export const Slider: Story = { render: () => <SliderDemo /> }
export const Switch: Story = { render: () => <SwitchDemo /> }
export const Tabs: Story = { render: () => <TabsDemo /> }
export const Textarea: Story = { render: () => <TextareaDemo /> }
export const Toggle: Story = { render: () => <ToggleDemo /> }
export const ToggleGroup: Story = { render: () => <ToggleGroupDemo /> }
export const Tooltip: Story = {
  render: () => (
    <TooltipProvider>
      <TooltipDemo />
    </TooltipProvider>
  ),
}
