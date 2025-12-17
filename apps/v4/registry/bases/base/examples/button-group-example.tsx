"use client"

import {
  Example,
  ExampleWrapper,
} from "@/registry/bases/base/components/example"
import { Button } from "@/registry/bases/base/ui/button"
import {
  ButtonGroup,
  ButtonGroupText,
} from "@/registry/bases/base/ui/button-group"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/registry/bases/base/ui/dropdown-menu"
import { Field, FieldGroup } from "@/registry/bases/base/ui/field"
import { Input } from "@/registry/bases/base/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/registry/bases/base/ui/input-group"
import { Label } from "@/registry/bases/base/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/bases/base/ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/registry/bases/base/ui/tooltip"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function ButtonGroupExample() {
  return (
    <ExampleWrapper>
      <ButtonGroupBasic />
      <ButtonGroupWithInput />
      <ButtonGroupWithText />
      <ButtonGroupWithDropdown />
      <ButtonGroupWithSelect />
      <ButtonGroupWithIcons />
      <ButtonGroupWithInputGroup />
      <ButtonGroupWithFields />
      <ButtonGroupWithLike />
      <ButtonGroupWithSelectAndInput />
      <ButtonGroupNested />
      <ButtonGroupPagination />
      <ButtonGroupPaginationSplit />
      <ButtonGroupNavigation />
      <ButtonGroupTextAlignment />
      <ButtonGroupVertical />
      <ButtonGroupVerticalNested />
    </ExampleWrapper>
  )
}

function ButtonGroupBasic() {
  return (
    <Example title="Basic">
      <div className="flex flex-col gap-4">
        <ButtonGroup>
          <Button variant="outline">Button</Button>
          <Button variant="outline">Another Button</Button>
        </ButtonGroup>
      </div>
    </Example>
  )
}

function ButtonGroupWithInput() {
  return (
    <Example title="With Input">
      <div className="flex flex-col gap-4">
        <ButtonGroup>
          <Button variant="outline">Button</Button>
          <Input placeholder="Type something here..." />
        </ButtonGroup>
        <ButtonGroup>
          <Input placeholder="Type something here..." />
          <Button variant="outline">Button</Button>
        </ButtonGroup>
      </div>
    </Example>
  )
}

function ButtonGroupWithText() {
  return (
    <Example title="With Text">
      <div className="flex flex-col gap-4">
        <ButtonGroup>
          <ButtonGroupText>Text</ButtonGroupText>
          <Button variant="outline">Another Button</Button>
        </ButtonGroup>
        <ButtonGroup>
          <ButtonGroupText render={<Label htmlFor="input-text" />}>
            GPU Size
          </ButtonGroupText>
          <Input id="input-text" placeholder="Type something here..." />
        </ButtonGroup>
      </div>
    </Example>
  )
}

function ButtonGroupWithDropdown() {
  return (
    <Example title="With Dropdown">
      <div className="flex flex-col gap-4">
        <ButtonGroup>
          <Button variant="outline">Update</Button>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={<Button variant="outline" size="icon" />}
            >
              <IconPlaceholder
                lucide="ChevronDownIcon"
                tabler="IconChevronDown"
                hugeicons="ArrowDown01Icon"
                phosphor="CaretDownIcon"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Disable</DropdownMenuItem>
              <DropdownMenuItem variant="destructive">
                Uninstall
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </ButtonGroup>
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
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-50">
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <IconPlaceholder
                    lucide="VolumeX"
                    tabler="IconVolume"
                    hugeicons="VolumeOffIcon"
                    phosphor="SpeakerSlashIcon"
                  />
                  Mute Conversation
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <IconPlaceholder
                    lucide="CheckIcon"
                    tabler="IconCheck"
                    hugeicons="Tick02Icon"
                    phosphor="CheckIcon"
                  />
                  Mark as Read
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <IconPlaceholder
                    lucide="AlertTriangleIcon"
                    tabler="IconAlertTriangle"
                    hugeicons="AlertCircleIcon"
                    phosphor="WarningIcon"
                  />
                  Report Conversation
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <IconPlaceholder
                    lucide="UserRoundXIcon"
                    tabler="IconUserX"
                    hugeicons="UserRemove01Icon"
                    phosphor="UserMinusIcon"
                  />
                  Block User
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <IconPlaceholder
                    lucide="ShareIcon"
                    tabler="IconShare"
                    hugeicons="Share03Icon"
                    phosphor="ShareIcon"
                  />
                  Share Conversation
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <IconPlaceholder
                    lucide="CopyIcon"
                    tabler="IconCopy"
                    hugeicons="Copy01Icon"
                    phosphor="CopyIcon"
                  />
                  Copy Conversation
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
                  />
                  Delete Conversation
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </ButtonGroup>
      </div>
    </Example>
  )
}

