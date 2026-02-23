"use client"

import { useMemo, useState } from "react"
import {
  IconApps,
  IconArrowUp,
  IconAt,
  IconBook,
  IconBrandAbstract,
  IconBrandOpenai,
  IconBrandZeit,
  IconCircleDashedPlus,
  IconPaperclip,
  IconPlus,
  IconWorld,
  IconX,
} from "@tabler/icons-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/new-york-v4/ui/avatar"
import { Badge } from "@/registry/new-york-v4/ui/badge"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/registry/new-york-v4/ui/command"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/registry/new-york-v4/ui/dropdown-menu"
import { Field, FieldLabel } from "@/registry/new-york-v4/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/registry/new-york-v4/ui/input-group"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/new-york-v4/ui/popover"
import { Switch } from "@/registry/new-york-v4/ui/switch"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/registry/new-york-v4/ui/tooltip"

const SAMPLE_DATA = {
  mentionable: [
    {
      type: "page",
      title: "Meeting Notes",
      image: "📝",
    },
    {
      type: "page",
      title: "Project Dashboard",
      image: "📊",
    },
    {
      type: "page",
      title: "Ideas & Brainstorming",
      image: "💡",
    },
    {
      type: "page",
      title: "Calendar & Events",
      image: "📅",
    },
    {
      type: "page",
      title: "Documentation",
      image: "📚",
    },
    {
      type: "page",
      title: "Goals & Objectives",
      image: "🎯",
    },
    {
      type: "page",
      title: "Budget Planning",
      image: "💰",
    },
    {
      type: "page",
      title: "Team Directory",
      image: "👥",
    },
    {
      type: "page",
      title: "Technical Specs",
      image: "🔧",
    },
    {
      type: "page",
      title: "Analytics Report",
      image: "📈",
    },
    {
      type: "user",
      title: "shadcn",
      image: "https://github.com/shadcn.png",
      workspace: "Workspace",
    },
    {
      type: "user",
      title: "maxleiter",
      image: "https://github.com/maxleiter.png",
      workspace: "Cursor",
    },
    {
      type: "user",
      title: "evilrabbit",
      image: "https://github.com/evilrabbit.png",
      workspace: "Vercel",
    },
  ],
  models: [
    {
      name: "Auto",
      icon: IconBrandZeit,
    },
    {
      name: "Claude Sonnet 4",
      icon: IconBrandAbstract,
      badge: "Beta",
    },
    {
      name: "GPT-5",
      icon: IconBrandOpenai,
      badge: "Beta",
    },
  ],
}

function MentionableIcon({
  item,
}: {
  item: (typeof SAMPLE_DATA.mentionable)[0]
}) {
  return item.type === "page" ? (
    <span className="flex size-4 items-center justify-center">
      {item.image}
    </span>
  ) : (
    <Avatar className="size-4">
      <AvatarImage src={item.image} />
      <AvatarFallback>{item.title[0]}</AvatarFallback>
    </Avatar>
  )
}

