"use client"

import * as React from "react"
import { useMemo, useState } from "react"
import {
  IconApps,
  IconAt,
  IconBook,
  IconCheck,
  IconCircleDashedPlus,
  IconInfoCircle,
  IconMinus,
  IconPaperclip,
  IconPlus,
  IconStar,
  IconWorld,
  IconX,
} from "@tabler/icons-react"
import {
  ArchiveIcon,
  ArrowLeftIcon,
  ArrowUpIcon,
  AudioLinesIcon,
  BotIcon,
  CalendarPlusIcon,
  ChevronDownIcon,
  ClockIcon,
  ListFilterPlusIcon,
  MailCheckIcon,
  PlusIcon,
  Search,
  TagIcon,
  Trash2Icon,
} from "lucide-react"

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
} from "@/registry/radix/ui/alert-dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/registry/radix/ui/avatar"
import { Badge } from "@/registry/radix/ui/badge"
import { Button } from "@/registry/radix/ui/button"
import { ButtonGroup } from "@/registry/radix/ui/button-group"
import { Card, CardContent } from "@/registry/radix/ui/card"
import { Checkbox } from "@/registry/radix/ui/checkbox"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/registry/radix/ui/command"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/registry/radix/ui/dropdown-menu"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/registry/radix/ui/empty"
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
} from "@/registry/radix/ui/field"
import { Input } from "@/registry/radix/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/registry/radix/ui/input-group"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/registry/radix/ui/item"
import { Label } from "@/registry/radix/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/radix/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/registry/radix/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/radix/ui/select"
import { Separator } from "@/registry/radix/ui/separator"
import { Slider } from "@/registry/radix/ui/slider"
import { Spinner } from "@/registry/radix/ui/spinner"
import { Switch } from "@/registry/radix/ui/switch"
import { Textarea } from "@/registry/radix/ui/textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/registry/radix/ui/tooltip"
import { IconPlaceholder } from "@/app/(app)/design/components/icon-placeholder"

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
      workspace: "Workspace",
    },
    {
      type: "user",
      title: "evilrabbit",
      image: "https://github.com/evilrabbit.png",
      workspace: "Workspace",
    },
  ],
  models: [
    {
      name: "Auto",
    },
    {
      name: "Agent Mode",
      badge: "Beta",
    },
    {
      name: "Plan Mode",
    },
  ],
}

const options = [
  {
    label: "Social Media",
    value: "social-media",
  },

  {
    label: "Search Engine",
    value: "search-engine",
  },
  {
    label: "Referral",
    value: "referral",
  },
  {
    label: "Other",
    value: "other",
  },
]

export default function CoverExample() {
  return (
    <div className="bg-background mx-auto grid w-full max-w-[1500px] grid-cols-4 gap-8 p-8">
      <div className="flex flex-col gap-6 *:[div]:w-full *:[div]:max-w-full">
        <FieldDemo />
      </div>
      <div className="flex flex-col gap-6 *:[div]:w-full *:[div]:max-w-full">
        <EmptyAvatarGroup />
        <SpinnerBadge />
        <ButtonGroupInputGroup />
        <FieldSlider />
        <InputGroupDemo />
      </div>
      <div className="flex flex-col gap-6 *:[div]:w-full *:[div]:max-w-full">
        <InputGroupButtonExample />
        <ItemDemo />
        <FieldSeparator className="my-4">Appearance Settings</FieldSeparator>
        <AppearanceSettings />
      </div>
      <div className="flex flex-col gap-6 *:[div]:w-full *:[div]:max-w-full">
        <NotionPromptForm />
        <ButtonGroupDemo />
        <FieldCheckbox />
        <div className="flex justify-between gap-4">
          <ButtonGroupNested />
          <ButtonGroupPopover />
        </div>
        <FieldHear />
        <SpinnerEmpty />
      </div>
    </div>
  )
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

function AppearanceSettings() {
  const [gpuCount, setGpuCount] = React.useState(8)

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
    <FieldSet>
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
            <FieldLabel htmlFor="number-of-gpus-f6l">Number of GPUs</FieldLabel>
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
              <IconMinus />
            </Button>
            <Button
              variant="outline"
              size="icon"
              type="button"
              aria-label="Increment"
              onClick={() => handleGpuAdjustment(1)}
              disabled={gpuCount >= 99}
            >
              <IconPlus />
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
      </FieldGroup>
    </FieldSet>
  )
}