const currencyItems = [
  { label: "$", value: "$" },
  { label: "€", value: "€" },
  { label: "£", value: "£" },
]

function ButtonGroupWithSelect() {
  return (
    <Example title="With Select">
      <Field>
        <Label htmlFor="amount">Amount</Label>
        <ButtonGroup>
          <Select items={currencyItems} defaultValue={currencyItems[0]}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {currencyItems.map((item) => (
                  <SelectItem key={item.value} value={item}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Input placeholder="Enter amount to send" />
          <Button variant="outline">
            <IconPlaceholder
              lucide="ArrowRightIcon"
              tabler="IconArrowRight"
              hugeicons="ArrowRight01Icon"
              phosphor="ArrowRightIcon"
            />
          </Button>
        </ButtonGroup>
      </Field>
    </Example>
  )
}

function ButtonGroupWithIcons() {
  return (
    <Example title="With Icons">
      <div className="flex flex-col gap-4">
        <ButtonGroup>
          <Button variant="outline">
            <IconPlaceholder
              lucide="FlipHorizontalIcon"
              tabler="IconFlipHorizontal"
              hugeicons="FlipHorizontalIcon"
              phosphor="ArrowsHorizontalIcon"
            />
          </Button>
          <Button variant="outline">
            <IconPlaceholder
              lucide="FlipVerticalIcon"
              tabler="IconFlipVertical"
              hugeicons="FlipVerticalIcon"
              phosphor="ArrowsVerticalIcon"
            />
          </Button>
          <Button variant="outline">
            <IconPlaceholder
              lucide="RotateCwIcon"
              tabler="IconRotateClockwise2"
              hugeicons="Rotate01Icon"
              phosphor="ArrowClockwiseIcon"
            />
          </Button>
        </ButtonGroup>
      </div>
    </Example>
  )
}

function ButtonGroupWithInputGroup() {
  return (
    <Example title="With Input Group">
      <div className="flex flex-col gap-4">
        <InputGroup>
          <InputGroupInput placeholder="Type to search..." />
          <InputGroupAddon
            align="inline-start"
            className="text-muted-foreground"
          >
            <IconPlaceholder
              lucide="SearchIcon"
              tabler="IconSearch"
              hugeicons="Search01Icon"
              phosphor="MagnifyingGlassIcon"
            />
          </InputGroupAddon>
        </InputGroup>
      </div>
    </Example>
  )
}

function ButtonGroupWithFields() {
  return (
    <Example title="With Fields">
      <FieldGroup className="grid grid-cols-3 gap-4">
        <Field className="col-span-2">
          <Label htmlFor="width">Width</Label>
          <ButtonGroup>
            <InputGroup>
              <InputGroupInput id="width" />
              <InputGroupAddon className="text-muted-foreground">
                W
              </InputGroupAddon>
              <InputGroupAddon
                align="inline-end"
                className="text-muted-foreground"
              >
                px
              </InputGroupAddon>
            </InputGroup>
            <Button variant="outline" size="icon">
              <IconPlaceholder
                lucide="MinusIcon"
                tabler="IconMinus"
                hugeicons="MinusSignIcon"
                phosphor="MinusIcon"
              />
            </Button>
            <Button variant="outline" size="icon">
              <IconPlaceholder
                lucide="PlusIcon"
                tabler="IconPlus"
                hugeicons="PlusSignIcon"
                phosphor="PlusIcon"
              />
            </Button>
          </ButtonGroup>
        </Field>
      </FieldGroup>
    </Example>
  )
}

function ButtonGroupWithLike() {
  return (
    <Example title="With Like">
      <ButtonGroup>
        <Button variant="outline">
          <IconPlaceholder
            lucide="HeartIcon"
            tabler="IconBell"
            hugeicons="Notification02Icon"
            phosphor="HeartIcon"
            data-icon="inline-start"
          />{" "}
          Like
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="w-12"
          render={<span />}
          nativeButton={false}
        >
          1.2K
        </Button>
      </ButtonGroup>
    </Example>
  )
}

const durationItems = [
  { label: "Hours", value: "hours" },
  { label: "Days", value: "days" },
  { label: "Weeks", value: "weeks" },
]

function ButtonGroupWithSelectAndInput() {
  return (
    <Example title="With Select and Input">
      <ButtonGroup>
        <Select items={durationItems} defaultValue={durationItems[0]}>
          <SelectTrigger id="duration">
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="start">
            <SelectGroup>
              {durationItems.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Input />
      </ButtonGroup>
    </Example>
  )
}

function ButtonGroupNested() {
  return (
    <Example title="Nested">
      <ButtonGroup>
        <ButtonGroup>
          <Button variant="outline" size="icon">
            <IconPlaceholder
              lucide="PlusIcon"
              tabler="IconPlus"
              hugeicons="PlusSignIcon"
              phosphor="PlusIcon"
            />
          </Button>
        </ButtonGroup>
        <ButtonGroup>
          <InputGroup>
            <InputGroupInput placeholder="Send a message..." />
            <Tooltip>
              <TooltipTrigger render={<InputGroupAddon align="inline-end" />}>
                <IconPlaceholder
                  lucide="AudioLinesIcon"
                  tabler="IconHeadphones"
                  hugeicons="AudioWave01Icon"
                  phosphor="MicrophoneIcon"
                />
              </TooltipTrigger>
              <TooltipContent>Voice Mode</TooltipContent>
            </Tooltip>
          </InputGroup>
        </ButtonGroup>
      </ButtonGroup>
    </Example>
  )
}

function ButtonGroupPagination() {
  return (
    <Example title="Pagination">
      <ButtonGroup>
        <Button variant="outline" size="sm">
          <IconPlaceholder
            lucide="ArrowLeftIcon"
            tabler="IconArrowLeft"
            hugeicons="ArrowLeft02Icon"
            phosphor="ArrowLeftIcon"
            data-icon="inline-start"
          />
          Previous
        </Button>
        <Button variant="outline" size="sm">
          1
        </Button>
        <Button variant="outline" size="sm">
          2
        </Button>
        <Button variant="outline" size="sm">
          3
        </Button>
        <Button variant="outline" size="sm">
          4
        </Button>
        <Button variant="outline" size="sm">
          5
        </Button>
        <Button variant="outline" size="sm">
          Next
          <IconPlaceholder
            lucide="ArrowRightIcon"
            tabler="IconArrowRight"
            hugeicons="ArrowRight02Icon"
            phosphor="ArrowRightIcon"
            data-icon="inline-end"
          />
        </Button>
      </ButtonGroup>
    </Example>
  )
}

function ButtonGroupPaginationSplit() {
  return (
    <Example title="Pagination Split">
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
          <Button variant="outline" size="sm">
            4
          </Button>
          <Button variant="outline" size="sm">
            5
          </Button>
        </ButtonGroup>
        <ButtonGroup>
          <Button variant="outline" size="icon-xs">
            <IconPlaceholder
              lucide="ArrowLeftIcon"
              tabler="IconArrowLeft"
              hugeicons="ArrowLeft01Icon"
              phosphor="ArrowLeftIcon"
            />
          </Button>
          <Button variant="outline" size="icon-xs">
            <IconPlaceholder
              lucide="ArrowRightIcon"
              tabler="IconArrowRight"
              hugeicons="ArrowRight01Icon"
              phosphor="ArrowRightIcon"
            />
          </Button>
        </ButtonGroup>
      </ButtonGroup>
    </Example>
  )
}

function ButtonGroupNavigation() {
  return (
    <Example title="Navigation">
      <ButtonGroup>
        <ButtonGroup>
          <Button variant="outline">
            <IconPlaceholder
              lucide="ArrowLeftIcon"
              tabler="IconArrowLeft"
              hugeicons="ArrowLeft01Icon"
              phosphor="ArrowLeftIcon"
            />
          </Button>
          <Button variant="outline">
            <IconPlaceholder
              lucide="ArrowRightIcon"
              tabler="IconArrowRight"
              hugeicons="ArrowRight01Icon"
              phosphor="ArrowRightIcon"
            />
          </Button>
        </ButtonGroup>
        <ButtonGroup aria-label="Single navigation button">
          <Button variant="outline" size="icon">
            <IconPlaceholder
              lucide="ArrowLeftIcon"
              tabler="IconArrowLeft"
              hugeicons="ArrowLeft01Icon"
              phosphor="ArrowLeftIcon"
            />
          </Button>
        </ButtonGroup>
      </ButtonGroup>
    </Example>
  )
}

function ButtonGroupTextAlignment() {
  return (
    <Example title="Text Alignment">
      <Field>
        <Label id="alignment-label">Text Alignment</Label>
        <ButtonGroup aria-labelledby="alignment-label">
          <Button variant="outline" size="sm">
            Left
          </Button>
          <Button variant="outline" size="sm">
            Center
          </Button>
          <Button variant="outline" size="sm">
            Right
          </Button>
          <Button variant="outline" size="sm">
            Justify
          </Button>
        </ButtonGroup>
      </Field>
    </Example>
  )
}

function ButtonGroupVertical() {
  return (
    <Example title="Vertical">
      <div className="flex gap-6">
        <ButtonGroup
          orientation="vertical"
          aria-label="Media controls"
          className="h-fit"
        >
          <Button variant="outline" size="icon">
            <IconPlaceholder
              lucide="PlusIcon"
              tabler="IconPlus"
              hugeicons="PlusSignIcon"
              phosphor="PlusIcon"
            />
          </Button>
          <Button variant="outline" size="icon">
            <IconPlaceholder
              lucide="MinusIcon"
              tabler="IconMinus"
              hugeicons="MinusSignIcon"
              phosphor="MinusIcon"
            />
          </Button>
        </ButtonGroup>
      </div>
    </Example>
  )
}

function ButtonGroupVerticalNested() {
  return (
    <Example title="Vertical Nested">
      <ButtonGroup orientation="vertical" aria-label="Design tools palette">
        <ButtonGroup orientation="vertical">
          <Button variant="outline" size="icon">
            <IconPlaceholder
              lucide="SearchIcon"
              tabler="IconSearch"
              hugeicons="Search01Icon"
              phosphor="MagnifyingGlassIcon"
            />
          </Button>
          <Button variant="outline" size="icon">
            <IconPlaceholder
              lucide="CopyIcon"
              tabler="IconCopy"
              hugeicons="Copy01Icon"
              phosphor="CopyIcon"
            />
          </Button>
          <Button variant="outline" size="icon">
            <IconPlaceholder
              lucide="ShareIcon"
              tabler="IconShare"
              hugeicons="Share03Icon"
              phosphor="ShareIcon"
            />
          </Button>
        </ButtonGroup>
        <ButtonGroup orientation="vertical">
          <Button variant="outline" size="icon">
            <IconPlaceholder
              lucide="FlipHorizontalIcon"
              tabler="IconFlipHorizontal"
              hugeicons="FlipHorizontalIcon"
              phosphor="ArrowsHorizontalIcon"
            />
          </Button>
          <Button variant="outline" size="icon">
            <IconPlaceholder
              lucide="FlipVerticalIcon"
              tabler="IconFlipVertical"
              hugeicons="FlipVerticalIcon"
              phosphor="ArrowsVerticalIcon"
            />
          </Button>
          <Button variant="outline" size="icon">
            <IconPlaceholder
              lucide="RotateCwIcon"
              tabler="IconRotateClockwise2"
              hugeicons="Rotate01Icon"
              phosphor="ArrowClockwiseIcon"
            />
          </Button>
        </ButtonGroup>
        <ButtonGroup>
          <Button variant="outline" size="icon">
            <IconPlaceholder
              lucide="TrashIcon"
              tabler="IconTrash"
              hugeicons="Delete02Icon"
              phosphor="TrashIcon"
            />
          </Button>
        </ButtonGroup>
      </ButtonGroup>
    </Example>
  )
}
