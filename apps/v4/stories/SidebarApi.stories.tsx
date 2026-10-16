import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import {
  Sidebar,
  SidebarContent,
  SidebarProvider,
} from "../registry/new-york-v4/ui/sidebar"

const meta = {
  title: "Shadcn/Components/Sidebar",
  component: Sidebar,
  tags: ["autodocs"],
  render: (args) => (
    <SidebarProvider>
      <Sidebar {...args}>
        <SidebarContent>Sidebar content</SidebarContent>
      </Sidebar>
    </SidebarProvider>
  ),
} satisfies Meta<typeof Sidebar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