function ButtonGroupDemo() {
  const [label, setLabel] = React.useState("personal")

  return (
    <ButtonGroup>
      <ButtonGroup className="hidden sm:flex">
        <Button variant="outline" size="icon-sm" aria-label="Go Back">
          <ArrowLeftIcon />
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
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon-sm" aria-label="More Options">
              <IconPlaceholder icon="PlaceholderIcon" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <MailCheckIcon />
                Mark as Read
              </DropdownMenuItem>
              <DropdownMenuItem>
                <ArchiveIcon />
                Archive
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <ClockIcon />
                Snooze
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CalendarPlusIcon />
                Add to Calendar
              </DropdownMenuItem>
              <DropdownMenuItem>
                <ListFilterPlusIcon />
                Add to List
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <TagIcon />
                  Label As...
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
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
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem variant="destructive">
                <Trash2Icon />
                Trash
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </ButtonGroup>
      <ButtonGroup>
        <Button variant="outline" size="icon-sm" aria-label="Previous">
          <IconPlaceholder icon="PlaceholderIcon" />
        </Button>
        <Button variant="outline" size="icon-sm" aria-label="Next">
          <IconPlaceholder icon="PlaceholderIcon" />
        </Button>
      </ButtonGroup>
    </ButtonGroup>
  )
}

function ButtonGroupInputGroup() {
  const [voiceEnabled, setVoiceEnabled] = React.useState(false)
  return (
    <ButtonGroup>
      <ButtonGroup>
        <Button variant="outline" size="icon" aria-label="Add">
          <PlusIcon />
        </Button>
      </ButtonGroup>
      <ButtonGroup className="flex-1">
        <InputGroup>
          <InputGroupInput
            placeholder={
              voiceEnabled ? "Record and send audio..." : "Send a message..."
            }
            disabled={voiceEnabled}
          />
          <InputGroupAddon align="inline-end">
            <Tooltip>
              <TooltipTrigger asChild>
                <InputGroupButton
                  onClick={() => setVoiceEnabled(!voiceEnabled)}
                  data-active={voiceEnabled}
                  className="data-[active=true]:bg-primary data-[active=true]:text-primary-foreground"
                  aria-pressed={voiceEnabled}
                  size="icon-xs"
                  aria-label="Voice Mode"
                >
                  <AudioLinesIcon />
                </InputGroupButton>
              </TooltipTrigger>
              <TooltipContent>Voice Mode</TooltipContent>
            </Tooltip>
          </InputGroupAddon>
        </InputGroup>
      </ButtonGroup>
    </ButtonGroup>
  )
}

function ButtonGroupNested() {
  return (
    <ButtonGroup>
      <ButtonGroup>
        <Button variant="outline" size="sm">
          1
        </Button>
        <Button variant="outline" size="sm">
          2
        </Button>
        <Button variant="outline" size="sm">
          3
        </Button>
      </ButtonGroup>
    </ButtonGroup>
  )
}

