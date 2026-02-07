import type { Meta, StoryObj } from "@storybook/react"
import { AlertCircle, Terminal } from "lucide-react"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/registry/new-york-v4/ui/alert"

const meta: Meta<typeof Alert> = {
  title: "UI/Alert",
  component: Alert,
  parameters: { layout: "centered" },
}

export default meta
type Story = StoryObj<typeof Alert>

export const Default: Story = {
  render: () => (
    <Alert className="w-[420px]">
      <Terminal />
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>
        You can add components to your app using the cli.
      </AlertDescription>
    </Alert>
  ),
}

export const Destructive: Story = {
  render: () => (
    <Alert variant="destructive" className="w-[420px]">
      <AlertCircle />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        Your session has expired. Please log in again.
      </AlertDescription>
    </Alert>
  ),
}

export const WithoutIcon: Story = {
  render: () => (
    <Alert className="w-[420px]">
      <AlertTitle>Notice</AlertTitle>
      <AlertDescription>This alert does not have an icon.</AlertDescription>
    </Alert>
  ),
}
