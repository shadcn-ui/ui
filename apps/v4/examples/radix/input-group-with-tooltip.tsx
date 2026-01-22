"use client"

import { Button } from "@/examples/radix/ui/button"
import { ButtonGroup, ButtonGroupText } from "@/examples/radix/ui/button-group"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/examples/radix/ui/dropdown-menu"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/examples/radix/ui/field"
import { Input } from "@/examples/radix/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/examples/radix/ui/input-group"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/examples/radix/ui/popover"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/examples/radix/ui/tooltip"
import { ChevronDownIcon, InfoIcon, StarIcon } from "lucide-react"
import { toast } from "sonner"

export function InputGroupWithTooltip({
  country,
  setCountry,
}: {
  country: string
  setCountry: (value: string) => void
}) {
  return (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="input-tooltip-20">Tooltip</FieldLabel>
        <InputGroup>
          <InputGroupInput id="input-tooltip-20" />
          <InputGroupAddon align="inline-end">
            <Tooltip>
              <TooltipTrigger asChild>
                <InputGroupButton className="rounded-full" size="icon-xs">
                  <InfoIcon />
                </InputGroupButton>
              </TooltipTrigger>
              <TooltipContent>This is content in a tooltip.</TooltipContent>
            </Tooltip>
          </InputGroupAddon>
        </InputGroup>
        <FieldDescription>
          This is a description of the input group.
        </FieldDescription>
      </Field>
      <Field>
        <FieldLabel htmlFor="input-dropdown-21">Dropdown</FieldLabel>
        <InputGroup>
          <InputGroupInput id="input-dropdown-21" />
          <InputGroupAddon>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <InputGroupButton className="text-muted-foreground tabular-nums">
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
        <FieldDescription>
          This is a description of the input group.
        </FieldDescription>
      </Field>
      <Field>
        <FieldLabel htmlFor="input-secure-19">Popover</FieldLabel>
        <InputGroup>
          <Popover>
            <PopoverTrigger asChild>
              <InputGroupAddon>
                <InputGroupButton variant="secondary" size="icon-xs">
                  <InfoIcon />
                </InputGroupButton>
              </InputGroupAddon>
            </PopoverTrigger>
            <PopoverContent align="start">
              <PopoverHeader>
                <PopoverTitle>Your connection is not secure.</PopoverTitle>
                <PopoverDescription>
                  You should not enter any sensitive information on this site.
                </PopoverDescription>
              </PopoverHeader>
            </PopoverContent>
          </Popover>
          <InputGroupAddon className="text-muted-foreground pl-1">
            https://
          </InputGroupAddon>
          <InputGroupInput id="input-secure-19" />
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              size="icon-xs"
              onClick={() => toast("Added to favorites")}
            >
              <StarIcon />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
        <FieldDescription>
          This is a description of the input group.
        </FieldDescription>
      </Field>
      <Field>
        <FieldLabel htmlFor="url">Button Group</FieldLabel>
        <ButtonGroup>
          <ButtonGroupText>https://</ButtonGroupText>
          <InputGroup>
            <InputGroupInput id="url" />
            <InputGroupAddon align="inline-end">
              <InfoIcon />
            </InputGroupAddon>
          </InputGroup>
          <ButtonGroupText>.com</ButtonGroupText>
        </ButtonGroup>
        <FieldDescription>
          This is a description of the input group.
        </FieldDescription>
      </Field>
    </FieldGroup>
  )
}
