"use client"

import { ButtonGroup, ButtonGroupText } from "@/examples/base/ui/button-group"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/examples/base/ui/dropdown-menu"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/examples/base/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/examples/base/ui/input-group"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/examples/base/ui/popover"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/examples/base/ui/tooltip"
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
    <>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="input-tooltip-20">Tooltip</FieldLabel>
          <InputGroup>
            <InputGroupInput id="input-tooltip-20" />
            <InputGroupAddon align="inline-end">
              <Tooltip>
                <TooltipTrigger
                  render={
                    <InputGroupButton className="rounded-full" size="icon-xs" />
                  }
                >
                  <InfoIcon />
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
                <DropdownMenuTrigger
                  render={
                    <InputGroupButton className="text-muted-foreground tabular-nums" />
                  }
                >
                  {country} <ChevronDownIcon />
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
              <PopoverTrigger render={<InputGroupAddon />} nativeButton={false}>
                <InputGroupButton variant="secondary" size="icon-xs">
                  <InfoIcon />
                </InputGroupButton>
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
    </>
  )
}
