"use client"

import * as React from "react"

import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/registry/bases/base/ui/combobox"
import {
  Example,
  ExampleWrapper,
} from "@/registry/bases/radix/components/example"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/bases/radix/ui/avatar"
import { Badge } from "@/registry/bases/radix/ui/badge"
import { Button } from "@/registry/bases/radix/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/bases/radix/ui/card"
import { Checkbox } from "@/registry/bases/radix/ui/checkbox"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/registry/bases/radix/ui/command"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/registry/bases/radix/ui/drawer"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/registry/bases/radix/ui/dropdown-menu"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/registry/bases/radix/ui/empty"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/registry/bases/radix/ui/field"
import { Input } from "@/registry/bases/radix/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupTextarea,
} from "@/registry/bases/radix/ui/input-group"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "@/registry/bases/radix/ui/item"
import { Kbd } from "@/registry/bases/radix/ui/kbd"
import { NativeSelect } from "@/registry/bases/radix/ui/native-select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/bases/radix/ui/popover"
import { Separator } from "@/registry/bases/radix/ui/separator"
import { Spinner } from "@/registry/bases/radix/ui/spinner"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/registry/bases/radix/ui/tabs"
import { Textarea } from "@/registry/bases/radix/ui/textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/registry/bases/radix/ui/tooltip"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function GithubBlock() {
  return (
    <ExampleWrapper>
      <CodespacesCard />
      <AssignIssue />
      <Navbar />
      <RepositoryToolbar />
      <Profile />
      <ContributionsActivity />
      <Contributors />
    </ExampleWrapper>
  )
}

