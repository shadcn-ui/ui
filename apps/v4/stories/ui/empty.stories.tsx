import type { Meta, StoryObj } from "@storybook/react"
import { Inbox, Plus } from "lucide-react"

import { Button } from "@/registry/new-york-v4/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/registry/new-york-v4/ui/empty"

const meta: Meta<typeof Empty> = {
  title: "UI/Empty",
  component: Empty,
  parameters: { layout: "centered" },
}

export default meta
type Story = StoryObj<typeof Empty>

export const Default: Story = {
  render: () => (
    <Empty className="w-[480px]">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Inbox className="text-muted-foreground size-12" />
        </EmptyMedia>
        <EmptyTitle>No results found</EmptyTitle>
        <EmptyDescription>
          Try adjusting your search or filters to find what you're looking for.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  ),
}

export const WithAction: Story = {
  render: () => (
    <Empty className="w-[480px]">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Plus />
        </EmptyMedia>
        <EmptyTitle>No projects</EmptyTitle>
        <EmptyDescription>
          Create your first project to get started.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button>
          <Plus />
          New Project
        </Button>
      </EmptyContent>
    </Empty>
  ),
}
