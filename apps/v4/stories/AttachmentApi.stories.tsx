import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { Attachment } from "../registry/new-york-v4/ui/attachment"

const meta = {
  title: "Shadcn/Components/Attachment",
  component: Attachment,
  tags: ["autodocs"],
} satisfies Meta<typeof Attachment>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
