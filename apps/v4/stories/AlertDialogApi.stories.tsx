import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { AlertDialog } from "../registry/new-york-v4/ui/alert-dialog"

const meta = {
  title: "Shadcn/Components/Alert Dialog",
  component: AlertDialog,
  tags: ["autodocs"],
} satisfies Meta<typeof AlertDialog>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