function ButtonGroupPopover() {
  return (
    <ButtonGroup>
      <ButtonGroup>
        <Button variant="outline">Follow</Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="!pl-2">
              <IconPlaceholder icon="ChevronDownIcon" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
              <DropdownMenuItem>
                <IconPlaceholder icon="VolumeOffIcon" />
                Mute Conversation
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconPlaceholder icon="CheckIcon" />
                Mark as Read
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconPlaceholder icon="UserRoundXIcon" />
                Block User
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuLabel>Conversation</DropdownMenuLabel>
              <DropdownMenuItem>
                <IconPlaceholder icon="ShareIcon" />
                Share Conversation
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconPlaceholder icon="CopyIcon" />
                Copy Conversation
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconPlaceholder icon="AlertTriangleIcon" />
                Report Conversation
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem variant="destructive">
                <IconPlaceholder icon="TrashIcon" />
                Delete Conversation
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </ButtonGroup>
      <ButtonGroup>
        <Button variant="outline" size="sm">
          <BotIcon /> Copilot
        </Button>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon-sm" aria-label="Open Popover">
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="p-0">
            <div className="px-4 py-3">
              <div className="text-sm font-medium">Agent Tasks</div>
            </div>
            <Separator />
            <div className="p-4 text-sm *:[p:not(:last-child)]:mb-2">
              <Textarea
                placeholder="Describe your task in natural language."
                className="mb-4 resize-none"
              />
              <p className="font-medium">Start a new task with Copilot</p>
              <p className="text-muted-foreground">
                Describe your task in natural language. Copilot will work in the
                background and open a pull request for your review.
              </p>
            </div>
          </PopoverContent>
        </Popover>
      </ButtonGroup>
    </ButtonGroup>
  )
}

function EmptyAvatarGroup() {
  return (
    <Empty className="flex-none border">
      <EmptyHeader>
        <EmptyMedia>
          <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:size-12 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarImage
                src="https://github.com/maxleiter.png"
                alt="@maxleiter"
              />
              <AvatarFallback>LR</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarImage
                src="https://github.com/evilrabbit.png"
                alt="@evilrabbit"
              />
              <AvatarFallback>ER</AvatarFallback>
            </Avatar>
          </div>
        </EmptyMedia>
        <EmptyTitle>No Team Members</EmptyTitle>
        <EmptyDescription>
          Invite your team to collaborate on this project.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline">Show Dialog</Button>
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
            <AlertDialogTrigger asChild>
              <Button>Connect Mouse</Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="theme-lyra:gap-4 gap-6 sm:max-w-xs">
              <div className="bg-muted theme-lyra:size-10 mx-auto flex size-16 items-center justify-center rounded-full">
                <IconPlaceholder
                  icon="BluetoothIcon"
                  className="theme-lyra:size-6 size-8"
                />
              </div>
              <AlertDialogHeader>
                <AlertDialogTitle className="text-center">
                  Allow accessory to connect?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-center">
                  Do you want to allow the USB accessory to connect to this
                  device?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="grid grid-cols-2 gap-4">
                <AlertDialogCancel>Don&apos;t allow</AlertDialogCancel>
                <AlertDialogAction>Allow</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </EmptyContent>
    </Empty>
  )
}

function FieldCheckbox() {
  return (
    <FieldLabel htmlFor="checkbox-demo">
      <Field orientation="horizontal">
        <Checkbox id="checkbox-demo" defaultChecked />
        <FieldLabel htmlFor="checkbox-demo" className="line-clamp-1">
          I agree to the terms and conditions
        </FieldLabel>
      </Field>
    </FieldLabel>
  )
}

