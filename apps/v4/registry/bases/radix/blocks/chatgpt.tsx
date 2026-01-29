"use client"

import * as React from "react"

import {
  Example,
  ExampleWrapper,
} from "@/registry/bases/radix/components/example"
import { Alert, AlertDescription } from "@/registry/bases/radix/ui/alert"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/registry/bases/radix/ui/alert-dialog"
import { Badge } from "@/registry/bases/radix/ui/badge"
import { Button } from "@/registry/bases/radix/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/bases/radix/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/registry/bases/radix/ui/dropdown-menu"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/registry/bases/radix/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupTextarea,
} from "@/registry/bases/radix/ui/input-group"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/registry/bases/radix/ui/item"
import { Kbd } from "@/registry/bases/radix/ui/kbd"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/bases/radix/ui/popover"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/registry/bases/radix/ui/tooltip"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function ChatGPTBlock() {
  return (
    <ExampleWrapper>
      <PromptForm />
      <ModelSelector />
      <GroupChatDialog />
      <CreateProjectForm />
    </ExampleWrapper>
  )
}

function PromptForm() {
  const [dictateEnabled, setDictateEnabled] = React.useState(false)

  return (
    <Example title="Prompt Form">
      <Field>
        <FieldLabel htmlFor="prompt" className="sr-only">
          Prompt
        </FieldLabel>
        <InputGroup>
          <InputGroupTextarea id="prompt" placeholder="Ask anything" />
          <InputGroupAddon align="block-end">
            <DropdownMenu>
              <Tooltip>
                <DropdownMenuTrigger asChild>
                  <TooltipTrigger asChild>
                    <InputGroupButton
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => setDictateEnabled(!dictateEnabled)}
                      className="rounded-4xl"
                    >
                      <IconPlaceholder
                        lucide="PlusIcon"
                        tabler="IconPlus"
                        hugeicons="PlusSignIcon"
                        phosphor="PlusIcon"
                        remixicon="RiAddLine"
                      />
                    </InputGroupButton>
                  </TooltipTrigger>
                </DropdownMenuTrigger>
                <TooltipContent>
                  Add files and more <Kbd>/</Kbd>
                </TooltipContent>
              </Tooltip>
              <DropdownMenuContent
                className="w-56"
                onCloseAutoFocus={(e) => e.preventDefault()}
              >
                <DropdownMenuItem>
                  <IconPlaceholder
                    lucide="PaperclipIcon"
                    tabler="IconPaperclip"
                    hugeicons="AttachmentIcon"
                    phosphor="PaperclipIcon"
                    remixicon="RiAttachmentLine"
                  />
                  Add photos & files
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <IconPlaceholder
                    lucide="SparklesIcon"
                    tabler="IconSparkles"
                    hugeicons="SparklesIcon"
                    phosphor="SparkleIcon"
                    remixicon="RiSparklingLine"
                  />
                  Deep research
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <IconPlaceholder
                    lucide="ShoppingBagIcon"
                    tabler="IconShoppingBag"
                    hugeicons="ShoppingBag01Icon"
                    phosphor="BagIcon"
                    remixicon="RiShoppingBagLine"
                  />
                  Shopping research
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <IconPlaceholder
                    lucide="WandIcon"
                    tabler="IconWand"
                    hugeicons="MagicWand05Icon"
                    phosphor="MagicWandIcon"
                    remixicon="RiMagicLine"
                  />
                  Create image
                </DropdownMenuItem>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DropdownMenuItem>
                      <IconPlaceholder
                        lucide="MousePointerIcon"
                        tabler="IconPointer"
                        hugeicons="Cursor01Icon"
                        phosphor="HandPointingIcon"
                        remixicon="RiHand"
                      />
                      Agent mode
                    </DropdownMenuItem>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <div className="font-medium">35 left</div>
                    <div className="text-primary-foreground/80 text-xs">
                      More available for purchase
                    </div>
                  </TooltipContent>
                </Tooltip>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <IconPlaceholder
                      lucide="MoreHorizontalIcon"
                      tabler="IconDots"
                      hugeicons="MoreHorizontalCircle01Icon"
                      phosphor="DotsThreeOutlineIcon"
                      remixicon="RiMoreLine"
                    />
                    More
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem>
                      <IconPlaceholder
                        lucide="ShareIcon"
                        tabler="IconShare"
                        hugeicons="Share03Icon"
                        phosphor="ShareIcon"
                        remixicon="RiShareLine"
                      />
                      Add sources
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <IconPlaceholder
                        lucide="BookOpenIcon"
                        tabler="IconBook"
                        hugeicons="BookIcon"
                        phosphor="BookOpenIcon"
                        remixicon="RiBookOpenLine"
                      />
                      Study and learn
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <IconPlaceholder
                        lucide="GlobeIcon"
                        tabler="IconWorld"
                        hugeicons="GlobalIcon"
                        phosphor="GlobeIcon"
                        remixicon="RiGlobeLine"
                      />
                      Web search
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <IconPlaceholder
                        lucide="PenToolIcon"
                        tabler="IconPencil"
                        hugeicons="PenIcon"
                        phosphor="PencilIcon"
                        remixicon="RiPencilLine"
                      />
                      Canvas
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              </DropdownMenuContent>
            </DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <InputGroupButton
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setDictateEnabled(!dictateEnabled)}
                  className="ml-auto rounded-4xl"
                >
                  <IconPlaceholder
                    lucide="AudioLinesIcon"
                    tabler="IconMicrophone"
                    hugeicons="AudioWave01Icon"
                    phosphor="MicrophoneIcon"
                    remixicon="RiMicLine"
                  />
                </InputGroupButton>
              </TooltipTrigger>
              <TooltipContent>Dictate</TooltipContent>
            </Tooltip>
            <InputGroupButton
              size="icon-sm"
              variant="default"
              className="rounded-4xl"
            >
              <IconPlaceholder
                lucide="ArrowUpIcon"
                tabler="IconArrowUp"
                hugeicons="ArrowUp02Icon"
                phosphor="ArrowUpIcon"
                remixicon="RiArrowUpLine"
              />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </Field>
    </Example>
  )
}

