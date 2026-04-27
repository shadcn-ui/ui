import type { Meta, StoryObj } from "@storybook/react-vite"
import { useState } from "react"
import {
  Button,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@leadbank/ui"

const meta: Meta<typeof DropdownMenu> = {
  title: "Components/DropdownMenu",
  component: DropdownMenu,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Lead dropdown menu built on @radix-ui/react-dropdown-menu. Compose with DropdownMenuTrigger + DropdownMenuContent containing DropdownMenuItem (regular), DropdownMenuCheckboxItem (multi-select), DropdownMenuRadioGroup + DropdownMenuRadioItem (single-select), DropdownMenuLabel (section heading), DropdownMenuSeparator, DropdownMenuGroup, and submenus via DropdownMenuSub*.",
      },
    },
    layout: "padded",
  },
}

export default meta

type Story = StoryObj<typeof DropdownMenu>

export const Basic: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Open menu</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Account</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Billing</DropdownMenuItem>
          <DropdownMenuItem>Team</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Sign out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
}

export const WithCheckboxItems: Story = {
  name: "Checkbox items",
  render: () => {
    function Wrap() {
      const [showSidebar, setShowSidebar] = useState(true)
      const [showStatusBar, setShowStatusBar] = useState(true)
      const [showActivity, setShowActivity] = useState(false)
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">View options</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Appearance</DropdownMenuLabel>
            <DropdownMenuCheckboxItem
              checked={showSidebar}
              onCheckedChange={setShowSidebar}
            >
              Sidebar
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={showStatusBar}
              onCheckedChange={setShowStatusBar}
            >
              Status bar
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={showActivity}
              onCheckedChange={setShowActivity}
              disabled
            >
              Activity panel (disabled)
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
    return <Wrap />
  },
}

export const WithRadioItems: Story = {
  name: "Radio items",
  render: () => {
    function Wrap() {
      const [position, setPosition] = useState("bottom")
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Panel position</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Position</DropdownMenuLabel>
            <DropdownMenuRadioGroup
              value={position}
              onValueChange={setPosition}
            >
              <DropdownMenuRadioItem value="top">Top</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="bottom">
                Bottom
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="right">Right</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
    return <Wrap />
  },
}

export const DisabledItems: Story = {
  name: "Disabled items",
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Actions</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>Edit</DropdownMenuItem>
        <DropdownMenuItem disabled>
          Duplicate (read-only role)
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled>Delete (admin only)</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
}

export const WithSubmenu: Story = {
  name: "With submenu",
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">File</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>New project</DropdownMenuItem>
        <DropdownMenuItem>Open…</DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Open recent</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem>lead-design-system</DropdownMenuItem>
            <DropdownMenuItem>internal-dashboard</DropdownMenuItem>
            <DropdownMenuItem>billing-rewrite</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Save</DropdownMenuItem>
        <DropdownMenuItem>Save as…</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
}
