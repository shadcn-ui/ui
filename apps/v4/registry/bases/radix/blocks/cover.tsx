"use client"

import * as React from "react"
import { useState } from "react"

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
} from "@/registry/bases/radix/ui/alert-dialog"
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
} from "@/registry/bases/radix/ui/avatar"
import { Badge } from "@/registry/bases/radix/ui/badge"
import { Button } from "@/registry/bases/radix/ui/button"
import { ButtonGroup } from "@/registry/bases/radix/ui/button-group"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/bases/radix/ui/card"
import { Checkbox } from "@/registry/bases/radix/ui/checkbox"
import {
  DropdownMenu,
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
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "@/registry/bases/radix/ui/field"
import { Input } from "@/registry/bases/radix/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/registry/bases/radix/ui/input-group"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/registry/bases/radix/ui/item"
import { Label } from "@/registry/bases/radix/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/bases/radix/ui/popover"
import {
  RadioGroup,
  RadioGroupItem,
} from "@/registry/bases/radix/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/bases/radix/ui/select"
import { Separator } from "@/registry/bases/radix/ui/separator"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/registry/bases/radix/ui/sheet"
import { Slider } from "@/registry/bases/radix/ui/slider"
import { Spinner } from "@/registry/bases/radix/ui/spinner"
import { Switch } from "@/registry/bases/radix/ui/switch"
import { Textarea } from "@/registry/bases/radix/ui/textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/registry/bases/radix/ui/tooltip"
import { IconPlaceholder } from "@/app/(design)/components/icon-placeholder"

export default function CoverExample() {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-screen-2xl columns-1 gap-8 md:columns-2 lg:columns-3 2xl:columns-4 [&>*]:mb-8 [&>*]:break-inside-avoid">
        <FieldExample />
        <SpinnerEmpty />
        <EmptyAvatarGroup />
        <FieldSlider />
        <SheetExample />
        <SpinnerBadge />
        <InputGroupExample />
        <InputGroupButtonExample />
        <ButtonGroupInputGroup />
        <ItemExample />
        <FieldHear />
        <AppearanceSettings />
        <ButtonGroupExample />
        <FieldCheckbox />
        <ButtonGroupExample2 />
      </div>
    </div>
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
              <IconPlaceholder
                lucide="MinusIcon"
                tabler="IconMinus"
                hugeicons="MinusSignIcon"
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
      </FieldGroup>
    </FieldSet>
  )
}

function ButtonGroupExample() {
  const [label, setLabel] = React.useState("personal")

  return (
    <ButtonGroup>
      <ButtonGroup className="hidden sm:flex">
        <Button variant="outline" size="icon-sm" aria-label="Go Back">
          <IconPlaceholder
            lucide="ArrowLeftIcon"
            tabler="IconArrowLeft"
            hugeicons="ArrowLeft01Icon"
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
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon-sm" aria-label="More Options">
              <IconPlaceholder
                lucide="ChevronDownIcon"
                tabler="IconChevronDown"
                hugeicons="ArrowDown01Icon"
              />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <IconPlaceholder
                  lucide="MailCheckIcon"
                  tabler="IconMailCheck"
                  hugeicons="MailValidation01Icon"
                />
                Mark as Read
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconPlaceholder
                  lucide="ArchiveIcon"
                  tabler="IconArchive"
                  hugeicons="ArchiveIcon"
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
                />
                Snooze
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconPlaceholder
                  lucide="CalendarPlusIcon"
                  tabler="IconCalendarPlus"
                  hugeicons="CalendarAdd01Icon"
                />
                Add to Calendar
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconPlaceholder
                  lucide="ListFilterPlusIcon"
                  tabler="IconFilterPlus"
                  hugeicons="AddToListIcon"
                />
                Add to List
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <IconPlaceholder
                    lucide="TagIcon"
                    tabler="IconTag"
                    hugeicons="TagIcon"
                  />
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
                <IconPlaceholder
                  lucide="Trash2Icon"
                  tabler="IconTrash"
                  hugeicons="Delete02Icon"
                />
                Trash
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </ButtonGroup>
      <ButtonGroup>
        <Button variant="outline" size="icon-sm" aria-label="Previous">
          <IconPlaceholder
            lucide="ArrowLeftIcon"
            tabler="IconArrowLeft"
            hugeicons="ArrowLeft01Icon"
          />
        </Button>
        <Button variant="outline" size="icon-sm" aria-label="Next">
          <IconPlaceholder
            lucide="ArrowRightIcon"
            tabler="IconArrowRight"
            hugeicons="ArrowRight01Icon"
          />
        </Button>
      </ButtonGroup>
    </ButtonGroup>
  )
}

