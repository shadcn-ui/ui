"use client"

import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/examples/radix/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from "@/examples/radix/ui/input-group"
import {
  CopyIcon,
  EyeOffIcon,
  InfoIcon,
  MicIcon,
  RadioIcon,
  SearchIcon,
  StarIcon,
} from "lucide-react"
import { toast } from "sonner"

export function InputGroupWithAddons() {
  return (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="input-icon-left-05">
          Addon (inline-start)
        </FieldLabel>
        <InputGroup>
          <InputGroupInput id="input-icon-left-05" />
          <InputGroupAddon>
            <SearchIcon className="text-muted-foreground" />
          </InputGroupAddon>
        </InputGroup>
      </Field>
      <Field>
        <FieldLabel htmlFor="input-icon-right-07">
          Addon (inline-end)
        </FieldLabel>
        <InputGroup>
          <InputGroupInput id="input-icon-right-07" />
          <InputGroupAddon align="inline-end">
            <EyeOffIcon />
          </InputGroupAddon>
        </InputGroup>
      </Field>
      <Field>
        <FieldLabel htmlFor="input-icon-both-09">
          Addon (inline-start and inline-end)
        </FieldLabel>
        <InputGroup>
          <InputGroupInput id="input-icon-both-09" />
          <InputGroupAddon>
            <MicIcon className="text-muted-foreground" />
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">
            <RadioIcon className="animate-pulse text-red-500" />
          </InputGroupAddon>
        </InputGroup>
      </Field>
      <Field>
        <FieldLabel htmlFor="input-addon-20">Addon (block-start)</FieldLabel>
        <InputGroup className="h-auto">
          <InputGroupInput id="input-addon-20" />
          <InputGroupAddon align="block-start">
            <InputGroupText>First Name</InputGroupText>
            <InfoIcon className="text-muted-foreground ml-auto" />
          </InputGroupAddon>
        </InputGroup>
      </Field>
      <Field>
        <FieldLabel htmlFor="input-addon-21">Addon (block-end)</FieldLabel>
        <InputGroup className="h-auto">
          <InputGroupInput id="input-addon-21" />
          <InputGroupAddon align="block-end">
            <InputGroupText>20/240 characters</InputGroupText>
            <InfoIcon className="text-muted-foreground ml-auto" />
          </InputGroupAddon>
        </InputGroup>
      </Field>
      <Field>
        <FieldLabel htmlFor="input-icon-both-10">Multiple Icons</FieldLabel>
        <InputGroup>
          <InputGroupInput id="input-icon-both-10" />
          <InputGroupAddon align="inline-end">
            <StarIcon />
            <InputGroupButton
              size="icon-xs"
              onClick={() => toast("Copied to clipboard")}
            >
              <CopyIcon />
            </InputGroupButton>
          </InputGroupAddon>
          <InputGroupAddon>
            <RadioIcon className="animate-pulse text-red-500" />
          </InputGroupAddon>
        </InputGroup>
      </Field>
      <Field>
        <FieldLabel htmlFor="input-description-10">Description</FieldLabel>
        <InputGroup>
          <InputGroupInput id="input-description-10" />
          <InputGroupAddon align="inline-end">
            <InfoIcon />
          </InputGroupAddon>
        </InputGroup>
        <FieldDescription>
          This is a description of the input group.
        </FieldDescription>
      </Field>
      <Field>
        <FieldLabel htmlFor="input-label-10">Label</FieldLabel>
        <InputGroup>
          <InputGroupAddon>
            <FieldLabel htmlFor="input-label-10">Label</FieldLabel>
          </InputGroupAddon>
          <InputGroupInput id="input-label-10" />
        </InputGroup>
        <InputGroup>
          <InputGroupInput id="input-optional-12" aria-label="Optional" />
          <InputGroupAddon align="inline-end">
            <InputGroupText>(optional)</InputGroupText>
          </InputGroupAddon>
        </InputGroup>
      </Field>
    </FieldGroup>
  )
}