function ModelSelector() {
  const [mode, setMode] = React.useState("auto")
  const [model, setModel] = React.useState("gpt-5.1")

  return (
    <Example title="Model Selector">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="gap-2">
            ChatGPT 5.1
            <IconPlaceholder
              lucide="ChevronDownIcon"
              tabler="IconChevronDown"
              hugeicons="ArrowDown01Icon"
              phosphor="CaretDownIcon"
              remixicon="RiArrowDownSLine"
              className="text-muted-foreground size-4"
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-60" align="start">
          <DropdownMenuLabel className="text-muted-foreground text-xs font-normal">
            GPT-5.1
          </DropdownMenuLabel>
          <DropdownMenuRadioGroup value={mode} onValueChange={setMode}>
            <DropdownMenuRadioItem value="auto">
              <Item size="xs" className="p-0">
                <ItemContent>
                  <ItemTitle>Auto</ItemTitle>
                  <ItemDescription className="text-xs">
                    Decides how long to think
                  </ItemDescription>
                </ItemContent>
              </Item>
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="instant">
              <Item size="xs" className="p-0">
                <ItemContent>
                  <ItemTitle>Instant</ItemTitle>
                  <ItemDescription className="text-xs">
                    Answers right away
                  </ItemDescription>
                </ItemContent>
              </Item>
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="thinking">
              <Item size="xs" className="p-0">
                <ItemContent>
                  <ItemTitle>Thinking</ItemTitle>
                  <ItemDescription className="text-xs">
                    Thinks longer for better answers
                  </ItemDescription>
                </ItemContent>
              </Item>
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
          <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <span className="font-medium">Legacy models</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup value={model} onValueChange={setModel}>
                <DropdownMenuRadioItem value="gpt-4">
                  GPT-4
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="gpt-4-turbo">
                  GPT-4 Turbo
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="gpt-3.5">
                  GPT-3.5
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>
    </Example>
  )
}

function GroupChatDialog() {
  return (
    <Example title="Group Chat Dialog" className="items-center justify-center">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button>Start Group Chat</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Use ChatGPT together</AlertDialogTitle>
            <AlertDialogDescription>
              Add people to your chats to plan, share ideas, and get creative.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row items-center justify-between sm:justify-between">
            <a
              href="#"
              className="text-muted-foreground hover:text-foreground text-sm underline underline-offset-4"
            >
              Learn more
            </a>
            <div className="flex gap-2">
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction>Start group chat</AlertDialogAction>
            </div>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Example>
  )
}

const categories = [
  {
    id: "homework",
    label: "Homework",
  },
  {
    id: "writing",
    label: "Writing",
  },
  {
    id: "health",
    label: "Health",
  },
  {
    id: "travel",
    label: "Travel",
  },
]

