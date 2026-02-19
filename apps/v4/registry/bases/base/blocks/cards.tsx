"use client"

import * as React from "react"
import { useState } from "react"

import {
  Example,
  ExampleWrapper,
} from "@/registry/bases/base/components/example"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/registry/bases/base/ui/alert-dialog"
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
} from "@/registry/bases/base/ui/avatar"
import { Badge } from "@/registry/bases/base/ui/badge"
import { Button } from "@/registry/bases/base/ui/button"
import { ButtonGroup } from "@/registry/bases/base/ui/button-group"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/bases/base/ui/card"
import { Checkbox } from "@/registry/bases/base/ui/checkbox"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/registry/bases/base/ui/combobox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/registry/bases/base/ui/dropdown-menu"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/registry/bases/base/ui/empty"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "@/registry/bases/base/ui/field"
import { Input } from "@/registry/bases/base/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/registry/bases/base/ui/input-group"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/registry/bases/base/ui/item"
import { Label } from "@/registry/bases/base/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/registry/bases/base/ui/popover"
import {
  RadioGroup,
  RadioGroupItem,
} from "@/registry/bases/base/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/bases/base/ui/select"
import { Separator } from "@/registry/bases/base/ui/separator"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/registry/bases/base/ui/sheet"
import { Slider } from "@/registry/bases/base/ui/slider"
import { Spinner } from "@/registry/bases/base/ui/spinner"
import { Switch } from "@/registry/bases/base/ui/switch"
import { Textarea } from "@/registry/bases/base/ui/textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/registry/bases/base/ui/tooltip"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function CoverExample() {
  return (
    <ExampleWrapper>
      <ObservabilityCard />
      <SmallFormExample />
      <FormExample />
      <FieldExamples />
      <ItemExample />
      <ButtonGroupExamples />
      <EmptyAvatarGroup />
      <InputGroupExamples />
      <SheetExample />
      <BadgeExamples />
    </ExampleWrapper>
  )
}

function FieldExamples() {
  const [gpuCount, setGpuCount] = React.useState(8)
  const [value, setValue] = useState([200, 800])

  const handleGpuAdjustment = React.useCallback((adjustment: number) => {
    setGpuCount((prevCount) =>
      Math.max(1, Math.min(99, prevCount + adjustment))
    )
  }, [])

  const handleGpuInputChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(e.target.value, 10)
      if (!isNaN(value) && value >= 1 && value <= 99) {
        setGpuCount(value)
      }
    },
    []
  )

  return (
    <Example title="Fields">
      <FieldSet className="w-full max-w-md">
        <FieldGroup>
          <FieldSet>
            <FieldLegend>Compute Environment</FieldLegend>
            <FieldDescription>
              Select the compute environment for your cluster.
            </FieldDescription>
            <RadioGroup defaultValue="kubernetes">
              <FieldLabel htmlFor="kubernetes-r2h">
                <Field orientation="horizontal">
                  <FieldContent>
                    <FieldTitle>Kubernetes</FieldTitle>
                    <FieldDescription>
                      Run GPU workloads on a K8s configured cluster. This is the
                      default.
                    </FieldDescription>
                  </FieldContent>
                  <RadioGroupItem
                    value="kubernetes"
                    id="kubernetes-r2h"
                    aria-label="Kubernetes"
                  />
                </Field>
              </FieldLabel>
              <FieldLabel htmlFor="vm-z4k">
                <Field orientation="horizontal">
                  <FieldContent>
                    <FieldTitle>Virtual Machine</FieldTitle>
                    <FieldDescription>
                      Access a VM configured cluster to run workloads. (Coming
                      soon)
                    </FieldDescription>
                  </FieldContent>
                  <RadioGroupItem
                    value="vm"
                    id="vm-z4k"
                    aria-label="Virtual Machine"
                  />
                </Field>
              </FieldLabel>
            </RadioGroup>
          </FieldSet>
          <FieldSeparator />
          <Field orientation="horizontal">
            <FieldContent>
              <FieldLabel htmlFor="number-of-gpus-f6l">
                Number of GPUs
              </FieldLabel>
              <FieldDescription>You can add more later.</FieldDescription>
            </FieldContent>
            <ButtonGroup>
              <Input
                id="number-of-gpus-f6l"
                value={gpuCount}
                onChange={handleGpuInputChange}
                size={3}
                maxLength={3}
              />
              <Button
                variant="outline"
                size="icon"
                type="button"
                aria-label="Decrement"
                onClick={() => handleGpuAdjustment(-1)}
                disabled={gpuCount <= 1}
              >
                <IconPlaceholder
                  lucide="MinusIcon"
                  tabler="IconMinus"
                  hugeicons="MinusSignIcon"
                  phosphor="MinusIcon"
                  remixicon="RiSubtractLine"
                />
              </Button>
              <Button
                variant="outline"
                size="icon"
                type="button"
                aria-label="Increment"
                onClick={() => handleGpuAdjustment(1)}
                disabled={gpuCount >= 99}
              >
                <IconPlaceholder
                  lucide="PlusIcon"
                  tabler="IconPlus"
                  hugeicons="PlusSignIcon"
                  phosphor="PlusIcon"
                  remixicon="RiAddLine"
                />
              </Button>
            </ButtonGroup>
          </Field>
          <FieldSeparator />
          <Field orientation="horizontal">
            <FieldContent>
              <FieldLabel htmlFor="tinting">Wallpaper Tinting</FieldLabel>
              <FieldDescription>
                Allow the wallpaper to be tinted.
              </FieldDescription>
            </FieldContent>
            <Switch id="tinting" defaultChecked />
          </Field>
          <FieldSeparator />
          <FieldLabel htmlFor="checkbox-demo">
            <Field orientation="horizontal">
              <Checkbox id="checkbox-demo" defaultChecked />
              <FieldLabel htmlFor="checkbox-demo" className="line-clamp-1">
                I agree to the terms and conditions
              </FieldLabel>
            </Field>
          </FieldLabel>
          <Field>
            <FieldTitle>Price Range</FieldTitle>
            <FieldDescription>
              Set your budget range ($
              <span className="font-medium tabular-nums">
                {value[0]}
              </span> -{" "}
              <span className="font-medium tabular-nums">{value[1]}</span>).
            </FieldDescription>
            <Slider
              value={value}
              onValueChange={(val) => setValue(val as number[])}
              max={1000}
              min={0}
              step={10}
              className="mt-2 w-full"
              aria-label="Price Range"
            />
          </Field>
          <Field orientation="horizontal">
            <Button type="submit">Submit</Button>
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </Field>
        </FieldGroup>
      </FieldSet>
    </Example>
  )
}

