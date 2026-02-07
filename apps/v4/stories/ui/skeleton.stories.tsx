import type { Meta, StoryObj } from "@storybook/react"

import { Skeleton } from "@/registry/new-york-v4/ui/skeleton"

const meta: Meta<typeof Skeleton> = {
  title: "UI/Skeleton",
  component: Skeleton,
  parameters: { layout: "centered" },
}

export default meta
type Story = StoryObj<typeof Skeleton>

export const Default: Story = {
  render: () => <Skeleton className="h-4 w-[250px]" />,
}

export const Circle: Story = {
  render: () => <Skeleton className="size-12 rounded-full" />,
}

export const CardSkeleton: Story = {
  render: () => (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-[125px] w-[250px] rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  ),
}

export const TextBlock: Story = {
  render: () => (
    <div className="space-y-2">
      <Skeleton className="h-4 w-[300px]" />
      <Skeleton className="h-4 w-[260px]" />
      <Skeleton className="h-4 w-[280px]" />
      <Skeleton className="h-4 w-[220px]" />
    </div>
  ),
}

export const ProfileSkeleton: Story = {
  render: () => (
    <div className="flex items-center space-x-4">
      <Skeleton className="size-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[150px]" />
        <Skeleton className="h-4 w-[100px]" />
      </div>
    </div>
  ),
}

export const FormSkeleton: Story = {
  render: () => (
    <div className="w-[350px] space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-4 w-[60px]" />
        <Skeleton className="h-9 w-full rounded-md" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-[80px]" />
        <Skeleton className="h-9 w-full rounded-md" />
      </div>
      <Skeleton className="h-9 w-[100px] rounded-md" />
    </div>
  ),
}
