"use client"

import * as React from "react"

import { Button } from "@/registry/bases/radix/ui/button"
import { Card, CardContent } from "@/registry/bases/radix/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
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
  FieldDescription,
  FieldLabel,
} from "@/registry/bases/radix/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/registry/bases/radix/ui/input-group"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/registry/bases/radix/ui/item"
import { Separator } from "@/registry/bases/radix/ui/separator"
import { Spinner } from "@/registry/bases/radix/ui/spinner"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/registry/bases/radix/ui/tabs"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/registry/bases/radix/ui/tooltip"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export function CodespacesCard() {
  const [isCreatingCodespace, setIsCreatingCodespace] = React.useState(false)
  return (
    <Card>
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
                <ItemDescription>Your workspaces in the cloud</ItemDescription>
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
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuGroup>
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
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
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
                    </DropdownMenuGroup>
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
                  className="text-xs text-muted-foreground underline underline-offset-4"
                >
                  Learn more about codespaces
                </a>
              </EmptyContent>
            </Empty>
            <Separator className="-mx-2 my-2 w-auto!" />
            <div className="p-1.5 text-xs text-muted-foreground">
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
              <div className="rounded-md border bg-muted/30 p-2">
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
  )
}