function ButtonGroupExamples() {
  const [label, setLabel] = React.useState("personal")

  return (
    <Example title="Button Group" className="items-center justify-center">
      <div className="flex flex-col gap-6">
        <ButtonGroup>
          <ButtonGroup className="hidden sm:flex">
            <Button variant="outline" size="icon-sm" aria-label="Go Back">
              <IconPlaceholder
                lucide="ArrowLeftIcon"
                tabler="IconArrowLeft"
                hugeicons="ArrowLeft01Icon"
                phosphor="ArrowLeftIcon"
                remixicon="RiArrowLeftLine"
              />
            </Button>
          </ButtonGroup>
          <ButtonGroup>
            <Button variant="outline" size="sm">
              Archive
            </Button>
            <Button variant="outline" size="sm">
              Report
            </Button>
          </ButtonGroup>
          <ButtonGroup>
            <Button variant="outline" size="sm">
              Snooze
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="outline"
                    size="icon-sm"
                    aria-label="More Options"
                  />
                }
              >
                <IconPlaceholder
                  lucide="ChevronDownIcon"
                  tabler="IconChevronDown"
                  hugeicons="ArrowDown01Icon"
                  phosphor="CaretDownIcon"
                  remixicon="RiArrowDownSLine"
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <IconPlaceholder
                      lucide="MailCheckIcon"
                      tabler="IconMailCheck"
                      hugeicons="MailValidation01Icon"
                      phosphor="EnvelopeIcon"
                      remixicon="RiMailLine"
                    />
                    Mark as Read
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <IconPlaceholder
                      lucide="ArchiveIcon"
                      tabler="IconArchive"
                      hugeicons="ArchiveIcon"
                      phosphor="ArchiveIcon"
                      remixicon="RiArchiveLine"
                    />
                    Archive
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <IconPlaceholder
                      lucide="ClockIcon"
                      tabler="IconClock"
                      hugeicons="ClockIcon"
                      phosphor="ClockIcon"
                      remixicon="RiTimeLine"
                    />
                    Snooze
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <IconPlaceholder
                      lucide="CalendarPlusIcon"
                      tabler="IconCalendarPlus"
                      hugeicons="CalendarAdd01Icon"
                      phosphor="CalendarPlusIcon"
                      remixicon="RiCalendarEventLine"
                    />
                    Add to Calendar
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <IconPlaceholder
                      lucide="ListFilterIcon"
                      tabler="IconFilterPlus"
                      hugeicons="AddToListIcon"
                      phosphor="ListPlusIcon"
                      remixicon="RiPlayListAddLine"
                    />
                    Add to List
                  </DropdownMenuItem>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <IconPlaceholder
                        lucide="TagIcon"
                        tabler="IconTag"
                        hugeicons="TagIcon"
                        phosphor="TagIcon"
                        remixicon="RiPriceTagLine"
                      />
                      Label As...
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        <DropdownMenuGroup>
                          <DropdownMenuRadioGroup
                            value={label}
                            onValueChange={setLabel}
                          >
                            <DropdownMenuRadioItem value="personal">
                              Personal
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="work">
                              Work
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="other">
                              Other
                            </DropdownMenuRadioItem>
                          </DropdownMenuRadioGroup>
                        </DropdownMenuGroup>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem variant="destructive">
                    <IconPlaceholder
                      lucide="Trash2Icon"
                      tabler="IconTrash"
                      hugeicons="Delete02Icon"
                      phosphor="TrashIcon"
                      remixicon="RiDeleteBinLine"
                    />
                    Trash
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </ButtonGroup>
          <ButtonGroup className="hidden sm:flex">
            <Button variant="outline" size="icon-sm" aria-label="Previous">
              <IconPlaceholder
                lucide="ArrowLeftIcon"
                tabler="IconArrowLeft"
                hugeicons="ArrowLeft01Icon"
                phosphor="ArrowLeftIcon"
                remixicon="RiArrowLeftLine"
              />
            </Button>
            <Button variant="outline" size="icon-sm" aria-label="Next">
              <IconPlaceholder
                lucide="ArrowRightIcon"
                tabler="IconArrowRight"
                hugeicons="ArrowRight01Icon"
                phosphor="ArrowRightIcon"
                remixicon="RiArrowRightLine"
              />
            </Button>
          </ButtonGroup>
        </ButtonGroup>
        <div className="flex gap-4">
          <ButtonGroup className="hidden sm:flex">
            <ButtonGroup>
              <Button variant="outline">1</Button>
              <Button variant="outline">2</Button>
              <Button variant="outline">3</Button>
            </ButtonGroup>
          </ButtonGroup>
          <ButtonGroup>
            <ButtonGroup>
              <Button variant="outline">Follow</Button>
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={<Button variant="outline" size="icon" />}
                >
                  <IconPlaceholder
                    lucide="ChevronDownIcon"
                    tabler="IconChevronDown"
                    hugeicons="ArrowDown01Icon"
                    phosphor="CaretDownIcon"
                    remixicon="RiArrowDownSLine"
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
                    <DropdownMenuItem>
                      <IconPlaceholder
                        lucide="VolumeX"
                        tabler="IconVolume"
                        hugeicons="VolumeOffIcon"
                        phosphor="SpeakerSlashIcon"
                        remixicon="RiVolumeMuteLine"
                      />
                      Mute Conversation
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <IconPlaceholder
                        lucide="CheckIcon"
                        tabler="IconCheck"
                        hugeicons="Tick02Icon"
                        phosphor="CheckIcon"
                        remixicon="RiCheckLine"
                      />
                      Mark as Read
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <IconPlaceholder
                        lucide="UserRoundXIcon"
                        tabler="IconUserX"
                        hugeicons="UserRemove01Icon"
                        phosphor="UserMinusIcon"
                        remixicon="RiUserUnfollowLine"
                      />
                      Block User
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>Conversation</DropdownMenuLabel>
                    <DropdownMenuItem>
                      <IconPlaceholder
                        lucide="ShareIcon"
                        tabler="IconShare"
                        hugeicons="Share03Icon"
                        phosphor="ShareIcon"
                        remixicon="RiShareLine"
                      />
                      Share Conversation
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <IconPlaceholder
                        lucide="CopyIcon"
                        tabler="IconCopy"
                        hugeicons="Copy01Icon"
                        phosphor="CopyIcon"
                        remixicon="RiFileCopyLine"
                      />
                      Copy Conversation
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <IconPlaceholder
                        lucide="AlertTriangleIcon"
                        tabler="IconAlertTriangle"
                        hugeicons="AlertCircleIcon"
                        phosphor="WarningIcon"
                        remixicon="RiErrorWarningLine"
                      />
                      Report Conversation
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem variant="destructive">
                      <IconPlaceholder
                        lucide="TrashIcon"
                        tabler="IconTrash"
                        hugeicons="Delete02Icon"
                        phosphor="TrashIcon"
                        remixicon="RiDeleteBinLine"
                      />
                      Delete Conversation
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </ButtonGroup>
            <ButtonGroup>
              <Button variant="outline">
                <IconPlaceholder
                  lucide="BotIcon"
                  tabler="IconRobot"
                  hugeicons="BotIcon"
                  phosphor="RobotIcon"
                  remixicon="RiRobotLine"
                />{" "}
                Copilot
              </Button>
              <Popover>
                <PopoverTrigger
                  render={
                    <Button
                      variant="outline"
                      size="icon"
                      aria-label="Open Popover"
                    />
                  }
                >
                  <IconPlaceholder
                    lucide="ChevronDownIcon"
                    tabler="IconChevronDown"
                    hugeicons="ArrowDown01Icon"
                    phosphor="CaretDownIcon"
                    remixicon="RiArrowDownSLine"
                  />
                </PopoverTrigger>
                <PopoverContent align="end" className="w-96">
                  <PopoverHeader>
                    <PopoverTitle>Agent Tasks</PopoverTitle>
                    <PopoverDescription>
                      Describe your task in natural language. Copilot will work
                      in the background and open a pull request.
                    </PopoverDescription>
                  </PopoverHeader>
                  <div className="text-sm *:[p:not(:last-child)]:mb-2">
                    <Textarea
                      placeholder="Describe your task in natural language."
                      className="min-h-32 resize-none"
                    />
                  </div>
                </PopoverContent>
              </Popover>
            </ButtonGroup>
          </ButtonGroup>
        </div>
      </div>
    </Example>
  )
}

