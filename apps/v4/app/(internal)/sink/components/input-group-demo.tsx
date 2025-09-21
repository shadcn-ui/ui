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
import { toast } from "sonner"

import {
  ButtonGroup,
  ButtonGroupText,
} from "@/registry/new-york-v4/ui/button-group"
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/new-york-v4/ui/popover"
import { Spinner } from "@/registry/new-york-v4/ui/spinner"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/registry/new-york-v4/ui/tooltip"

export function InputGroupDemo() {
  const [country, setCountry] = useState("+1")

  return (
    <div className="flex w-full flex-wrap gap-12 pb-72 *:[div]:w-full *:[div]:max-w-sm">
      <div className="flex flex-col gap-10">
        <Field>
          <FieldLabel htmlFor="input-default-01">
            Default (No Input Group)
          </FieldLabel>
          <Input placeholder="Default" id="input-default-01" />
        </Field>
        <Field>
          <FieldLabel htmlFor="input-group-02">Input Group</FieldLabel>
          <InputGroup>
            <Input id="input-group-02" placeholder="Default" />
          </InputGroup>
        </Field>
        <Field data-disabled="true">
          <FieldLabel htmlFor="input-disabled-03">Disabled</FieldLabel>
          <InputGroup>
            <Input
              id="input-disabled-03"
              placeholder="This field is disabled"
              disabled
            />
          </InputGroup>
        </Field>
        <Field data-invalid="true">
          <FieldLabel htmlFor="input-invalid-04">Invalid</FieldLabel>
          <InputGroup>
            <Input
              id="input-invalid-04"
              placeholder="This field is invalid"
              aria-invalid="true"
            />
          </InputGroup>
        </Field>
      </div>
      <div className="flex flex-col gap-10">
        <Field>
          <FieldLabel htmlFor="input-icon-left-05">Icon (left)</FieldLabel>
          <InputGroup>
            <Input id="input-icon-left-05" />
            <InputGroupAddon>
              <SearchIcon className="text-muted-foreground" />
            </InputGroupAddon>
          </InputGroup>
          <InputGroup>
            <Input id="input-icon-left-06" />
            <InputGroupAddon>
              <FlipVerticalIcon className="text-muted-foreground" />
            </InputGroupAddon>
          </InputGroup>
        </Field>
        <Field>
          <FieldLabel htmlFor="input-icon-right-07">Icon (right)</FieldLabel>
          <InputGroup>
            <Input id="input-icon-right-07" />
            <InputGroupAddon align="end">
              <EyeClosedIcon />
            </InputGroupAddon>
          </InputGroup>
          <InputGroup>
            <Input id="input-icon-right-08" />
            <InputGroupAddon align="end">
              <IconLoader2 className="text-muted-foreground animate-spin" />
            </InputGroupAddon>
          </InputGroup>
        </Field>
        <Field>
          <FieldLabel htmlFor="input-icon-both-09">Icon (both)</FieldLabel>
          <InputGroup>
            <Input id="input-icon-both-09" />
            <InputGroupAddon>
              <IconMicrophone className="text-muted-foreground" />
            </InputGroupAddon>
            <InputGroupAddon align="end">
              <IconPlayerRecordFilled className="animate-pulse text-red-500" />
            </InputGroupAddon>
          </InputGroup>
        </Field>
        <Field>
          <FieldLabel htmlFor="input-icon-both-10">Multiple Icons</FieldLabel>
          <InputGroup>
            <Input id="input-icon-both-10" />
            <InputGroupAddon align="end">
              <IconStar />
              <InputGroupButton
                onClick={() => toast.success("Copied to clipboard")}
              >
                <IconCopy />
              </InputGroupButton>
            </InputGroupAddon>
            <InputGroupAddon>
              <IconPlayerRecordFilled className="animate-pulse text-red-500" />
            </InputGroupAddon>
          </InputGroup>
        </Field>
      </div>
      <div className="flex flex-col gap-10">
        <Field>
          <FieldLabel htmlFor="input-label-10">Label</FieldLabel>
          <InputGroup>
            <InputGroupAddon>
              <FieldLabel htmlFor="input-label-10">Label</FieldLabel>
            </InputGroupAddon>
            <Input id="input-label-10" />
          </InputGroup>
          <InputGroup className="gap-0">
            <InputGroupAddon>
              <FieldLabel
                htmlFor="input-prefix-11"
                className="text-muted-foreground"
              >
                example.com/
              </FieldLabel>
            </InputGroupAddon>
            <Input id="input-prefix-11" />
          </InputGroup>
          <InputGroup>
            <Input id="input-optional-12" />
            <InputGroupAddon align="end" className="text-muted-foreground">
              (optional)
            </InputGroupAddon>
          </InputGroup>
        </Field>

        <Field>
          <InputGroup>
            <Input id="input-button-13" />
            <InputGroupAddon>
              <InputGroupButton size="default">Button</InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
          <InputGroup>
            <Input id="input-button-14" />
            <InputGroupAddon>
              <InputGroupButton variant="outline" size="default">
                Button
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
          <InputGroup>
            <Input id="input-button-15" />
            <InputGroupAddon>
              <InputGroupButton variant="secondary" size="default">
                Button
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
          <InputGroup>
            <Input id="input-button-16" />
            <InputGroupAddon align="end">
              <InputGroupButton variant="secondary" size="default">
                Button
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
          <InputGroup>
            <Input id="input-button-17" />
            <InputGroupAddon align="end">
              <InputGroupButton>
                <IconCopy />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
          <InputGroup>
            <Input id="input-button-18" />
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
            <Input id="input-secure-19" />
            <InputGroupAddon align="end">
              <InputGroupButton
                onClick={() => toast.success("Added to favorites")}
              >
                <IconStar />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </Field>
      </div>
      <div className="flex flex-col gap-10 p-4">
        <Field>
          <FieldLabel htmlFor="input-tooltip-20">Tooltip</FieldLabel>
          <InputGroup>
            <Input id="input-tooltip-20" />
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
          <FieldLabel htmlFor="input-dropdown-21">Dropdown</FieldLabel>
          <InputGroup className="gap-1">
            <Input id="input-dropdown-21" />
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
          <FieldLabel htmlFor="input-kbd-22">Input Group with Kbd</FieldLabel>
          <InputGroup>
            <Input id="input-kbd-22" />
            <InputGroupAddon>
              <Kbd>⌘K</Kbd>
            </InputGroupAddon>
          </InputGroup>
          <InputGroup>
            <Input id="input-kbd-23" />
            <InputGroupAddon align="end">
              <Kbd>⌘K</Kbd>
            </InputGroupAddon>
          </InputGroup>
          <InputGroup>
            <Input id="input-search-apps-24" placeholder="Search for Apps..." />
            <InputGroupAddon align="end">Ask AI</InputGroupAddon>
            <InputGroupAddon align="end">
              <Kbd>Tab</Kbd>
            </InputGroupAddon>
          </InputGroup>
          <InputGroup>
            <Input id="input-search-type-25" placeholder="Type to search..." />
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
      </div>
      <div className="flex flex-col gap-10">
        <Field>
          <FieldLabel htmlFor="input-username-26">Username</FieldLabel>
          <InputGroup>
            <Input id="input-username-26" defaultValue="shadcn" />
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
          <Input
            id="input-search-docs-27"
            placeholder="Search documentation..."
          />
          <InputGroupAddon>
            <IconSearch />
          </InputGroupAddon>
          <InputGroupAddon align="end">12 results</InputGroupAddon>
        </InputGroup>

        <InputGroup data-disabled="true">
          <Input
            id="input-search-disabled-28"
            placeholder="Search documentation..."
            disabled
          />
          <InputGroupAddon>
            <IconSearch />
          </InputGroupAddon>
          <InputGroupAddon align="end">Disabled</InputGroupAddon>
        </InputGroup>

        <Field>
          <FieldLabel htmlFor="url">With Button Group</FieldLabel>
          <ButtonGroup>
            <ButtonGroupText>https://</ButtonGroupText>
            <InputGroup>
              <Input id="url" />
              <InputGroupAddon align="end">
                <IconInfoCircle />
              </InputGroupAddon>
            </InputGroup>
            <ButtonGroupText>.com</ButtonGroupText>
          </ButtonGroup>
          <FieldDescription>
            This is a description of the input group.
          </FieldDescription>
        </Field>

        <Field data-disabled="true">
          <FieldLabel htmlFor="input-group-29">Loading</FieldLabel>
          <FieldDescription>
            This is a description of the input group.
          </FieldDescription>
          <InputGroup>
            <Input id="input-group-29" disabled defaultValue="shadcn" />
            <InputGroupAddon align="end">
              <Spinner />
            </InputGroupAddon>
          </InputGroup>
        </Field>
      </div>
    </div>
  )
}