function CodespacesCard() {
  const [isCreatingCodespace, setIsCreatingCodespace] = React.useState(false)

  return (
    <Example title="Codespaces" className="min-h-[550px] lg:p-12">
      <Card className="mx-auto w-full max-w-sm" size="sm">
        <CardContent>
          <Tabs defaultValue="codespaces">
            <TabsList className="w-full">
              <TabsTrigger value="codespaces">Codespaces</TabsTrigger>
              <TabsTrigger value="local">Local</TabsTrigger>
            </TabsList>
            <TabsContent value="codespaces">
              <Item size="sm" className="px-1 pt-2">
                <ItemContent>
                  <ItemTitle>Codespaces</ItemTitle>
                  <ItemDescription>
                    Your workspaces in the cloud
                  </ItemDescription>
                </ItemContent>
                <ItemActions>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon-sm">
                        <IconPlaceholder
                          lucide="PlusIcon"
                          tabler="IconPlus"
                          hugeicons="PlusSignIcon"
                          phosphor="PlusIcon"
                          remixicon="RiAddLine"
                        />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      Create a codespace on main
                    </TooltipContent>
                  </Tooltip>
                  <DropdownMenu>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon-sm">
                            <IconPlaceholder
                              lucide="MoreHorizontalIcon"
                              tabler="IconDots"
                              hugeicons="MoreHorizontalCircle01Icon"
                              phosphor="DotsThreeOutlineIcon"
                              remixicon="RiMoreLine"
                            />
                          </Button>
                        </DropdownMenuTrigger>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        Codespace repository configuration
                      </TooltipContent>
                    </Tooltip>
                    <DropdownMenuContent
                      align="end"
                      onCloseAutoFocus={(e) => e.preventDefault()}
                      className="w-56"
                    >
                      <DropdownMenuItem>
                        <IconPlaceholder
                          lucide="PlusIcon"
                          tabler="IconPlus"
                          hugeicons="PlusSignIcon"
                          phosphor="PlusIcon"
                          remixicon="RiAddLine"
                        />
                        New with options...
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <IconPlaceholder
                          lucide="ContainerIcon"
                          tabler="IconBox"
                          hugeicons="CubeIcon"
                          phosphor="CubeIcon"
                          remixicon="RiBox1Line"
                        />
                        Configure dev container
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <IconPlaceholder
                          lucide="ZapIcon"
                          tabler="IconBolt"
                          hugeicons="ZapIcon"
                          phosphor="LightningIcon"
                          remixicon="RiFlashlightLine"
                        />
                        Set up prebuilds
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <IconPlaceholder
                          lucide="ServerIcon"
                          tabler="IconServer"
                          hugeicons="ServerStackIcon"
                          phosphor="HardDrivesIcon"
                          remixicon="RiHardDriveLine"
                        />
                        Manage codespaces
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <IconPlaceholder
                          lucide="ShareIcon"
                          tabler="IconShare2"
                          hugeicons="Share03Icon"
                          phosphor="ShareIcon"
                          remixicon="RiShareLine"
                        />
                        Share deep link
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <IconPlaceholder
                          lucide="InfoIcon"
                          tabler="IconInfoCircle"
                          hugeicons="AlertCircleIcon"
                          phosphor="InfoIcon"
                          remixicon="RiInformationLine"
                        />
                        What are codespaces?
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </ItemActions>
              </Item>
              <Separator className="-mx-2 my-2 w-auto!" />
              <Empty className="p-4">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <IconPlaceholder
                      lucide="ServerIcon"
                      tabler="IconServer"
                      hugeicons="ServerStackIcon"
                      phosphor="HardDrivesIcon"
                      remixicon="RiHardDriveLine"
                    />
                  </EmptyMedia>
                  <EmptyTitle>No codespaces</EmptyTitle>
                  <EmptyDescription>
                    You don&apos;t have any codespaces with this repository
                    checked out
                  </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                  <Button
                    size="sm"
                    onClick={() => {
                      setIsCreatingCodespace(true)
                      setTimeout(() => {
                        setIsCreatingCodespace(false)
                      }, 2000)
                    }}
                    disabled={isCreatingCodespace}
                  >
                    {isCreatingCodespace ? (
                      <Spinner data-icon="inline-start" />
                    ) : (
                      ""
                    )}
                    Create Codespace
                  </Button>
                  <a
                    href="#learn-more"
                    className="text-muted-foreground text-xs underline underline-offset-4"
                  >
                    Learn more about codespaces
                  </a>
                </EmptyContent>
              </Empty>
              <Separator className="-mx-2 my-2 w-auto!" />
              <div className="text-muted-foreground p-1.5 text-xs">
                Codespace usage for this repository is paid for by{" "}
                <span className="font-medium">shadcn</span>.
              </div>
            </TabsContent>
            <TabsContent value="local">
              <Item size="sm" className="hidden p-0">
                <ItemContent>
                  <ItemTitle className="gap-2">
                    <IconPlaceholder
                      lucide="TerminalIcon"
                      tabler="IconTerminal"
                      hugeicons="ComputerTerminal01Icon"
                      phosphor="TerminalIcon"
                      remixicon="RiTerminalBoxLine"
                      className="size-4"
                    />
                    Clone
                  </ItemTitle>
                </ItemContent>
                <ItemActions>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <IconPlaceholder
                          lucide="InfoIcon"
                          tabler="IconInfoCircle"
                          hugeicons="AlertCircleIcon"
                          phosphor="InfoIcon"
                          remixicon="RiInformationLine"
                        />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="left">
                      Which remote URL should I use?
                    </TooltipContent>
                  </Tooltip>
                </ItemActions>
              </Item>
              <Tabs defaultValue="https">
                <TabsList
                  variant="line"
                  className="w-full justify-start border-b *:[button]:flex-0"
                >
                  <TabsTrigger value="https">HTTPS</TabsTrigger>
                  <TabsTrigger value="ssh">SSH</TabsTrigger>
                  <TabsTrigger value="cli">GitHub CLI</TabsTrigger>
                </TabsList>
                <div className="bg-muted/30 rounded-md border p-2">
                  <TabsContent value="https">
                    <Field className="gap-2">
                      <FieldLabel htmlFor="https-url" className="sr-only">
                        HTTPS URL
                      </FieldLabel>
                      <InputGroup>
                        <InputGroupAddon align="inline-end">
                          <InputGroupButton variant="ghost" size="icon-xs">
                            <IconPlaceholder
                              lucide="CopyIcon"
                              tabler="IconCopy"
                              hugeicons="Copy01Icon"
                              phosphor="CopyIcon"
                              remixicon="RiFileCopyLine"
                            />
                          </InputGroupButton>
                        </InputGroupAddon>
                        <InputGroupInput
                          id="https-url"
                          defaultValue="https://github.com/shadcn-ui/ui.git"
                          readOnly
                        />
                      </InputGroup>
                      <FieldDescription>
                        Clone using the web URL.
                      </FieldDescription>
                    </Field>
                  </TabsContent>
                  <TabsContent value="ssh">
                    <Field className="gap-2">
                      <FieldLabel htmlFor="ssh-url" className="sr-only">
                        SSH URL
                      </FieldLabel>
                      <InputGroup>
                        <InputGroupAddon align="inline-end">
                          <InputGroupButton variant="ghost" size="icon-xs">
                            <IconPlaceholder
                              lucide="CopyIcon"
                              tabler="IconCopy"
                              hugeicons="Copy01Icon"
                              phosphor="CopyIcon"
                              remixicon="RiFileCopyLine"
                            />
                          </InputGroupButton>
                        </InputGroupAddon>
                        <InputGroupInput
                          id="ssh-url"
                          defaultValue="git@github.com:shadcn-ui/ui.git"
                          readOnly
                        />
                      </InputGroup>
                      <FieldDescription>
                        Use a password-protected SSH key.
                      </FieldDescription>
                    </Field>
                  </TabsContent>
                  <TabsContent value="cli">
                    <Field className="gap-2">
                      <FieldLabel htmlFor="cli-command" className="sr-only">
                        CLI Command
                      </FieldLabel>
                      <InputGroup>
                        <InputGroupAddon align="inline-end">
                          <InputGroupButton variant="ghost" size="icon-xs">
                            <IconPlaceholder
                              lucide="CopyIcon"
                              tabler="IconCopy"
                              hugeicons="Copy01Icon"
                              phosphor="CopyIcon"
                              remixicon="RiFileCopyLine"
                            />
                          </InputGroupButton>
                        </InputGroupAddon>
                        <InputGroupInput
                          id="cli-command"
                          defaultValue="gh repo clone shadcn-ui/ui"
                          readOnly
                        />
                      </InputGroup>
                      <FieldDescription>
                        Work fast with our official CLI.{" "}
                        <a href="#learn-more">Learn more</a>
                      </FieldDescription>
                    </Field>
                  </TabsContent>
                </div>
              </Tabs>
              <Separator className="-mx-2 my-2 w-auto!" />
              <div className="flex flex-col">
                <Button
                  variant="ghost"
                  size="sm"
                  className="justify-start gap-1.5"
                >
                  <IconPlaceholder
                    lucide="MonitorIcon"
                    tabler="IconDeviceDesktop"
                    hugeicons="ComputerIcon"
                    phosphor="MonitorIcon"
                    remixicon="RiComputerLine"
                    data-icon="inline-start"
                  />
                  Open with GitHub Desktop
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="justify-start gap-1.5"
                >
                  <IconPlaceholder
                    lucide="DownloadIcon"
                    tabler="IconDownload"
                    hugeicons="DownloadIcon"
                    phosphor="DownloadIcon"
                    remixicon="RiDownloadLine"
                    data-icon="inline-start"
                  />
                  Download ZIP
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </Example>
  )
}

