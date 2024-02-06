import type { Meta, StoryObj } from "@storybook/react"
import { CommandSeparator } from "cmdk"
import {
  Calculator,
  Calendar,
  CreditCard,
  Settings,
  Smile,
  User,
} from "lucide-react"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/registry/default/ui/command"

/**
 * Fast, composable, unstyled command menu for React.
 */
const meta = {
  title: "ui/Command",
  component: Command,
  tags: ["autodocs"],
  argTypes: {},
  args: {
    className: "rounded-lg w-96 border shadow-md",
  },
  render: (args) => (
    <Command {...args}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem>Calendar</CommandItem>
          <CommandItem>Search Emoji</CommandItem>
          <CommandItem>Calculator</CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Settings">
          <CommandItem>Profile</CommandItem>
          <CommandItem>Billing</CommandItem>
          <CommandItem>Settings</CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Command>

export default meta

type Story = StoryObj<typeof meta>

/**
 * The default form of the command.
 */
export const Default: Story = {}
