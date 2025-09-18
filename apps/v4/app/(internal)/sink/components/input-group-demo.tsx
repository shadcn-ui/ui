"use client"

import { useState } from "react"
import {
  IconCheck,
  IconCopy,
  IconInfoCircle,
  IconLoader2,
  IconMicrophone,
  IconPlayerRecordFilled,
  IconSearch,
  IconServerSpark,
  IconStar,
  IconTrash,
} from "@tabler/icons-react"
import {
  ChevronDownIcon,
  EyeClosedIcon,
  FlipVerticalIcon,
  SearchIcon,
} from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/registry/new-york-v4/ui/dropdown-menu"
import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@/registry/new-york-v4/ui/field"
import { Input } from "@/registry/new-york-v4/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
} from "@/registry/new-york-v4/ui/input-group"
import { Kbd, KbdGroup } from "@/registry/new-york-v4/ui/kbd"
import { Label } from "@/registry/new-york-v4/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/new-york-v4/ui/popover"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/registry/new-york-v4/ui/tooltip"

export function InputGroupDemo() {
  const [country, setCountry] = useState("+1")

  return (
    <div className="flex max-w-xs flex-col gap-6 pb-72">
      <Field>
        <Label htmlFor="input-default-xikl">Default</Label>
        <Input placeholder="Default" id="input-default-xikl" />
      </Field>

      <Field>
        <Label htmlFor="input-default-xkcd">Input Group</Label>
        <InputGroup>
          <Input id="input-default-xkcd" placeholder="Default" />
        </InputGroup>
      </Field>

      <Field data-disabled="true">
        <Label htmlFor="input-default-x2cd">Disabled</Label>
        <InputGroup>
          <Input
            id="input-default-x2cd"
            placeholder="This field is disabled"
            disabled
          />
        </InputGroup>
      </Field>

      <Field data-invalid="true">
        <Label htmlFor="input-default-x3cd">Invalid</Label>
        <InputGroup>
          <Input
            id="input-default-x3cd"
            placeholder="This field is invalid"
            aria-invalid="true"
          />
        </InputGroup>
      </Field>

      <Field>
        <Label htmlFor="input-icon-search-qwer">Icon (left)</Label>
        <InputGroup>
          <Input id="input-icon-search-qwer" />
          <InputGroupAddon>
            <SearchIcon className="text-muted-foreground" />
          </InputGroupAddon>
        </InputGroup>
        <InputGroup>
          <Input id="input-icon-flip-asdf" />
          <InputGroupAddon>
            <FlipVerticalIcon className="text-muted-foreground" />
          </InputGroupAddon>
        </InputGroup>
      </Field>

      <Field>
        <Label htmlFor="input-icon-after-zxcv">Icon (right)</Label>
        <InputGroup>
          <Input id="input-icon-after-zxcv" />
          <InputGroupAddon align="end">
            <EyeClosedIcon />
          </InputGroupAddon>
        </InputGroup>
        <InputGroup>
          <Input id="input-icon-after-zc3v" />
          <InputGroupAddon align="end">
            <IconLoader2 className="text-muted-foreground animate-spin" />
          </InputGroupAddon>
        </InputGroup>
      </Field>

      <Field>
        <Label htmlFor="input-icon-after-zxcv">Icon (both)</Label>
        <InputGroup>
          <Input id="input-icon-after-zxcv" />
          <InputGroupAddon>
            <IconMicrophone className="text-muted-foreground" />
          </InputGroupAddon>
          <InputGroupAddon align="end">
            <IconPlayerRecordFilled className="animate-pulse text-red-500" />
          </InputGroupAddon>
        </InputGroup>
      </Field>

      <Field>
        <Label htmlFor="input-label-poiu">Label</Label>
        <InputGroup>
          <InputGroupAddon>
            <Label htmlFor="input-label-poiu">Label</Label>
          </InputGroupAddon>
          <Input id="input-label-poiu" />
        </InputGroup>
        <InputGroup className="gap-0">
          <InputGroupAddon>
            <Label
              htmlFor="input-prefix-lkjh"
              className="text-muted-foreground"
            >
              example.com/
            </Label>
          </InputGroupAddon>
          <Input id="input-prefix-lkjh" />
        </InputGroup>
        <InputGroup>
          <Input id="input-prefix-lkjh" />
          <InputGroupAddon align="end" className="text-muted-foreground">
            (optional)
          </InputGroupAddon>
        </InputGroup>
      </Field>

      <Field>
        <InputGroup>
          <Input id="input-button-hjkl" />
          <InputGroupAddon>
            <InputGroupButton size="default">Button</InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
        <InputGroup>
          <Input id="input-button-hj12" />
          <InputGroupAddon>
            <InputGroupButton variant="outline" size="default">
              Button
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
        <InputGroup>
          <Input id="input-button-hj13" />
          <InputGroupAddon>
            <InputGroupButton variant="secondary" size="default">
              Button
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
        <InputGroup>
          <Input id="input-button-hj14" />
          <InputGroupAddon align="end">
            <InputGroupButton variant="secondary" size="default">
              Button
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
        <InputGroup>
          <Input id="input-button-hj15" />
          <InputGroupAddon align="end">
            <InputGroupButton>
              <IconCopy />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
        <InputGroup>
          <Input id="input-button-hj16" />
          <InputGroupAddon align="end">
            <InputGroupButton variant="secondary">
              <IconTrash />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
        <InputGroup className="[--radius:9999px]">
          <Popover>
            <PopoverTrigger asChild>
              <InputGroupAddon>
                <InputGroupButton variant="secondary">
                  <IconInfoCircle />
                </InputGroupButton>
              </InputGroupAddon>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              className="flex flex-col gap-1 rounded-xl text-sm"
            >
              <p className="font-medium">Your connection is not secure.</p>
              <p>
                You should not enter any sensitive information on this site.
              </p>
            </PopoverContent>
          </Popover>
          <InputGroupAddon className="text-muted-foreground">
            https://
          </InputGroupAddon>
          <Input id="input-button-hj16" />
          <InputGroupAddon align="end">
            <InputGroupButton>
              <IconStar />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </Field>

      <Field>
        <Label htmlFor="input-button-hj17">Tooltip</Label>
        <InputGroup>
          <Input id="input-button-hj17" />
          <InputGroupAddon align="end">
            <Tooltip>
              <TooltipTrigger asChild>
                <InputGroupButton className="rounded-full">
                  <IconInfoCircle />
                </InputGroupButton>
              </TooltipTrigger>
              <TooltipContent>This is content in a tooltip.</TooltipContent>
            </Tooltip>
          </InputGroupAddon>
        </InputGroup>
      </Field>

      <Field>
        <Label htmlFor="input-button-hj18">Dropdown</Label>
        <InputGroup className="gap-1">
          <Input id="input-button-hj18" />
          <InputGroupAddon>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <InputGroupButton
                  size="default"
                  className="text-muted-foreground tabular-nums"
                >
                  {country} <ChevronDownIcon />
                </InputGroupButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="min-w-16"
                sideOffset={10}
                alignOffset={-8}
              >
                <DropdownMenuItem onClick={() => setCountry("+1")}>
                  +1
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setCountry("+44")}>
                  +44
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setCountry("+46")}>
                  +46
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </InputGroupAddon>
        </InputGroup>
      </Field>

      <Field>
        <Label htmlFor="input-button-hj19">Input Group with Kbd</Label>
        <InputGroup>
          <Input id="input-button-hj19" />
          <InputGroupAddon>
            <Kbd>⌘K</Kbd>
          </InputGroupAddon>
        </InputGroup>
        <InputGroup>
          <Input id="input-button-hj29" />
          <InputGroupAddon align="end">
            <Kbd>⌘K</Kbd>
          </InputGroupAddon>
        </InputGroup>
        <InputGroup>
          <Input id="input-button-hj39" placeholder="Search for Apps..." />
          <InputGroupAddon align="end">Ask AI</InputGroupAddon>
          <InputGroupAddon align="end">
            <Kbd>Tab</Kbd>
          </InputGroupAddon>
        </InputGroup>
        <InputGroup>
          <Input id="input-button-hj49" placeholder="Type to search..." />
          <InputGroupAddon align="start">
            <IconServerSpark />
          </InputGroupAddon>
          <InputGroupAddon align="end">
            <KbdGroup>
              <Kbd>Ctrl</Kbd>
              <Kbd>C</Kbd>
            </KbdGroup>
          </InputGroupAddon>
        </InputGroup>
      </Field>

      <Field>
        <FieldLabel htmlFor="username">Username</FieldLabel>
        <InputGroup>
          <Input id="username" defaultValue="shadcn" />
          <InputGroupAddon align="end">
            <div className="flex size-4 items-center justify-center rounded-full bg-green-500 dark:bg-green-800">
              <IconCheck className="size-3 text-white" />
            </div>
          </InputGroupAddon>
        </InputGroup>
        <FieldDescription className="text-green-700">
          This username is available.
        </FieldDescription>
      </Field>

      <InputGroup>
        <Input id="keywords" placeholder="Search documentation..." />
        <InputGroupAddon>
          <IconSearch />
        </InputGroupAddon>
        <InputGroupAddon align="end">12 results</InputGroupAddon>
      </InputGroup>

      <InputGroup data-disabled="true">
        <Input id="keywords" placeholder="Search documentation..." disabled />
        <InputGroupAddon>
          <IconSearch />
        </InputGroupAddon>
        <InputGroupAddon align="end">Disabled</InputGroupAddon>
      </InputGroup>
    </div>
  )
}