function InputGroupExamples() {
  const [isFavorite, setIsFavorite] = React.useState(false)
  const [voiceEnabled, setVoiceEnabled] = React.useState(false)

  return (
    <Example title="Input Group">
      <div className="flex flex-col gap-6">
        <InputGroup>
          <InputGroupInput placeholder="Search..." />
          <InputGroupAddon>
            <IconPlaceholder
              lucide="SearchIcon"
              tabler="IconSearch"
              hugeicons="Search01Icon"
              phosphor="MagnifyingGlassIcon"
              remixicon="RiSearchLine"
            />
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">12 results</InputGroupAddon>
        </InputGroup>
        <InputGroup>
          <InputGroupInput placeholder="example.com" className="!pl-1" />
          <InputGroupAddon>
            <InputGroupText>https://</InputGroupText>
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">
            <Tooltip>
              <TooltipTrigger
                render={
                  <InputGroupButton
                    className="rounded-full"
                    size="icon-xs"
                    aria-label="Info"
                  />
                }
              >
                <IconPlaceholder
                  lucide="InfoIcon"
                  tabler="IconInfoCircle"
                  hugeicons="AlertCircleIcon"
                  phosphor="InfoIcon"
                  remixicon="RiInformationLine"
                />
              </TooltipTrigger>
              <TooltipContent>This is content in a tooltip.</TooltipContent>
            </Tooltip>
          </InputGroupAddon>
        </InputGroup>
        <Field>
          <Label htmlFor="input-secure-19" className="sr-only">
            Input Secure
          </Label>
          <InputGroup>
            <InputGroupInput id="input-secure-19" className="!pl-0.5" />
            <InputGroupAddon>
              <Popover>
                <PopoverTrigger
                  render={
                    <InputGroupButton
                      variant="secondary"
                      size="icon-xs"
                      aria-label="Info"
                    />
                  }
                >
                  <IconPlaceholder
                    lucide="InfoIcon"
                    tabler="IconInfoCircle"
                    hugeicons="AlertCircleIcon"
                    phosphor="InfoIcon"
                    remixicon="RiInformationLine"
                  />
                </PopoverTrigger>
                <PopoverContent
                  align="start"
                  alignOffset={10}
                  className="flex flex-col gap-1 rounded-xl text-sm"
                >
                  <p className="font-medium">Your connection is not secure.</p>
                  <p>
                    You should not enter any sensitive information on this site.
                  </p>
                </PopoverContent>
              </Popover>
            </InputGroupAddon>
            <InputGroupAddon className="text-muted-foreground !pl-1">
              https://
            </InputGroupAddon>
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                onClick={() => setIsFavorite(!isFavorite)}
                size="icon-xs"
                aria-label="Favorite"
              >
                <IconPlaceholder
                  lucide="StarIcon"
                  tabler="IconStar"
                  hugeicons="StarIcon"
                  phosphor="StarIcon"
                  remixicon="RiStarLine"
                  data-favorite={isFavorite}
                  className="data-[favorite=true]:fill-primary data-[favorite=true]:stroke-primary"
                />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </Field>
        <ButtonGroup className="w-full">
          <ButtonGroup>
            <Button variant="outline" size="icon" aria-label="Add">
              <IconPlaceholder
                lucide="PlusIcon"
                tabler="IconPlus"
                hugeicons="PlusSignIcon"
                phosphor="PlusIcon"
                remixicon="RiAddLine"
              />
            </Button>
          </ButtonGroup>
          <ButtonGroup className="flex-1">
            <InputGroup>
              <InputGroupInput
                placeholder={
                  voiceEnabled
                    ? "Record and send audio..."
                    : "Send a message..."
                }
                disabled={voiceEnabled}
              />
              <InputGroupAddon align="inline-end">
                <Tooltip>
                  <TooltipTrigger
                    render={
                      <InputGroupButton
                        onClick={() => setVoiceEnabled(!voiceEnabled)}
                        data-active={voiceEnabled}
                        className="data-[active=true]:bg-primary data-[active=true]:text-primary-foreground"
                        aria-pressed={voiceEnabled}
                        size="icon-xs"
                        aria-label="Voice Mode"
                      />
                    }
                  >
                    <IconPlaceholder
                      lucide="AudioLinesIcon"
                      tabler="IconWaveSine"
                      hugeicons="AudioWave01Icon"
                      phosphor="MicrophoneIcon"
                      remixicon="RiMicLine"
                    />
                  </TooltipTrigger>
                  <TooltipContent>Voice Mode</TooltipContent>
                </Tooltip>
              </InputGroupAddon>
            </InputGroup>
          </ButtonGroup>
        </ButtonGroup>
        <InputGroup>
          <InputGroupTextarea placeholder="Ask, Search or Chat..." />
          <InputGroupAddon align="block-end">
            <InputGroupButton
              variant="outline"
              className="style-lyra:rounded-none rounded-full"
              size="icon-xs"
              aria-label="Add"
            >
              <IconPlaceholder
                lucide="PlusIcon"
                tabler="IconPlus"
                hugeicons="PlusSignIcon"
                phosphor="PlusIcon"
                remixicon="RiAddLine"
              />
            </InputGroupButton>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={<InputGroupButton variant="ghost" />}
              >
                Auto
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                align="start"
                className="[--radius:0.95rem]"
              >
                <DropdownMenuGroup>
                  <DropdownMenuItem>Auto</DropdownMenuItem>
                  <DropdownMenuItem>Agent</DropdownMenuItem>
                  <DropdownMenuItem>Manual</DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <InputGroupText className="ml-auto">52% used</InputGroupText>
            <Separator orientation="vertical" className="!h-4" />
            <InputGroupButton
              variant="default"
              className="style-lyra:rounded-none rounded-full"
              size="icon-xs"
            >
              <IconPlaceholder
                lucide="ArrowUpIcon"
                tabler="IconArrowUp"
                hugeicons="ArrowUp01Icon"
                phosphor="ArrowUpIcon"
                remixicon="RiArrowUpLine"
              />
              <span className="sr-only">Send</span>
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </div>
    </Example>
  )
}