export function NotionPromptForm() {
  const [mentions, setMentions] = useState<string[]>([])
  const [mentionPopoverOpen, setMentionPopoverOpen] = useState(false)
  const [modelPopoverOpen, setModelPopoverOpen] = useState(false)
  const [selectedModel, setSelectedModel] = useState<
    (typeof SAMPLE_DATA.models)[0]
  >(SAMPLE_DATA.models[0])
  const [scopeMenuOpen, setScopeMenuOpen] = useState(false)

  const grouped = useMemo(() => {
    return SAMPLE_DATA.mentionable.reduce(
      (acc, item) => {
        const isAvailable = !mentions.includes(item.title)

        if (isAvailable) {
          if (!acc[item.type]) {
            acc[item.type] = []
          }
          acc[item.type].push(item)
        }
        return acc
      },
      {} as Record<string, typeof SAMPLE_DATA.mentionable>
    )
  }, [mentions])

  const hasMentions = mentions.length > 0

  return (
    <form className="[--radius:1.2rem]">
      <Field>
        <FieldLabel htmlFor="notion-prompt" className="sr-only">
          Prompt
        </FieldLabel>
        <InputGroup className="bg-background dark:bg-background shadow-none">
          <InputGroupTextarea
            id="notion-prompt"
            placeholder="Ask, search, or make anything..."
          />
          <InputGroupAddon align="block-start">
            <Popover
              open={mentionPopoverOpen}
              onOpenChange={setMentionPopoverOpen}
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <PopoverTrigger asChild>
                    <InputGroupButton
                      variant="outline"
                      size={!hasMentions ? "sm" : "icon-sm"}
                      className="rounded-full transition-transform"
                    >
                      <IconAt /> {!hasMentions && "Add context"}
                    </InputGroupButton>
                  </PopoverTrigger>
                </TooltipTrigger>
                <TooltipContent>Mention a person, page, or date</TooltipContent>
              </Tooltip>
              <PopoverContent className="p-0 [--radius:1.2rem]" align="start">
                <Command>
                  <CommandInput placeholder="Search pages..." />
                  <CommandList>
                    <CommandEmpty>No pages found</CommandEmpty>
                    {Object.entries(grouped).map(([type, items]) => (
                      <CommandGroup
                        key={type}
                        heading={type === "page" ? "Pages" : "Users"}
                      >
                        {items.map((item) => (
                          <CommandItem
                            key={item.title}
                            value={item.title}
                            onSelect={(currentValue) => {
                              setMentions((prev) => [...prev, currentValue])
                              setMentionPopoverOpen(false)
                            }}
                          >
                            <MentionableIcon item={item} />
                            {item.title}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    ))}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <div className="no-scrollbar -m-1.5 flex gap-1 overflow-y-auto p-1.5">
              {mentions.map((mention) => {
                const item = SAMPLE_DATA.mentionable.find(
                  (item) => item.title === mention
                )

                if (!item) {
                  return null
                }

                return (
                  <InputGroupButton
                    key={mention}
                    size="sm"
                    variant="secondary"
                    className="rounded-full !pl-2"
                    onClick={() => {
                      setMentions((prev) => prev.filter((m) => m !== mention))
                    }}
                  >
                    <MentionableIcon item={item} />
                    {item.title}
                    <IconX />
                  </InputGroupButton>
                )
              })}
            </div>
          </InputGroupAddon>
          <InputGroupAddon align="block-end" className="gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <InputGroupButton
                  size="icon-sm"
                  className="rounded-full"
                  aria-label="Attach file"
                >
                  <IconPaperclip />
                </InputGroupButton>
              </TooltipTrigger>
              <TooltipContent>Attach file</TooltipContent>
            </Tooltip>
            <DropdownMenu
              open={modelPopoverOpen}
              onOpenChange={setModelPopoverOpen}
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <InputGroupButton size="sm" className="rounded-full">
                      {selectedModel.icon && selectedModel.name !== "Auto" && (
                        <selectedModel.icon />
                      )}
                      {selectedModel.name}
                    </InputGroupButton>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent>Select AI model</TooltipContent>
              </Tooltip>
              <DropdownMenuContent
                side="top"
                align="start"
                className="[--radius:1.2rem]"
              >
                <DropdownMenuGroup className="w-72">
                  <DropdownMenuLabel className="text-muted-foreground text-xs">
                    Get answers about your workspace
                  </DropdownMenuLabel>
                  {SAMPLE_DATA.models.map((model) => (
                    <DropdownMenuCheckboxItem
                      key={model.name}
                      checked={model.name === selectedModel.name}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedModel(model)
                        }
                      }}
                      className="pl-2 *:[span:first-child]:right-2 *:[span:first-child]:left-auto"
                    >
                      {model.icon && <model.icon />}
                      {model.name}
                      {model.badge && (
                        <Badge
                          variant="secondary"
                          className="h-5 rounded-sm bg-blue-100 px-1 text-xs text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                        >
                          {model.badge}
                        </Badge>
                      )}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu open={scopeMenuOpen} onOpenChange={setScopeMenuOpen}>
              <DropdownMenuTrigger asChild>
                <InputGroupButton size="sm" className="rounded-full">
                  <IconWorld /> All Sources
                </InputGroupButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                align="start"
                className="[--radius:1.2rem]"
              >
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    asChild
                    onSelect={(e) => e.preventDefault()}
                  >
                    <label htmlFor="web-search">
                      <IconWorld /> Web Search{" "}
                      <Switch
                        id="web-search"
                        className="ml-auto"
                        defaultChecked
                      />
                    </label>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    asChild
                    onSelect={(e) => e.preventDefault()}
                  >
                    <label htmlFor="apps">
                      <IconApps /> Apps and Integrations
                      <Switch id="apps" className="ml-auto" defaultChecked />
                    </label>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <IconCircleDashedPlus /> All Sources I can access
                  </DropdownMenuItem>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <Avatar className="size-4">
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                      shadcn
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent className="w-72 p-0 [--radius:1.2rem]">
                      <Command>
                        <CommandInput
                          placeholder="Find or use knowledge in..."
                          autoFocus
                        />
                        <CommandList>
                          <CommandEmpty>No knowledge found</CommandEmpty>
                          <CommandGroup>
                            {SAMPLE_DATA.mentionable
                              .filter((item) => item.type === "user")
                              .map((user) => (
                                <CommandItem
                                  key={user.title}
                                  value={user.title}
                                  onSelect={() => {
                                    // Handle user selection here
                                    console.log("Selected user:", user.title)
                                  }}
                                >
                                  <Avatar className="size-4">
                                    <AvatarImage src={user.image} />
                                    <AvatarFallback>
                                      {user.title[0]}
                                    </AvatarFallback>
                                  </Avatar>
                                  {user.title}{" "}
                                  <span className="text-muted-foreground">
                                    - {user.workspace}
                                  </span>
                                </CommandItem>
                              ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                  <DropdownMenuItem>
                    <IconBook /> Help Center
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <IconPlus /> Connect Apps
                  </DropdownMenuItem>
                  <DropdownMenuLabel className="text-muted-foreground text-xs">
                    We&apos;ll only search in the sources selected here.
                  </DropdownMenuLabel>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <InputGroupButton
              aria-label="Send"
              className="ml-auto rounded-full"
              variant="default"
              size="icon-sm"
            >
              <IconArrowUp />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </Field>
    </form>
  )
}