function FieldDemo() {
  return (
    <div className="w-full max-w-md rounded-lg border p-6">
      <form>
        <FieldGroup>
          <FieldSet>
            <FieldLegend>Payment Method</FieldLegend>
            <FieldDescription>
              All transactions are secure and encrypted
            </FieldDescription>
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
                  <Select defaultValue="">
                    <SelectTrigger id="checkout-7j9-exp-month-ts6">
                      <SelectValue placeholder="MM" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="01">01</SelectItem>
                      <SelectItem value="02">02</SelectItem>
                      <SelectItem value="03">03</SelectItem>
                      <SelectItem value="04">04</SelectItem>
                      <SelectItem value="05">05</SelectItem>
                      <SelectItem value="06">06</SelectItem>
                      <SelectItem value="07">07</SelectItem>
                      <SelectItem value="08">08</SelectItem>
                      <SelectItem value="09">09</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="11">11</SelectItem>
                      <SelectItem value="12">12</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel htmlFor="checkout-7j9-exp-year-f59">
                    Year
                  </FieldLabel>
                  <Select defaultValue="">
                    <SelectTrigger id="checkout-7j9-exp-year-f59">
                      <SelectValue placeholder="YYYY" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2025">2025</SelectItem>
                      <SelectItem value="2026">2026</SelectItem>
                      <SelectItem value="2027">2027</SelectItem>
                      <SelectItem value="2028">2028</SelectItem>
                      <SelectItem value="2029">2029</SelectItem>
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
              The billing address associated with your payment method
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
    </div>
  )
}

