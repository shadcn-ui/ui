import type { Meta, StoryObj } from "@storybook/react"
import { MailIcon, SearchIcon, EyeIcon } from "lucide-react"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/registry/new-york-v4/ui/input-group"
import { Kbd } from "@/registry/new-york-v4/ui/kbd"

const meta: Meta<typeof InputGroup> = {
  title: "UI/InputGroup",
  component: InputGroup,
  parameters: { layout: "centered" },
}

export default meta
type Story = StoryObj<typeof InputGroup>

export const Default: Story = {
  render: () => (
    <InputGroup className="w-80">
      <InputGroupAddon align="inline-start">
        <SearchIcon />
      </InputGroupAddon>
      <InputGroupInput placeholder="Search..." />
    </InputGroup>
  ),
}

export const WithCurrencyPrefix: Story = {
  render: () => (
    <InputGroup className="w-80">
      <InputGroupAddon align="inline-start">$</InputGroupAddon>
      <InputGroupInput placeholder="0.00" type="number" />
    </InputGroup>
  ),
}

export const WithEmailSuffix: Story = {
  render: () => (
    <InputGroup className="w-80">
      <InputGroupAddon align="inline-start">
        <MailIcon />
      </InputGroupAddon>
      <InputGroupInput placeholder="you@example.com" type="email" />
    </InputGroup>
  ),
}

export const WithButton: Story = {
  render: () => (
    <InputGroup className="w-80">
      <InputGroupInput placeholder="Enter password" type="password" />
      <InputGroupAddon align="inline-end">
        <InputGroupButton>
          <EyeIcon />
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  ),
}

export const WithKbd: Story = {
  render: () => (
    <InputGroup className="w-80">
      <InputGroupAddon align="inline-start">
        <SearchIcon />
      </InputGroupAddon>
      <InputGroupInput placeholder="Search..." />
      <InputGroupAddon align="inline-end">
        <Kbd>⌘K</Kbd>
      </InputGroupAddon>
    </InputGroup>
  ),
}
