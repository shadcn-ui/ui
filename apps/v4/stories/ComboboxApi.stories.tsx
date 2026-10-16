import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "../registry/new-york-v4/ui/combobox"

const meta = {
  title: "Shadcn/Components/Combobox",
  component: Combobox,
  tags: ["autodocs"],
  render: (args) => (
    <Combobox {...args}>
      <ComboboxInput placeholder="Choose a framework" />
      <ComboboxContent>
        <ComboboxList>
          <ComboboxItem value="next">Next.js</ComboboxItem>
          <ComboboxItem value="react">React</ComboboxItem>
          <ComboboxItem value="vite">Vite</ComboboxItem>
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  ),
} satisfies Meta<typeof Combobox>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