function ButtonGroupInputGroup() {
  const [voiceEnabled, setVoiceEnabled] = React.useState(false)

  return (
    <ButtonGroup className="w-full">
      <ButtonGroup>
        <Button variant="outline" size="icon" aria-label="Add">
          <IconPlaceholder
            lucide="PlusIcon"
            tabler="IconPlus"
            hugeicons="PlusSignIcon"
          />
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
                  <IconPlaceholder
                    lucide="AudioLinesIcon"
                    tabler="IconWaveSine"
                    hugeicons="AudioWave01Icon"
                  />
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

function ButtonGroupExample2() {
  return (
    <div className="flex gap-4">
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
      <ButtonGroup>
        <ButtonGroup>
          <Button variant="outline">Follow</Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="!pl-2">
                <IconPlaceholder
                  lucide="ChevronDownIcon"
                  tabler="IconChevronDown"
                  hugeicons="ArrowDown01Icon"
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuGroup>
                <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
                <DropdownMenuItem>
                  <IconPlaceholder
                    lucide="VolumeOffIcon"
                    tabler="IconVolume"
                    hugeicons="VolumeOffIcon"
                  />
                  Mute Conversation
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <IconPlaceholder
                    lucide="CheckIcon"
                    tabler="IconCheck"
                    hugeicons="Tick02Icon"
                  />
                  Mark as Read
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <IconPlaceholder
                    lucide="UserRoundXIcon"
                    tabler="IconUserX"
                    hugeicons="UserRemove01Icon"
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
                  />
                  Share Conversation
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <IconPlaceholder
                    lucide="CopyIcon"
                    tabler="IconCopy"
                    hugeicons="Copy01Icon"
                  />
                  Copy Conversation
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <IconPlaceholder
                    lucide="AlertTriangleIcon"
                    tabler="IconAlertTriangle"
                    hugeicons="AlertCircleIcon"
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
                  />
                  Delete Conversation
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </ButtonGroup>
        <ButtonGroup>
          <Button variant="outline" size="sm">
            <IconPlaceholder
              lucide="BotIcon"
              tabler="IconRobot"
              hugeicons="BotIcon"
            />{" "}
            Copilot
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="icon-sm"
                aria-label="Open Popover"
              >
                <IconPlaceholder
                  lucide="ChevronDownIcon"
                  tabler="IconChevronDown"
                  hugeicons="ArrowDown01Icon"
                />
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
                  Describe your task in natural language. Copilot will work in
                  the background and open a pull request for your review.
                </p>
              </div>
            </PopoverContent>
          </Popover>
        </ButtonGroup>
      </ButtonGroup>
    </div>
  )
}

function EmptyAvatarGroup() {
  return (
    <Empty className="flex-none border">
      <EmptyHeader>
        <EmptyMedia>
          <AvatarGroup className="grayscale">
            <Avatar size="lg">
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
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
            <AlertDialogContent size="sm">
              <AlertDialogHeader>
                <AlertDialogMedia>
                  <IconPlaceholder
                    lucide="BluetoothIcon"
                    tabler="IconBluetooth"
                    hugeicons="BluetoothIcon"
                  />
                </AlertDialogMedia>
                <AlertDialogTitle>Allow accessory to connect?</AlertDialogTitle>
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

function FieldExample() {
  return (
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
      </CardContent>
    </Card>
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
                {[
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
                ].map((option) => (
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
    <Field>
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
                <IconPlaceholder
                  lucide="InfoIcon"
                  tabler="IconInfoCircle"
                  hugeicons="AlertCircleIcon"
                />
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
            <IconPlaceholder
              lucide="StarIcon"
              tabler="IconStar"
              hugeicons="StarIcon"
              data-favorite={isFavorite}
              className="data-[favorite=true]:fill-primary data-[favorite=true]:stroke-primary"
            />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  )
}

function InputGroupExample() {
  return (
    <div className="grid w-full max-w-sm gap-6">
      <InputGroup>
        <InputGroupInput placeholder="Search..." />
        <InputGroupAddon>
          <IconPlaceholder
            lucide="SearchIcon"
            tabler="IconSearch"
            hugeicons="Search01Icon"
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
            <TooltipTrigger asChild>
              <InputGroupButton
                className="rounded-full"
                size="icon-xs"
                aria-label="Info"
              >
                <IconPlaceholder
                  lucide="InfoIcon"
                  tabler="IconInfoCircle"
                  hugeicons="AlertCircleIcon"
                />
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
            <IconPlaceholder
              lucide="PlusIcon"
              tabler="IconPlus"
              hugeicons="PlusSignIcon"
            />
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
            <IconPlaceholder
              lucide="ArrowUpIcon"
              tabler="IconArrowUp"
              hugeicons="ArrowUp01Icon"
            />
            <span className="sr-only">Send</span>
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupInput placeholder="@shadcn" />
        <InputGroupAddon align="inline-end">
          <div className="bg-primary text-foreground flex size-4 items-center justify-center rounded-full">
            <IconPlaceholder
              lucide="CheckIcon"
              tabler="IconCheck"
              hugeicons="Tick02Icon"
              className="size-3 text-white"
            />
          </div>
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}

function ItemExample() {
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
          <Button size="sm" variant="secondary">
            Enable
          </Button>
        </ItemActions>
      </Item>
      <Item variant="outline" size="sm" asChild>
        <a href="#">
          <ItemMedia>
            <IconPlaceholder
              lucide="ShoppingBagIcon"
              tabler="IconShoppingBag"
              hugeicons="ShoppingBasket01Icon"
              className="size-5"
            />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Your profile has been verified.</ItemTitle>
          </ItemContent>
          <ItemActions>
            <IconPlaceholder
              lucide="BicepsFlexed"
              tabler="IconAdCircleFilled"
              hugeicons="AbsoluteIcon"
              className="size-4"
            />
          </ItemActions>
        </a>
      </Item>
    </div>
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
      <Badge variant="link">
        <Spinner />
        Error
      </Badge>
    </div>
  )
}

function SpinnerEmpty() {
  return (
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
  )
}

const SHEET_SIDES = ["top", "right", "bottom", "left"] as const

function SheetExample() {
  return (
    <div className="flex gap-2">
      {SHEET_SIDES.map((side) => (
        <Sheet key={side}>
          <SheetTrigger asChild>
            <Button variant="secondary" className="flex-1 capitalize">
              {side}
            </Button>
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
              <h4 className="mb-4 text-lg leading-none font-medium">
                Lorem Ipsum
              </h4>
              {Array.from({ length: 10 }).map((_, index) => (
                <p key={index} className="mb-4 leading-normal">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                  irure dolor in reprehenderit in voluptate velit esse cillum
                  dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                  cupidatat non proident, sunt in culpa qui officia deserunt
                  mollit anim id est laborum.
                </p>
              ))}
            </div>
            <SheetFooter>
              <Button type="submit">Save changes</Button>
              <SheetClose asChild>
                <Button variant="outline">Cancel</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      ))}
    </div>
  )
}
