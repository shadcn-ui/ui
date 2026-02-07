import type { Meta, StoryObj } from "@storybook/react"
import { FileIcon, ImageIcon, MailIcon, MoreHorizontalIcon } from "lucide-react"

import { Button } from "@/registry/new-york-v4/ui/button"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "@/registry/new-york-v4/ui/item"

const meta: Meta<typeof Item> = {
  title: "UI/Item",
  component: Item,
  parameters: { layout: "centered" },
}

export default meta
type Story = StoryObj<typeof Item>

export const Default: Story = {
  render: () => (
    <div className="w-[420px]">
      <Item>
        <ItemContent>
          <ItemTitle>Default Item</ItemTitle>
          <ItemDescription>
            A simple item with a title and description.
          </ItemDescription>
        </ItemContent>
      </Item>
    </div>
  ),
}

export const WithMedia: Story = {
  render: () => (
    <div className="w-[420px]">
      <Item>
        <ItemMedia variant="icon">
          <MailIcon />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>New Message</ItemTitle>
          <ItemDescription>
            You have a new message from the team.
          </ItemDescription>
        </ItemContent>
      </Item>
    </div>
  ),
}

export const WithActions: Story = {
  render: () => (
    <div className="w-[420px]">
      <Item>
        <ItemMedia variant="icon">
          <FileIcon />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Project Report</ItemTitle>
          <ItemDescription>
            Updated 2 hours ago by Sarah.
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button variant="ghost" size="icon-sm">
            <MoreHorizontalIcon />
          </Button>
        </ItemActions>
      </Item>
    </div>
  ),
}

export const Variants: Story = {
  render: () => (
    <div className="flex w-[420px] flex-col gap-3">
      <Item variant="default">
        <ItemContent>
          <ItemTitle>Default Variant</ItemTitle>
          <ItemDescription>Transparent background.</ItemDescription>
        </ItemContent>
      </Item>
      <Item variant="outline">
        <ItemContent>
          <ItemTitle>Outline Variant</ItemTitle>
          <ItemDescription>With a visible border.</ItemDescription>
        </ItemContent>
      </Item>
      <Item variant="muted">
        <ItemContent>
          <ItemTitle>Muted Variant</ItemTitle>
          <ItemDescription>Subtle muted background.</ItemDescription>
        </ItemContent>
      </Item>
    </div>
  ),
}

export const GroupWithSeparators: Story = {
  name: "Group with Separators",
  render: () => (
    <div className="w-[420px] rounded-md border">
      <ItemGroup>
        <Item>
          <ItemMedia variant="icon">
            <MailIcon />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Inbox</ItemTitle>
            <ItemDescription>12 unread messages.</ItemDescription>
          </ItemContent>
        </Item>
        <ItemSeparator />
        <Item>
          <ItemMedia variant="icon">
            <FileIcon />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Documents</ItemTitle>
            <ItemDescription>24 files uploaded.</ItemDescription>
          </ItemContent>
        </Item>
        <ItemSeparator />
        <Item>
          <ItemMedia variant="icon">
            <ImageIcon />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Photos</ItemTitle>
            <ItemDescription>138 images stored.</ItemDescription>
          </ItemContent>
        </Item>
      </ItemGroup>
    </div>
  ),
}

export const WithHeaderAndFooter: Story = {
  render: () => (
    <div className="w-[420px]">
      <Item variant="outline">
        <ItemHeader>
          <ItemTitle>Deployment Status</ItemTitle>
          <span className="text-muted-foreground text-xs">2 min ago</span>
        </ItemHeader>
        <ItemContent>
          <ItemDescription>
            Production deployment completed successfully.
          </ItemDescription>
        </ItemContent>
        <ItemFooter>
          <span className="text-muted-foreground text-xs">v2.4.1</span>
          <Button variant="outline" size="sm">
            View Logs
          </Button>
        </ItemFooter>
      </Item>
    </div>
  ),
}

export const ImageMedia: Story = {
  name: "With Image Media",
  render: () => (
    <div className="w-[420px]">
      <Item variant="outline">
        <ItemMedia variant="image">
          <img
            src="https://ui.shadcn.com/avatars/01.png"
            alt="User avatar"
          />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Olivia Martin</ItemTitle>
          <ItemDescription>olivia.martin@email.com</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button variant="outline" size="sm">
            Follow
          </Button>
        </ItemActions>
      </Item>
    </div>
  ),
}