function RepositoryToolbar() {
  const [selectedBranch, setSelectedBranch] = React.useState("main")
  return (
    <Example title="Repository Toolbar">
      <div className="flex items-center gap-2">
        <InputGroup>
          <InputGroupInput placeholder="Go to file" />
          <InputGroupAddon align="inline-start">
            <InputGroupButton variant="ghost" size="icon-xs">
              <IconPlaceholder
                lucide="SearchIcon"
                tabler="IconSearch"
                hugeicons="SearchIcon"
                phosphor="MagnifyingGlassIcon"
                remixicon="RiSearchLine"
              />
            </InputGroupButton>
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">
            <Kbd>t</Kbd>
          </InputGroupAddon>
        </InputGroup>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Add File
              <IconPlaceholder
                lucide="ChevronDownIcon"
                tabler="IconChevronDown"
                hugeicons="ArrowDown01Icon"
                phosphor="CaretDownIcon"
                remixicon="RiArrowDownSLine"
                data-icon="inline-end"
              />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <IconPlaceholder
                lucide="PlusIcon"
                tabler="IconPlus"
                hugeicons="PlusSignIcon"
                phosphor="PlusIcon"
                remixicon="RiAddLine"
              />
              Create new file
            </DropdownMenuItem>
            <DropdownMenuItem>
              <IconPlaceholder
                lucide="UploadIcon"
                hugeicons="Upload01Icon"
                tabler="IconUpload"
                phosphor="UploadIcon"
                remixicon="RiUploadLine"
              />
              Upload files
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Popover>
          <Tooltip>
            <TooltipTrigger asChild>
              <PopoverTrigger asChild>
                <Button variant="outline" size="icon">
                  <IconPlaceholder
                    lucide="CloudCogIcon"
                    hugeicons="AiCloud01Icon"
                    tabler="IconCloudCog"
                    phosphor="CloudArrowUpIcon"
                    remixicon="RiUploadCloudLine"
                  />
                </Button>
              </PopoverTrigger>
            </TooltipTrigger>
            <TooltipContent>New Agent Task</TooltipContent>
          </Tooltip>
          <PopoverContent
            className="w-80"
            onCloseAutoFocus={(e) => e.preventDefault()}
          >
            <Field>
              <FieldLabel htmlFor="new-agent-task">New Agent Task</FieldLabel>
              <InputGroup>
                <InputGroupTextarea placeholder="Describe your task in natural language."></InputGroupTextarea>
                <InputGroupAddon align="block-end">
                  <Popover>
                    <Tooltip>
                      <PopoverTrigger asChild>
                        <TooltipTrigger asChild>
                          <InputGroupButton variant="outline" size="icon-sm">
                            <IconPlaceholder
                              lucide="GitBranchIcon"
                              hugeicons="GitBranchIcon"
                              tabler="IconGitBranch"
                              phosphor="GitBranchIcon"
                              remixicon="RiGitBranchLine"
                            />
                          </InputGroupButton>
                        </TooltipTrigger>
                      </PopoverTrigger>
                      <TooltipContent>Select a branch</TooltipContent>
                    </Tooltip>
                    <PopoverContent
                      side="bottom"
                      align="start"
                      className="p-1"
                      onCloseAutoFocus={(e) => e.preventDefault()}
                    >
                      <Field>
                        <FieldLabel htmlFor="select-branch" className="sr-only">
                          Select a Branch
                        </FieldLabel>
                        <Command>
                          <CommandInput
                            id="select-branch"
                            placeholder="Find a branch"
                          />
                          <CommandEmpty>No branches found</CommandEmpty>
                          <CommandList>
                            <CommandGroup>
                              {[
                                "main",
                                "develop",
                                "feature/123",
                                "feature/user-authentication",
                                "feature/dashboard-redesign",
                                "bugfix/login-error",
                                "hotfix/security-patch",
                                "release/v2.0.0",
                                "feature/api-integration",
                                "bugfix/memory-leak",
                                "feature/dark-mode",
                                "feature/responsive-design",
                                "bugfix/typo-fix",
                                "feature/search-functionality",
                                "release/v1.9.0",
                                "feature/notifications",
                                "bugfix/cache-issue",
                                "feature/payment-gateway",
                                "hotfix/critical-bug",
                                "feature/admin-panel",
                                "bugfix/validation-error",
                                "feature/analytics",
                                "release/v2.1.0",
                              ].map((branch) => (
                                <CommandItem
                                  key={branch}
                                  value={branch}
                                  onSelect={() => setSelectedBranch(branch)}
                                  data-checked={selectedBranch === branch}
                                >
                                  {branch}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </Field>
                    </PopoverContent>
                  </Popover>
                  <Popover>
                    <Tooltip>
                      <PopoverTrigger asChild>
                        <TooltipTrigger asChild>
                          <InputGroupButton variant="outline" size="icon-sm">
                            <IconPlaceholder
                              lucide="BotIcon"
                              hugeicons="RoboticIcon"
                              tabler="IconRobot"
                              phosphor="RobotIcon"
                              remixicon="RiRobotLine"
                            />
                          </InputGroupButton>
                        </TooltipTrigger>
                      </PopoverTrigger>
                      <TooltipContent>Select Agent</TooltipContent>
                    </Tooltip>
                    <PopoverContent side="top" align="start">
                      <Empty className="gap-4 p-0">
                        <EmptyHeader>
                          <EmptyTitle className="text-sm">
                            This repository has no custom agents
                          </EmptyTitle>
                          <EmptyDescription className="text-xs">
                            Custom agents are reusable instructions and tools in
                            your repository.
                          </EmptyDescription>
                        </EmptyHeader>
                        <EmptyContent>
                          <Button variant="outline" size="sm">
                            Create Custom Agent
                          </Button>
                        </EmptyContent>
                      </Empty>
                    </PopoverContent>
                  </Popover>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InputGroupButton
                        variant="ghost"
                        size="icon-sm"
                        className="ml-auto"
                      >
                        <IconPlaceholder
                          lucide="SendIcon"
                          hugeicons="SentIcon"
                          tabler="IconSend"
                          phosphor="PaperPlaneTiltIcon"
                          remixicon="RiSendPlaneLine"
                        />
                      </InputGroupButton>
                    </TooltipTrigger>
                    <TooltipContent className="flex items-center gap-2 pr-2">
                      Start Task <Kbd>⏎</Kbd>
                    </TooltipContent>
                  </Tooltip>
                </InputGroupAddon>
              </InputGroup>
            </Field>
          </PopoverContent>
        </Popover>
      </div>
    </Example>
  )
}

function Navbar() {
  return (
    <Example title="Account Menu">
      <header className="flex h-14 w-full items-center gap-2">
        <Drawer direction="left">
          <DrawerTrigger asChild>
            <Button variant="outline" size="icon">
              <IconPlaceholder
                lucide="MenuIcon"
                hugeicons="Menu09Icon"
                tabler="IconMenu"
                phosphor="ListIcon"
                remixicon="RiListUnordered"
              />
              <span className="sr-only">Open menu</span>
            </Button>
          </DrawerTrigger>
          <DrawerContent className="max-w-72">
            <DrawerHeader className="flex flex-row items-center justify-between px-5 pb-0">
              <DrawerTitle>Menu</DrawerTitle>
              <DrawerClose asChild>
                <Button variant="ghost" size="icon-sm">
                  <IconPlaceholder
                    lucide="XIcon"
                    tabler="IconX"
                    hugeicons="Cancel01Icon"
                    phosphor="XIcon"
                    remixicon="RiCloseLine"
                  />
                  <span className="sr-only">Close</span>
                </Button>
              </DrawerClose>
            </DrawerHeader>
            <div className="p-2">
              <ItemGroup className="gap-px">
                <Item asChild size="xs">
                  <a href="#">
                    <ItemMedia variant="icon">
                      <IconPlaceholder
                        lucide="HomeIcon"
                        tabler="IconHome"
                        hugeicons="HomeIcon"
                        phosphor="HouseIcon"
                        remixicon="RiHomeLine"
                      />
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle>Home</ItemTitle>
                    </ItemContent>
                  </a>
                </Item>
                <Item asChild size="xs">
                  <a href="#">
                    <ItemMedia variant="icon">
                      <IconPlaceholder
                        lucide="CircleIcon"
                        tabler="IconCircle"
                        hugeicons="CircleIcon"
                        phosphor="CircleIcon"
                        remixicon="RiCircleLine"
                      />
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle>Issues</ItemTitle>
                    </ItemContent>
                  </a>
                </Item>
                <Item asChild size="xs">
                  <a href="#">
                    <ItemMedia variant="icon">
                      <IconPlaceholder
                        lucide="GitBranchIcon"
                        tabler="IconGitBranch"
                        hugeicons="GitBranchIcon"
                        phosphor="GitBranchIcon"
                        remixicon="RiGitBranchLine"
                      />
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle>Pull requests</ItemTitle>
                    </ItemContent>
                  </a>
                </Item>
                <Item asChild size="xs">
                  <a href="#">
                    <ItemMedia variant="icon">
                      <IconPlaceholder
                        lucide="LayoutGridIcon"
                        tabler="IconLayoutGrid"
                        hugeicons="GridIcon"
                        phosphor="GridFourIcon"
                        remixicon="RiGridLine"
                      />
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle>Projects</ItemTitle>
                    </ItemContent>
                  </a>
                </Item>
                <Item asChild size="xs">
                  <a href="#">
                    <ItemMedia variant="icon">
                      <IconPlaceholder
                        lucide="MailIcon"
                        tabler="IconMail"
                        hugeicons="MailIcon"
                        phosphor="EnvelopeIcon"
                        remixicon="RiMailLine"
                      />
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle>Discussions</ItemTitle>
                    </ItemContent>
                  </a>
                </Item>
                <Item asChild size="xs">
                  <a href="#">
                    <ItemMedia variant="icon">
                      <IconPlaceholder
                        lucide="ServerIcon"
                        tabler="IconServer"
                        hugeicons="ServerStackIcon"
                        phosphor="HardDrivesIcon"
                        remixicon="RiHardDriveLine"
                      />
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle>Codespaces</ItemTitle>
                    </ItemContent>
                  </a>
                </Item>
                <Item asChild size="xs">
                  <a href="#">
                    <ItemMedia variant="icon">
                      <IconPlaceholder
                        lucide="BotIcon"
                        tabler="IconRobot"
                        hugeicons="RoboticIcon"
                        phosphor="RobotIcon"
                        remixicon="RiRobotLine"
                      />
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle>Copilot</ItemTitle>
                    </ItemContent>
                  </a>
                </Item>
                <Item asChild size="xs">
                  <a href="#">
                    <ItemMedia variant="icon">
                      <IconPlaceholder
                        lucide="SparklesIcon"
                        tabler="IconSparkles"
                        hugeicons="SparklesIcon"
                        phosphor="SparkleIcon"
                        remixicon="RiSparklingLine"
                      />
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle>Spark</ItemTitle>
                    </ItemContent>
                  </a>
                </Item>
                <ItemSeparator />
                <Item asChild size="xs">
                  <a href="#">
                    <ItemMedia variant="icon">
                      <IconPlaceholder
                        lucide="SearchIcon"
                        tabler="IconSearch"
                        hugeicons="SearchIcon"
                        phosphor="MagnifyingGlassIcon"
                        remixicon="RiSearchLine"
                      />
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle>Explore</ItemTitle>
                    </ItemContent>
                  </a>
                </Item>
                <Item asChild size="xs">
                  <a href="#">
                    <ItemMedia variant="icon">
                      <IconPlaceholder
                        lucide="ShoppingBagIcon"
                        tabler="IconShoppingBag"
                        hugeicons="ShoppingBasket01Icon"
                        phosphor="BagIcon"
                        remixicon="RiShoppingBagLine"
                      />
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle>Marketplace</ItemTitle>
                    </ItemContent>
                  </a>
                </Item>
                <Item asChild size="xs">
                  <a href="#">
                    <ItemMedia variant="icon">
                      <IconPlaceholder
                        lucide="LinkIcon"
                        tabler="IconLink"
                        hugeicons="LinkIcon"
                        phosphor="LinkIcon"
                        remixicon="RiLinksLine"
                      />
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle>MCP registry</ItemTitle>
                    </ItemContent>
                  </a>
                </Item>
              </ItemGroup>
            </div>
          </DrawerContent>
        </Drawer>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto rounded-full"
            >
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" alt="shadcn" />
                <AvatarFallback>SC</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel className="p-0 font-normal">
              <Item className="px-2 py-1 pb-0.5" size="sm">
                <ItemMedia>
                  <Avatar>
                    <AvatarImage
                      src="https://github.com/shadcn.png"
                      alt="shadcn"
                    />
                    <AvatarFallback>SC</AvatarFallback>
                  </Avatar>
                </ItemMedia>
                <ItemContent className="gap-0">
                  <ItemTitle className="text-foreground text-sm">
                    shadcn
                  </ItemTitle>
                  <ItemDescription className="text-xs">
                    shadcn@example.com
                  </ItemDescription>
                </ItemContent>
              </Item>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <IconPlaceholder
                  lucide="SmileIcon"
                  tabler="IconMoodSmile"
                  hugeicons="SmileIcon"
                  phosphor="SmileyIcon"
                  remixicon="RiEmotionLine"
                />
                Set status
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconPlaceholder
                  lucide="CircleAlertIcon"
                  tabler="IconExclamationCircle"
                  hugeicons="AlertCircleIcon"
                  phosphor="WarningCircleIcon"
                  remixicon="RiErrorWarningLine"
                />
                Single sign-on
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <IconPlaceholder
                  lucide="UserIcon"
                  tabler="IconUser"
                  hugeicons="UserIcon"
                  phosphor="UserIcon"
                  remixicon="RiUserLine"
                />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconPlaceholder
                  lucide="FolderIcon"
                  tabler="IconFolder"
                  hugeicons="FolderIcon"
                  phosphor="FolderIcon"
                  remixicon="RiFolderLine"
                />
                Repositories
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconPlaceholder
                  lucide="StarIcon"
                  tabler="IconStar"
                  hugeicons="StarIcon"
                  phosphor="StarIcon"
                  remixicon="RiStarLine"
                />
                Stars
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconPlaceholder
                  lucide="CodeIcon"
                  tabler="IconCode"
                  hugeicons="CodeIcon"
                  phosphor="CodeIcon"
                  remixicon="RiCodeLine"
                />
                Gists
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconPlaceholder
                  lucide="FolderIcon"
                  tabler="IconFolder"
                  hugeicons="FolderIcon"
                  phosphor="FolderIcon"
                  remixicon="RiFolderLine"
                />
                Organizations
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconPlaceholder
                  lucide="ServerIcon"
                  tabler="IconServer"
                  hugeicons="ServerStackIcon"
                  phosphor="HardDrivesIcon"
                  remixicon="RiHardDriveLine"
                />
                Enterprises
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconPlaceholder
                  lucide="HeartIcon"
                  tabler="IconHeart"
                  hugeicons="FavouriteIcon"
                  phosphor="HeartIcon"
                  remixicon="RiHeartLine"
                />
                Sponsors
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <IconPlaceholder
                  lucide="SettingsIcon"
                  tabler="IconSettings"
                  hugeicons="SettingsIcon"
                  phosphor="GearIcon"
                  remixicon="RiSettingsLine"
                />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconPlaceholder
                  lucide="BotIcon"
                  tabler="IconRobot"
                  hugeicons="RoboticIcon"
                  phosphor="RobotIcon"
                  remixicon="RiRobotLine"
                />
                Copilot settings
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconPlaceholder
                  lucide="SparklesIcon"
                  tabler="IconSparkles"
                  hugeicons="SparklesIcon"
                  phosphor="SparkleIcon"
                  remixicon="RiSparklingLine"
                />
                Feature preview
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconPlaceholder
                  lucide="MonitorIcon"
                  tabler="IconDeviceDesktop"
                  hugeicons="ComputerIcon"
                  phosphor="MonitorIcon"
                  remixicon="RiComputerLine"
                />
                Appearance
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconPlaceholder
                  lucide="UserIcon"
                  tabler="IconUser"
                  hugeicons="UserIcon"
                  phosphor="UserIcon"
                  remixicon="RiUserLine"
                />
                Accessibility
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconPlaceholder
                  lucide="ArrowUpIcon"
                  tabler="IconArrowUp"
                  hugeicons="ArrowUpIcon"
                  phosphor="ArrowUpIcon"
                  remixicon="RiArrowUpLine"
                />
                Upgrade
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <IconPlaceholder
                lucide="LogOutIcon"
                tabler="IconLogout"
                hugeicons="LogoutIcon"
                phosphor="SignOutIcon"
                remixicon="RiLogoutBoxLine"
              />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>
    </Example>
  )
}

const usernames = [
  "shadcn",
  "vercel",
  "nextjs",
  "tailwindlabs",
  "typescript-lang",
  "eslint",
  "prettier",
  "babel",
  "webpack",
  "rollup",
  "parcel",
  "vite",
  "react",
  "vue",
  "angular",
  "solid",
]

function Contributors() {
  return (
    <Example title="Contributors" className="items-center lg:p-16">
      <Card className="max-w-sm">
        <CardHeader>
          <CardTitle>
            Contributors <Badge variant="secondary">312</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {usernames.map((username) => (
              <Avatar key={username}>
                <AvatarImage
                  src={`https://github.com/${username}.png`}
                  alt={username}
                />
                <AvatarFallback>{username.charAt(0)}</AvatarFallback>
              </Avatar>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <a href="#" className="text-sm underline underline-offset-4">
            + 810 contributors
          </a>
        </CardFooter>
      </Card>
    </Example>
  )
}

function Profile() {
  return (
    <Example title="Profile" className="items-center justify-center">
      <Card className="mx-auto w-full max-w-md">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Manage your profile information.</CardDescription>
        </CardHeader>
        <CardContent>
          <form id="profile">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <Input id="name" placeholder="shadcn" />
                <FieldDescription>
                  Your name may appear around GitHub where you contribute or are
                  mentioned. You can remove it at any time.
                </FieldDescription>
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Public Email</FieldLabel>
                <NativeSelect id="email">
                  <option value="m@shadcn.com">m@shadcn.com</option>
                  <option value="m@gmail.com">m@gmail.com</option>
                </NativeSelect>
                <FieldDescription>
                  You can manage verified email addresses in your{" "}
                  <a href="#email-settings">email settings</a>.
                </FieldDescription>
              </Field>
              <Field>
                <FieldLabel htmlFor="bio">Bio</FieldLabel>
                <Textarea
                  id="bio"
                  placeholder="Tell us a little bit about yourself"
                />
                <FieldDescription>
                  You can <span>@mention</span> other users and organizations to
                  link to them.
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter>
          <Button form="profile">Save Profile</Button>
        </CardFooter>
      </Card>
    </Example>
  )
}

function ContributionsActivity() {
  return (
    <Example title="Contributions Activity" className="justify-center">
      <Card className="mx-auto w-full max-w-md">
        <CardHeader>
          <CardTitle>Contributions & Activity</CardTitle>
          <CardDescription>
            Manage your contributions and activity visibility.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form id="contributions-activity">
            <FieldGroup>
              <FieldSet>
                <FieldLegend className="sr-only">
                  Contributions & activity
                </FieldLegend>
                <FieldGroup className="gap-3">
                  <Field orientation="horizontal">
                    <Checkbox id="private-profile" />
                    <FieldContent>
                      <FieldLabel
                        htmlFor="private-profile"
                        className="font-normal"
                      >
                        Make profile private and hide activity
                      </FieldLabel>
                      <FieldDescription>
                        Enabling this will hide your contributions and activity
                        from your GitHub profile and from social features like
                        followers, stars, feeds, leaderboards and releases.
                      </FieldDescription>
                    </FieldContent>
                  </Field>
                  <Field orientation="horizontal">
                    <Checkbox id="private-contributions" defaultChecked />
                    <FieldContent>
                      <FieldLabel
                        htmlFor="private-contributions"
                        className="font-normal"
                      >
                        Include private contributions on my profile
                      </FieldLabel>
                      <FieldDescription>
                        Your contribution graph, achievements, and activity
                        overview will show your private contributions without
                        revealing any repository or organization information.{" "}
                        <a href="#read-more">Read more</a>.
                      </FieldDescription>
                    </FieldContent>
                  </Field>
                </FieldGroup>
              </FieldSet>
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter>
          <Button form="contributions-activity">Save Changes</Button>
        </CardFooter>
      </Card>
    </Example>
  )
}

const users = [
  "shadcn",
  "maxleiter",
  "evilrabbit",
  "pranathip",
  "jorgezreik",
  "shuding",
  "rauchg",
]

function AssignIssue() {
  const anchor = useComboboxAnchor()

  return (
    <Example title="User Select" className="items-center justify-center">
      <Card className="w-full max-w-sm" size="sm">
        <CardHeader className="border-b">
          <CardTitle className="text-sm">Assign Issue</CardTitle>
          <CardDescription className="text-sm">
            Select users to assign to this issue.
          </CardDescription>
          <CardAction>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon-xs">
                  <IconPlaceholder
                    lucide="PlusIcon"
                    tabler="IconPlus"
                    hugeicons="PlusSignIcon"
                    phosphor="PlusIcon"
                    remixicon="RiAddLine"
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Add user</TooltipContent>
            </Tooltip>
          </CardAction>
        </CardHeader>
        <CardContent>
          <Combobox
            multiple
            autoHighlight
            items={users}
            defaultValue={[users[0]]}
          >
            <ComboboxChips ref={anchor}>
              <ComboboxValue>
                {(values) => (
                  <React.Fragment>
                    {values.map((username: string) => (
                      <ComboboxChip key={username}>
                        <Avatar className="size-4">
                          <AvatarImage
                            src={`https://github.com/${username}.png`}
                            alt={username}
                          />
                          <AvatarFallback>{username.charAt(0)}</AvatarFallback>
                        </Avatar>
                        {username}
                      </ComboboxChip>
                    ))}
                    <ComboboxChipsInput
                      placeholder={
                        values.length > 0 ? undefined : "Select a item..."
                      }
                    />
                  </React.Fragment>
                )}
              </ComboboxValue>
            </ComboboxChips>
            <ComboboxContent anchor={anchor}>
              <ComboboxEmpty>No users found.</ComboboxEmpty>
              <ComboboxList>
                {(username) => (
                  <ComboboxItem key={username} value={username}>
                    <Avatar className="size-5">
                      <AvatarImage
                        src={`https://github.com/${username}.png`}
                        alt={username}
                      />
                      <AvatarFallback>{username.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {username}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </CardContent>
      </Card>
    </Example>
  )
}
