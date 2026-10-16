import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { InputOTP } from "../registry/new-york-v4/ui/input-otp"

const meta = {
  title: "Shadcn/Components/Input OTP",
  component: InputOTP,
  tags: ["autodocs"],
  args: { maxLength: 6 },
} satisfies Meta<typeof InputOTP>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