function EmptyAvatarGroup() {
  return (
    <Example title="Empty">
      <Empty className="h-full flex-none border">
        <EmptyHeader>
          <EmptyMedia>
            <AvatarGroup className="grayscale">
              <Avatar size="lg">
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <Avatar size="lg">
                <AvatarImage
                  src="https://github.com/maxleiter.png"
                  alt="@maxleiter"
                />
                <AvatarFallback>LR</AvatarFallback>
              </Avatar>
              <Avatar size="lg">
                <AvatarImage
                  src="https://github.com/evilrabbit.png"
                  alt="@evilrabbit"
                />
                <AvatarFallback>ER</AvatarFallback>
              </Avatar>
            </AvatarGroup>
          </EmptyMedia>
          <EmptyTitle>No Team Members</EmptyTitle>
          <EmptyDescription>
            Invite your team to collaborate on this project.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div className="flex gap-2">
            <AlertDialog>
              <AlertDialogTrigger render={<Button variant="outline" />}>
                Show Dialog
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your account and remove your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction>Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <AlertDialog>
              <AlertDialogTrigger render={<Button />}>
                Connect Mouse
              </AlertDialogTrigger>
              <AlertDialogContent size="sm">
                <AlertDialogHeader>
                  <AlertDialogMedia>
                    <IconPlaceholder
                      lucide="BluetoothIcon"
                      tabler="IconBluetooth"
                      hugeicons="BluetoothIcon"
                      phosphor="BluetoothIcon"
                      remixicon="RiBluetoothLine"
                    />
                  </AlertDialogMedia>
                  <AlertDialogTitle>
                    Allow accessory to connect?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Do you want to allow the USB accessory to connect to this
                    device?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Don&apos;t allow</AlertDialogCancel>
                  <AlertDialogAction>Allow</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </EmptyContent>
      </Empty>
    </Example>
  )
}

