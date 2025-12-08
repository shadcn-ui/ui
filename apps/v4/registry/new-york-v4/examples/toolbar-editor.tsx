"use client"

import React from "react"
import {
  Bold,
  ChevronDown,
  Code,
  Ellipsis,
  Heading1,
  Heading1Icon,
  Heading2,
  Heading2Icon,
  Heading3,
  Heading3Icon,
  Heading4,
  Heading4Icon,
  Image,
  Italic,
  Link,
  List,
  ListIcon,
  ListOrdered,
  ListOrderedIcon,
  MessageSquareQuote,
  Quote,
  Redo,
  SeparatorHorizontal,
  Share2,
  Strikethrough,
  Table,
  Text,
  TextAlignCenter,
  TextAlignEnd,
  TextAlignJustify,
  TextAlignStart,
  Undo,
} from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/registry/new-york-v4/ui/dropdown-menu"
import {
  Toolbar,
  ToolbarButton,
  ToolbarButtonGroup,
  ToolbarGroup,
  ToolbarLink,
  ToolbarSeparator,
  ToolbarToggleGroup,
  ToolbarToggleItem,
} from "@/registry/new-york-v4/ui/toolbar"

export default function ToolbarEditor() {
  const [formats, setFormats] = React.useState<string[]>([])
  const [heading, setHeading] = React.useState<"h1" | "h2" | "h3" | "h4">("h1")
  const [alignment, setAlignment] = React.useState<string | undefined>("center")
  const [listType, setListType] = React.useState<"unordered" | "ordered">(
    "unordered"
  )

  const headingIcons = {
    h1: <Heading1Icon />,
    h2: <Heading2Icon />,
    h3: <Heading3Icon />,
    h4: <Heading4Icon />,
  }

  const listIcons = {
    unordered: <ListIcon />,
    ordered: <ListOrderedIcon />,
  }

  return (
    <Toolbar aria-label="Editor options" className="flex-row">
      <ToolbarToggleGroup
        type="multiple"
        value={formats}
        onValueChange={setFormats}
        aria-label="Text formatting"
      >
        <ToolbarToggleItem
          tooltip="Bold"
          value="bold"
          aria-label="Bold"
          variant="outline"
        >
          <Bold />
        </ToolbarToggleItem>
        <ToolbarToggleItem
          tooltip="Italic"
          value="italic"
          aria-label="Italic"
          variant="outline"
        >
          <Italic />
        </ToolbarToggleItem>
        <ToolbarToggleItem
          tooltip="Strike through"
          value="strikethrough"
          aria-label="Strike through"
          variant="outline"
        >
          <Strikethrough />
        </ToolbarToggleItem>
      </ToolbarToggleGroup>
      <ToolbarSeparator />
      <ToolbarToggleGroup
        type="single"
        defaultValue="center"
        value={alignment}
        onValueChange={(value) => value && setAlignment(value)}
        aria-label="Text alignment"
      >
        <ToolbarToggleItem
          value="left"
          tooltip="Left aligned"
          aria-label="Left aligned"
          variant="outline"
        >
          <TextAlignStart />
        </ToolbarToggleItem>
        <ToolbarToggleItem
          value="center"
          tooltip="Center aligned"
          aria-label="Center aligned"
          variant="outline"
        >
          <TextAlignCenter />
        </ToolbarToggleItem>
        <ToolbarToggleItem
          value="right"
          tooltip="Right aligned"
          aria-label="Right aligned"
          variant="outline"
        >
          <TextAlignEnd />
        </ToolbarToggleItem>
      </ToolbarToggleGroup>
      <ToolbarSeparator />
      <ToolbarGroup>
        <ToolbarButtonGroup>
          <ToolbarButton
            variant="outline"
            size="icon-sm"
            tooltip="Code block"
            aria-label="Code block"
            className="hover:bg-accent! mx-auto bg-transparent!"
          >
            <Code />
          </ToolbarButton>
          <ToolbarButton
            variant="outline"
            size="icon-sm"
            tooltip="Archon"
            aria-label="Archon"
            className="hover:bg-accent! mx-auto bg-transparent!"
          >
            <Link />
          </ToolbarButton>
          <ToolbarButton
            variant="outline"
            size="icon-sm"
            tooltip="Quote"
            aria-label="Quote"
            className="hover:bg-accent! mx-auto bg-transparent!"
          >
            <MessageSquareQuote />
          </ToolbarButton>
        </ToolbarButtonGroup>
        <ToolbarButtonGroup>
          <ToolbarButton
            variant="outline"
            tooltip="Heading options"
            aria-label="Heading options"
            className="hover:bg-accent! mx-auto bg-transparent! pr-2!"
          >
            {headingIcons[heading]}
          </ToolbarButton>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <ToolbarButton
                variant="outline"
                tooltip="Heading options"
                aria-label="Heading options"
                className="hover:bg-accent! mx-auto bg-transparent! px-1.5!"
              >
                <ChevronDown />
              </ToolbarButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" align="center">
              <DropdownMenuItem onClick={() => setHeading("h1")}>
                <Heading1 /> Heading 1
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setHeading("h2")}>
                <Heading2 /> Heading 2
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setHeading("h3")}>
                <Heading3 /> Heading 3
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setHeading("h4")}>
                <Heading4 /> Heading 4
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setHeading("h4")}>
                <TextAlignJustify /> Heading 4
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </ToolbarButtonGroup>
        <ToolbarButtonGroup>
          <ToolbarButton
            variant="outline"
            tooltip="List options"
            aria-label="List"
            className="hover:bg-accent! mx-auto bg-transparent! pr-2!"
          >
            {listIcons[listType]}
          </ToolbarButton>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <ToolbarButton
                variant="outline"
                tooltip="List options"
                aria-label="List"
                className="hover:bg-accent! mx-auto bg-transparent! px-1.5!"
              >
                <ChevronDown />
              </ToolbarButton>
            </DropdownMenuTrigger>

            <DropdownMenuContent side="top" align="center">
              <DropdownMenuItem onClick={() => setListType("ordered")}>
                <ListOrdered /> Ordered
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setListType("unordered")}>
                <List /> Unordered
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </ToolbarButtonGroup>
      </ToolbarGroup>
      <ToolbarSeparator />
      <ToolbarButtonGroup>
        <ToolbarLink
          className="mx-auto"
          variant="outline"
          tooltip="Share"
          size="sm"
          aria-label="Share"
        >
          Share <Share2 />
        </ToolbarLink>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <ToolbarButton
              size="icon-sm"
              variant="outline"
              tooltip="More options"
              aria-label="More options"
              className="hover:bg-accent! mx-auto bg-transparent!"
            >
              <Ellipsis />
            </ToolbarButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="end">
            <DropdownMenuLabel>More editing options</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Undo /> Undo
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Redo /> Redo
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Quote /> Blockquote
            </DropdownMenuItem>
            <DropdownMenuItem>
              <SeparatorHorizontal /> Divider
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Text /> Clear formatting
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Image /> Insert image
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Table /> Insert table
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </ToolbarButtonGroup>
    </Toolbar>
  )
}