function FieldHear() {
  return (
    <Card className="py-4 shadow-none">
      <CardContent className="px-4">
        <form>
          <FieldGroup>
            <FieldSet className="gap-4">
              <FieldLegend>How did you hear about us?</FieldLegend>
              <FieldDescription className="line-clamp-1">
                Select the option that best describes how you heard about us.
              </FieldDescription>
              <FieldGroup className="flex flex-row flex-wrap gap-2">
                {options.map((option) => (
                  <FieldLabel
                    htmlFor={option.value}
                    key={option.value}
                    className="!w-fit"
                  >
                    <Field
                      orientation="horizontal"
                      className="gap-1.5 overflow-hidden !px-3 !py-1.5 transition-all duration-100 ease-linear group-has-data-[state=checked]/field-label:!px-2"
                    >
                      <Checkbox
                        value={option.value}
                        id={option.value}
                        defaultChecked={option.value === "social-media"}
                        className="-ml-6 -translate-x-1 rounded-full transition-all duration-100 ease-linear data-[state=checked]:ml-0 data-[state=checked]:translate-x-0"
                      />
                      <FieldTitle>{option.label}</FieldTitle>
                    </Field>
                  </FieldLabel>
                ))}
              </FieldGroup>
            </FieldSet>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}

function FieldSlider() {
  const [value, setValue] = useState([200, 800])
  return (
    <div className="w-full max-w-md">
      <Field>
        <FieldTitle>Price Range</FieldTitle>
        <FieldDescription>
          Set your budget range ($
          <span className="font-medium tabular-nums">{value[0]}</span> -{" "}
          <span className="font-medium tabular-nums">{value[1]}</span>).
        </FieldDescription>
        <Slider
          value={value}
          onValueChange={setValue}
          max={1000}
          min={0}
          step={10}
          className="mt-2 w-full"
          aria-label="Price Range"
        />
      </Field>
    </div>
  )
}

function InputGroupButtonExample() {
  const [isFavorite, setIsFavorite] = React.useState(false)

  return (
    <div className="grid w-full max-w-sm gap-6">
      <Label htmlFor="input-secure-19" className="sr-only">
        Input Secure
      </Label>
      <InputGroup>
        <InputGroupInput id="input-secure-19" className="!pl-0.5" />
        <Popover>
          <PopoverTrigger asChild>
            <InputGroupAddon>
              <InputGroupButton
                variant="secondary"
                size="icon-xs"
                aria-label="Info"
              >
                <IconInfoCircle />
              </InputGroupButton>
            </InputGroupAddon>
          </PopoverTrigger>
          <PopoverContent
            align="start"
            alignOffset={10}
            className="flex flex-col gap-1 rounded-xl text-sm"
          >
            <p className="font-medium">Your connection is not secure.</p>
            <p>You should not enter any sensitive information on this site.</p>
          </PopoverContent>
        </Popover>
        <InputGroupAddon className="text-muted-foreground !pl-1">
          https://
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            onClick={() => setIsFavorite(!isFavorite)}
            size="icon-xs"
            aria-label="Favorite"
          >
            <IconStar
              data-favorite={isFavorite}
              className="data-[favorite=true]:fill-primary data-[favorite=true]:stroke-primary"
            />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}

function InputGroupDemo() {
  return (
    <div className="grid w-full max-w-sm gap-6">
      <InputGroup>
        <InputGroupInput placeholder="Search..." />
        <InputGroupAddon>
          <Search />
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
            <TooltipTrigger asChild>
              <InputGroupButton
                className="rounded-full"
                size="icon-xs"
                aria-label="Info"
              >
                <IconInfoCircle />
              </InputGroupButton>
            </TooltipTrigger>
            <TooltipContent>This is content in a tooltip.</TooltipContent>
          </Tooltip>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupTextarea placeholder="Ask, Search or Chat..." />
        <InputGroupAddon align="block-end">
          <InputGroupButton
            variant="outline"
            className="rounded-full"
            size="icon-xs"
            aria-label="Add"
          >
            <IconPlus />
          </InputGroupButton>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <InputGroupButton variant="ghost">Auto</InputGroupButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="top"
              align="start"
              className="[--radius:0.95rem]"
            >
              <DropdownMenuItem>Auto</DropdownMenuItem>
              <DropdownMenuItem>Agent</DropdownMenuItem>
              <DropdownMenuItem>Manual</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <InputGroupText className="ml-auto">52% used</InputGroupText>
          <Separator orientation="vertical" className="!h-4" />
          <InputGroupButton
            variant="default"
            className="rounded-full"
            size="icon-xs"
          >
            <ArrowUpIcon />
            <span className="sr-only">Send</span>
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupInput placeholder="@shadcn" />
        <InputGroupAddon align="inline-end">
          <div className="bg-primary text-foreground flex size-4 items-center justify-center rounded-full">
            <IconCheck className="size-3 text-white" />
          </div>
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}

function ItemDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      <Item variant="outline">
        <ItemContent>
          <ItemTitle>Two-factor authentication</ItemTitle>
          <ItemDescription className="text-pretty xl:hidden 2xl:block">
            Verify via email or phone number.
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button size="sm">Enable</Button>
        </ItemActions>
      </Item>
      <Item variant="outline" size="sm" asChild>
        <a href="#">
          <ItemMedia>
            <IconPlaceholder icon="PlaceholderIcon" className="size-5" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Your profile has been verified.</ItemTitle>
          </ItemContent>
          <ItemActions>
            <IconPlaceholder icon="PlaceholderIcon" className="size-4" />
          </ItemActions>
        </a>
      </Item>
    </div>
  )
}

function NotionPromptForm() {
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
    <form>
      <Field>
        <FieldLabel htmlFor="notion-prompt" className="sr-only">
          Prompt
        </FieldLabel>
        <InputGroup>
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
                <TooltipTrigger
                  asChild
                  onFocusCapture={(e) => e.stopPropagation()}
                >
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
              <PopoverContent className="p-0" align="start">
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
                    <InputGroupButton size="sm">
                      {selectedModel.name}
                    </InputGroupButton>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent>Select AI model</TooltipContent>
              </Tooltip>
              <DropdownMenuContent side="top" align="start" className="w-42">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Select Agent Mode</DropdownMenuLabel>
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
              <DropdownMenuContent side="top" align="end">
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
                    <DropdownMenuSubContent className="w-72 p-0">
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
              <IconPlaceholder icon="PlaceholderIcon" />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </Field>
    </form>
  )
}

function SpinnerBadge() {
  return (
    <div className="flex items-center gap-2">
      <Badge>
        <Spinner />
        Syncing
      </Badge>
      <Badge variant="secondary">
        <Spinner />
        Updating
      </Badge>
      <Badge variant="outline">
        <Spinner />
        Loading
      </Badge>
    </div>
  )
}

function SpinnerEmpty() {
  return (
    <Empty className="w-full border md:p-6">
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
  )
}