function FormExample() {
  const monthItems = [
    { label: "MM", value: null },
    { label: "01", value: "01" },
    { label: "02", value: "02" },
    { label: "03", value: "03" },
    { label: "04", value: "04" },
    { label: "05", value: "05" },
    { label: "06", value: "06" },
    { label: "07", value: "07" },
    { label: "08", value: "08" },
    { label: "09", value: "09" },
    { label: "10", value: "10" },
    { label: "11", value: "11" },
    { label: "12", value: "12" },
  ]

  const yearItems = [
    { label: "YYYY", value: null },
    { label: "2024", value: "2024" },
    { label: "2025", value: "2025" },
    { label: "2026", value: "2026" },
    { label: "2027", value: "2027" },
    { label: "2028", value: "2028" },
    { label: "2029", value: "2029" },
  ]

  return (
    <Example title="Complex Form">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
          <CardDescription>
            All transactions are secure and encrypted
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <FieldGroup>
              <FieldSet>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="checkout-7j9-card-name-43j">
                      Name on Card
                    </FieldLabel>
                    <Input
                      id="checkout-7j9-card-name-43j"
                      placeholder="John Doe"
                      required
                    />
                  </Field>
                  <div className="grid grid-cols-3 gap-4">
                    <Field className="col-span-2">
                      <FieldLabel htmlFor="checkout-7j9-card-number-uw1">
                        Card Number
                      </FieldLabel>
                      <Input
                        id="checkout-7j9-card-number-uw1"
                        placeholder="1234 5678 9012 3456"
                        required
                      />
                      <FieldDescription>
                        Enter your 16-digit number.
                      </FieldDescription>
                    </Field>
                    <Field className="col-span-1">
                      <FieldLabel htmlFor="checkout-7j9-cvv">CVV</FieldLabel>
                      <Input id="checkout-7j9-cvv" placeholder="123" required />
                    </Field>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Field>
                      <FieldLabel htmlFor="checkout-7j9-exp-month-ts6">
                        Month
                      </FieldLabel>
                      <Select items={monthItems} defaultValue={null}>
                        <SelectTrigger id="checkout-7j9-exp-month-ts6">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {monthItems.map((item) => (
                              <SelectItem key={item.value} value={item.value}>
                                {item.label}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="checkout-7j9-exp-year-f59">
                        Year
                      </FieldLabel>
                      <Select items={yearItems} defaultValue={null}>
                        <SelectTrigger id="checkout-7j9-exp-year-f59">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {yearItems.map((item) => (
                              <SelectItem key={item.value} value={item.value}>
                                {item.label}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </Field>
                  </div>
                </FieldGroup>
              </FieldSet>
              <FieldSeparator />
              <FieldSet>
                <FieldLegend>Billing Address</FieldLegend>
                <FieldDescription>
                  The billing address associated with your payment.
                </FieldDescription>
                <FieldGroup>
                  <Field orientation="horizontal">
                    <Checkbox
                      id="checkout-7j9-same-as-shipping-wgm"
                      defaultChecked
                    />
                    <FieldLabel
                      htmlFor="checkout-7j9-same-as-shipping-wgm"
                      className="font-normal"
                    >
                      Same as shipping address
                    </FieldLabel>
                  </Field>
                </FieldGroup>
              </FieldSet>
              <FieldSeparator />
              <FieldSet>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="checkout-7j9-optional-comments">
                      Comments
                    </FieldLabel>
                    <Textarea
                      id="checkout-7j9-optional-comments"
                      placeholder="Add any additional comments"
                    />
                  </Field>
                </FieldGroup>
              </FieldSet>
              <Field orientation="horizontal">
                <Button type="submit">Submit</Button>
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </Example>
  )
}

const frameworks = [
  "Next.js",
  "SvelteKit",
  "Nuxt.js",
  "Remix",
  "Astro",
] as const

const roleItems = [
  { label: "Developer", value: "developer" },
  { label: "Designer", value: "designer" },
  { label: "Manager", value: "manager" },
  { label: "Other", value: "other" },
]

function SmallFormExample() {
  const [notifications, setNotifications] = React.useState({
    email: true,
    sms: false,
    push: true,
  })
  const [theme, setTheme] = React.useState("light")

  return (
    <Example title="Form">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>User Information</CardTitle>
          <CardDescription>Please fill in your details below</CardDescription>
          <CardAction>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={<Button variant="ghost" size="icon" />}
              >
                <IconPlaceholder
                  lucide="MoreVerticalIcon"
                  tabler="IconDotsVertical"
                  hugeicons="MoreVerticalCircle01Icon"
                  phosphor="DotsThreeVerticalIcon"
                  remixicon="RiMore2Line"
                />
                <span className="sr-only">More options</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="style-maia:w-56 style-mira:w-48 style-nova:w-48 style-vega:w-56 style-lyra:w-48"
              >
                <DropdownMenuGroup>
                  <DropdownMenuLabel>File</DropdownMenuLabel>
                  <DropdownMenuItem>
                    <IconPlaceholder
                      lucide="FileIcon"
                      tabler="IconFile"
                      hugeicons="FileIcon"
                      phosphor="FileIcon"
                      remixicon="RiFileLine"
                    />
                    New File
                    <DropdownMenuShortcut>⌘N</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <IconPlaceholder
                      lucide="FolderIcon"
                      tabler="IconFolder"
                      hugeicons="FolderIcon"
                      phosphor="FolderIcon"
                      remixicon="RiFolderLine"
                    />
                    New Folder
                    <DropdownMenuShortcut>⇧⌘N</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <IconPlaceholder
                        lucide="FolderOpenIcon"
                        tabler="IconFolderOpen"
                        hugeicons="FolderOpenIcon"
                        phosphor="FolderOpenIcon"
                        remixicon="RiFolderOpenLine"
                      />
                      Open Recent
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        <DropdownMenuGroup>
                          <DropdownMenuLabel>Recent Projects</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <IconPlaceholder
                              lucide="FileCodeIcon"
                              tabler="IconFileCode"
                              hugeicons="CodeIcon"
                              phosphor="CodeIcon"
                              remixicon="RiCodeLine"
                            />
                            Project Alpha
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <IconPlaceholder
                              lucide="FileCodeIcon"
                              tabler="IconFileCode"
                              hugeicons="CodeIcon"
                              phosphor="CodeIcon"
                              remixicon="RiCodeLine"
                            />
                            Project Beta
                          </DropdownMenuItem>
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                              <IconPlaceholder
                                lucide="MoreHorizontalIcon"
                                tabler="IconDots"
                                hugeicons="MoreHorizontalCircle01Icon"
                                phosphor="DotsThreeOutlineIcon"
                                remixicon="RiMoreLine"
                              />
                              More Projects
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                              <DropdownMenuSubContent>
                                <DropdownMenuItem>
                                  <IconPlaceholder
                                    lucide="FileCodeIcon"
                                    tabler="IconFileCode"
                                    hugeicons="CodeIcon"
                                    phosphor="CodeIcon"
                                    remixicon="RiCodeLine"
                                  />
                                  Project Gamma
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <IconPlaceholder
                                    lucide="FileCodeIcon"
                                    tabler="IconFileCode"
                                    hugeicons="CodeIcon"
                                    phosphor="CodeIcon"
                                    remixicon="RiCodeLine"
                                  />
                                  Project Delta
                                </DropdownMenuItem>
                              </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                          </DropdownMenuSub>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                          <DropdownMenuItem>
                            <IconPlaceholder
                              lucide="FolderSearchIcon"
                              tabler="IconFolderSearch"
                              hugeicons="SearchIcon"
                              phosphor="MagnifyingGlassIcon"
                              remixicon="RiSearchLine"
                            />
                            Browse...
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <IconPlaceholder
                      lucide="SaveIcon"
                      tabler="IconDeviceFloppy"
                      hugeicons="FloppyDiskIcon"
                      phosphor="FloppyDiskIcon"
                      remixicon="RiSaveLine"
                    />
                    Save
                    <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <IconPlaceholder
                      lucide="DownloadIcon"
                      tabler="IconDownload"
                      hugeicons="DownloadIcon"
                      phosphor="DownloadIcon"
                      remixicon="RiDownloadLine"
                    />
                    Export
                    <DropdownMenuShortcut>⇧⌘E</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuLabel>View</DropdownMenuLabel>
                  <DropdownMenuCheckboxItem
                    checked={notifications.email}
                    onCheckedChange={(checked) =>
                      setNotifications({
                        ...notifications,
                        email: checked === true,
                      })
                    }
                  >
                    <IconPlaceholder
                      lucide="EyeIcon"
                      tabler="IconEye"
                      hugeicons="EyeIcon"
                      phosphor="EyeIcon"
                      remixicon="RiEyeLine"
                    />
                    Show Sidebar
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={notifications.sms}
                    onCheckedChange={(checked) =>
                      setNotifications({
                        ...notifications,
                        sms: checked === true,
                      })
                    }
                  >
                    <IconPlaceholder
                      lucide="LayoutIcon"
                      tabler="IconLayout"
                      hugeicons="LayoutIcon"
                      phosphor="LayoutIcon"
                      remixicon="RiLayoutLine"
                    />
                    Show Status Bar
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <IconPlaceholder
                        lucide="PaletteIcon"
                        tabler="IconPalette"
                        hugeicons="PaintBoardIcon"
                        phosphor="PaletteIcon"
                        remixicon="RiPaletteLine"
                      />
                      Theme
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        <DropdownMenuGroup>
                          <DropdownMenuLabel>Appearance</DropdownMenuLabel>
                          <DropdownMenuRadioGroup
                            value={theme}
                            onValueChange={setTheme}
                          >
                            <DropdownMenuRadioItem value="light">
                              <IconPlaceholder
                                lucide="SunIcon"
                                tabler="IconSun"
                                hugeicons="SunIcon"
                                phosphor="SunIcon"
                                remixicon="RiSunLine"
                              />
                              Light
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="dark">
                              <IconPlaceholder
                                lucide="MoonIcon"
                                tabler="IconMoon"
                                hugeicons="MoonIcon"
                                phosphor="MoonIcon"
                                remixicon="RiMoonLine"
                              />
                              Dark
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="system">
                              <IconPlaceholder
                                lucide="MonitorIcon"
                                tabler="IconDeviceDesktop"
                                hugeicons="ComputerIcon"
                                phosphor="MonitorIcon"
                                remixicon="RiComputerLine"
                              />
                              System
                            </DropdownMenuRadioItem>
                          </DropdownMenuRadioGroup>
                        </DropdownMenuGroup>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <IconPlaceholder
                      lucide="HelpCircleIcon"
                      tabler="IconHelpCircle"
                      hugeicons="HelpCircleIcon"
                      phosphor="QuestionIcon"
                      remixicon="RiQuestionLine"
                    />
                    Help & Support
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <IconPlaceholder
                      lucide="FileTextIcon"
                      tabler="IconFileText"
                      hugeicons="File01Icon"
                      phosphor="FileTextIcon"
                      remixicon="RiFileTextLine"
                    />
                    Documentation
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem variant="destructive">
                    <IconPlaceholder
                      lucide="LogOutIcon"
                      tabler="IconLogout"
                      hugeicons="LogoutIcon"
                      phosphor="SignOutIcon"
                      remixicon="RiLogoutBoxLine"
                    />
                    Sign Out
                    <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form>
            <FieldGroup>
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="small-form-name">Name</FieldLabel>
                  <Input
                    id="small-form-name"
                    placeholder="Enter your name"
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="small-form-role">Role</FieldLabel>
                  <Select items={roleItems} defaultValue={null}>
                    <SelectTrigger id="small-form-role">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {roleItems.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
              </div>
              <Field>
                <FieldLabel htmlFor="small-form-framework">
                  Framework
                </FieldLabel>
                <Combobox items={frameworks}>
                  <ComboboxInput
                    id="small-form-framework"
                    placeholder="Select a framework"
                    required
                  />
                  <ComboboxContent>
                    <ComboboxEmpty>No frameworks found.</ComboboxEmpty>
                    <ComboboxList>
                      {(item) => (
                        <ComboboxItem key={item} value={item}>
                          {item}
                        </ComboboxItem>
                      )}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
              </Field>
              <Field>
                <FieldLabel htmlFor="small-form-comments">Comments</FieldLabel>
                <Textarea
                  id="small-form-comments"
                  placeholder="Add any additional comments"
                />
              </Field>
              <Field orientation="horizontal">
                <Button type="submit">Submit</Button>
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </Example>
  )
}

function ObservabilityCard() {
  return (
    <Example title="Card" className="items-center justify-center">
      <Card className="relative w-full max-w-sm overflow-hidden pt-0">
        <div className="bg-primary absolute inset-0 z-30 aspect-video opacity-50 mix-blend-color" />
        <img
          src="https://images.unsplash.com/photo-1604076850742-4c7221f3101b?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Photo by mymind on Unsplash"
          title="Photo by mymind on Unsplash"
          className="relative z-20 aspect-video w-full object-cover brightness-60 grayscale"
        />
        <CardHeader>
          <CardTitle>Observability Plus is replacing Monitoring</CardTitle>
          <CardDescription>
            Switch to the improved way to explore your data, with natural
            language. Monitoring will no longer be available on the Pro plan in
            November, 2025
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button>
            Create Query{" "}
            <IconPlaceholder
              lucide="PlusIcon"
              tabler="IconPlus"
              hugeicons="PlusSignIcon"
              phosphor="PlusIcon"
              remixicon="RiAddLine"
              data-icon="inline-end"
            />
          </Button>
          <Badge variant="secondary" className="ml-auto">
            Warning
          </Badge>
        </CardFooter>
      </Card>
    </Example>
  )
}

function ItemExample() {
  return (
    <Example title="Item">
      <div className="flex w-full max-w-md flex-col gap-6">
        <Item variant="outline">
          <ItemContent>
            <ItemTitle>Two-factor authentication</ItemTitle>
            <ItemDescription className="text-pretty xl:hidden 2xl:block">
              Verify via email or phone number.
            </ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button size="sm" variant="secondary">
              Enable
            </Button>
          </ItemActions>
        </Item>
        <Item variant="outline" size="sm" render={<a href="#" />}>
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
            <ItemTitle>Your order has been shipped.</ItemTitle>
          </ItemContent>
        </Item>
      </div>
    </Example>
  )
}

function BadgeExamples() {
  return (
    <Example title="Badge" className="items-center justify-center">
      <div className="flex items-center justify-center gap-2">
        <Badge>
          <Spinner data-icon="inline-start" />
          Syncing
        </Badge>
        <Badge variant="secondary">
          <Spinner data-icon="inline-start" />
          Updating
        </Badge>
        <Badge variant="outline">
          <Spinner data-icon="inline-start" />
          Loading
        </Badge>
        <Badge variant="link" className="hidden sm:flex">
          <Spinner data-icon="inline-start" />
          Link
        </Badge>
      </div>
    </Example>
  )
}

function EmptyWithSpinner() {
  return (
    <Example title="Empty with Spinner">
      <Empty className="w-full border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Spinner />
          </EmptyMedia>
          <EmptyTitle>Processing your request</EmptyTitle>
          <EmptyDescription>
            Please wait while we process your request. Do not refresh the page.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div className="flex gap-2">
            <Button size="sm">Submit</Button>
            <Button variant="outline" size="sm">
              Cancel
            </Button>
          </div>
        </EmptyContent>
      </Empty>
    </Example>
  )
}

const SHEET_SIDES = ["top", "right", "bottom", "left"] as const

function SheetExample() {
  return (
    <Example title="Sheet">
      <div className="flex gap-2">
        {SHEET_SIDES.map((side) => (
          <Sheet key={side}>
            <SheetTrigger
              render={
                <Button variant="secondary" className="flex-1 capitalize" />
              }
            >
              {side}
            </SheetTrigger>
            <SheetContent
              side={side}
              className="data-[side=bottom]:max-h-[50vh] data-[side=top]:max-h-[50vh]"
            >
              <SheetHeader>
                <SheetTitle>Edit profile</SheetTitle>
                <SheetDescription>
                  Make changes to your profile here. Click save when you&apos;re
                  done.
                </SheetDescription>
              </SheetHeader>
              <div className="overflow-y-auto px-4 text-sm">
                {Array.from({ length: 10 }).map((_, index) => (
                  <p
                    key={index}
                    className="style-lyra:mb-2 style-lyra:leading-relaxed mb-4 leading-normal"
                  >
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor in reprehenderit in voluptate velit
                    esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
                    occaecat cupidatat non proident, sunt in culpa qui officia
                    deserunt mollit anim id est laborum.
                  </p>
                ))}
              </div>
              <SheetFooter>
                <Button type="submit">Save changes</Button>
                <SheetClose render={<Button variant="outline" />}>
                  Cancel
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        ))}
      </div>
    </Example>
  )
}
