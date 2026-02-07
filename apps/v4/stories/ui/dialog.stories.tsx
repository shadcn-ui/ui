import type { Meta, StoryObj } from "@storybook/react"

import { Button } from "@/registry/new-york-v4/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/registry/new-york-v4/ui/dialog"

const meta: Meta<typeof Dialog> = {
  title: "UI/Dialog",
  component: Dialog,
  parameters: { layout: "centered" },
}

export default meta
type Story = StoryObj<typeof Dialog>

export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="name" className="text-right text-sm font-medium">
              Name
            </label>
            <input
              id="name"
              defaultValue="Pedro Duarte"
              className="border-input bg-background col-span-3 rounded-md border px-3 py-2 text-sm"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label
              htmlFor="username"
              className="text-right text-sm font-medium"
            >
              Username
            </label>
            <input
              id="username"
              defaultValue="@peduarte"
              className="border-input bg-background col-span-3 rounded-md border px-3 py-2 text-sm"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}

export const WithCloseButton: Story = {
  name: "With Close Button (Default)",
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Open Dialog</Button>
      </DialogTrigger>
      <DialogContent showCloseButton>
        <DialogHeader>
          <DialogTitle>Notification Settings</DialogTitle>
          <DialogDescription>
            Configure how you receive notifications. The close button in the
            top-right corner is shown by default.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 text-sm">
          Notification preferences would go here.
        </div>
      </DialogContent>
    </Dialog>
  ),
}

export const WithoutCloseButton: Story = {
  name: "Without Close Button",
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Open Dialog</Button>
      </DialogTrigger>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Terms of Service</DialogTitle>
          <DialogDescription>
            Please review and accept the terms of service to continue.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 text-sm">
          Terms of service content would go here. The close button is hidden so
          the user must interact with the footer actions.
        </div>
        <DialogFooter>
          <DialogFooter showCloseButton>
            <Button>Accept</Button>
          </DialogFooter>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}