function CreateProjectForm() {
  const [projectName, setProjectName] = React.useState("")
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(
    categories[0].id
  )
  const [memorySetting, setMemorySetting] = React.useState<
    "default" | "project-only"
  >("default")
  const [selectedColor, setSelectedColor] = React.useState<string | null>(
    "var(--foreground)"
  )

  return (
    <Example title="Create Project" className="items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Create Project</CardTitle>
          <CardDescription>
            Start a new project to keep chats, files, and custom instructions in
            one place.
          </CardDescription>
          <CardAction>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <IconPlaceholder
                    lucide="SettingsIcon"
                    tabler="IconSettings"
                    hugeicons="Settings01Icon"
                    phosphor="GearIcon"
                    remixicon="RiSettingsLine"
                  />
                  <span className="sr-only">Memory</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72">
                <DropdownMenuRadioGroup
                  value={memorySetting}
                  onValueChange={(value) => {
                    setMemorySetting(value as "default" | "project-only")
                  }}
                >
                  <DropdownMenuRadioItem value="default">
                    <Item size="xs">
                      <ItemContent>
                        <ItemTitle>Default</ItemTitle>
                        <ItemDescription className="text-xs">
                          Project can access memories from outside chats, and
                          vice versa.
                        </ItemDescription>
                      </ItemContent>
                    </Item>
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="project-only">
                    <Item size="xs">
                      <ItemContent>
                        <ItemTitle>Project Only</ItemTitle>
                        <ItemDescription className="text-xs">
                          Project can only access its own memories. Its memories
                          are hidden from outside chats.
                        </ItemDescription>
                      </ItemContent>
                    </Item>
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>
                  Note that this setting can&apos;t be changed later.
                </DropdownMenuLabel>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardAction>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="project-name" className="sr-only">
                Project Name
              </FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="project-name"
                  placeholder="Copenhagen Trip"
                  value={projectName}
                  onChange={(e) => {
                    setProjectName(e.target.value)
                  }}
                />
                <InputGroupAddon>
                  <Popover>
                    <PopoverTrigger asChild>
                      <InputGroupButton variant="ghost" size="icon-xs">
                        <IconPlaceholder
                          style={
                            { "--color": selectedColor } as React.CSSProperties
                          }
                          lucide="FolderIcon"
                          phosphor="FolderIcon"
                          remixicon="RiFolderLine"
                          tabler="IconFolder"
                          hugeicons="FolderIcon"
                          className="text-(--color)"
                        />
                      </InputGroupButton>
                    </PopoverTrigger>
                    <PopoverContent align="start" className="w-60 p-3">
                      <div className="flex flex-wrap gap-2">
                        {[
                          "var(--foreground)",
                          "#fa423e",
                          "#f59e0b",
                          "#8b5cf6",
                          "#ec4899",
                          "#10b981",
                          "#6366f1",
                          "#14b8a6",
                          "#f97316",
                          "#fbbc04",
                        ].map((color) => (
                          <Button
                            key={color}
                            size="icon"
                            variant="ghost"
                            className="rounded-full p-1"
                            style={{ "--color": color } as React.CSSProperties}
                            data-checked={selectedColor === color}
                            onClick={() => {
                              setSelectedColor(color)
                            }}
                          >
                            <span className="group-data-[checked=true]/button:ring-offset-background size-5 rounded-full bg-(--color) ring-2 ring-transparent ring-offset-2 ring-offset-(--color) group-data-[checked=true]/button:ring-(--color)" />
                            <span className="sr-only">{color}</span>
                          </Button>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                </InputGroupAddon>
              </InputGroup>
              <FieldDescription className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Badge
                    key={category.id}
                    variant={
                      selectedCategory === category.id ? "default" : "outline"
                    }
                    data-checked={selectedCategory === category.id}
                    asChild
                  >
                    <button
                      onClick={() => {
                        setSelectedCategory(
                          selectedCategory === category.id ? null : category.id
                        )
                      }}
                    >
                      <IconPlaceholder
                        lucide="CircleCheckIcon"
                        tabler="IconCircleCheck"
                        hugeicons="CheckmarkCircle02Icon"
                        phosphor="CheckCircleIcon"
                        remixicon="RiCheckboxCircleLine"
                        data-icon="inline-start"
                        className="hidden group-data-[checked=true]/badge:inline"
                      />
                      {category.label}
                    </button>
                  </Badge>
                ))}
              </FieldDescription>
            </Field>
            <Field>
              <Alert className="bg-muted">
                <IconPlaceholder
                  lucide="LightbulbIcon"
                  tabler="IconBulb"
                  hugeicons="BulbIcon"
                  phosphor="LightbulbIcon"
                  remixicon="RiLightbulbLine"
                />
                <AlertDescription className="text-xs">
                  Projects keep chats, files, and custom instructions in one
                  place. Use them for ongoing work, or just to keep things tidy.
                </AlertDescription>
              </Alert>
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>
    </Example>
  )
}
