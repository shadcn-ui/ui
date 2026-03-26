import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/examples/base/ui/field"
import { Input } from "@/examples/base/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/examples/base/ui/input-group"
import { Kbd, KbdGroup } from "@/examples/base/ui/kbd"
import { Spinner } from "@/examples/base/ui/spinner"
import { CheckIcon, InfoIcon, SearchIcon, SparklesIcon } from "lucide-react"

export function InputGroupWithKbd() {
  return (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="input-kbd-22">Input Group with Kbd</FieldLabel>
        <InputGroup>
          <InputGroupInput id="input-kbd-22" />
          <InputGroupAddon>
            <Kbd>⌘K</Kbd>
          </InputGroupAddon>
        </InputGroup>
        <InputGroup>
          <InputGroupInput id="input-kbd-23" />
          <InputGroupAddon align="inline-end">
            <Kbd>⌘K</Kbd>
          </InputGroupAddon>
        </InputGroup>
        <InputGroup>
          <InputGroupInput
            id="input-search-apps-24"
            placeholder="Search for Apps..."
          />
          <InputGroupAddon align="inline-end">Ask AI</InputGroupAddon>
          <InputGroupAddon align="inline-end">
            <Kbd>Tab</Kbd>
          </InputGroupAddon>
        </InputGroup>
        <InputGroup>
          <InputGroupInput
            id="input-search-type-25"
            placeholder="Type to search..."
          />
          <InputGroupAddon align="inline-start">
            <SparklesIcon />
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">
            <KbdGroup>
              <Kbd>Ctrl</Kbd>
              <Kbd>C</Kbd>
            </KbdGroup>
          </InputGroupAddon>
        </InputGroup>
      </Field>
      <Field>
        <FieldLabel htmlFor="input-username-26">Username</FieldLabel>
        <InputGroup>
          <InputGroupInput id="input-username-26" defaultValue="shadcn" />
          <InputGroupAddon align="inline-end">
            <div className="flex size-4 items-center justify-center rounded-full bg-green-500 dark:bg-green-800">
              <CheckIcon className="size-3 text-white" />
            </div>
          </InputGroupAddon>
        </InputGroup>
        <FieldDescription className="text-green-700">
          This username is available.
        </FieldDescription>
      </Field>
      <InputGroup>
        <InputGroupInput
          id="input-search-docs-27"
          placeholder="Search documentation..."
        />
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">12 results</InputGroupAddon>
      </InputGroup>
      <InputGroup data-disabled="true">
        <InputGroupInput
          id="input-search-disabled-28"
          placeholder="Search documentation..."
          disabled
        />
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">Disabled</InputGroupAddon>
      </InputGroup>
      <FieldGroup className="grid grid-cols-2 gap-4">
        <Field>
          <FieldLabel htmlFor="input-group-11">First Name</FieldLabel>
          <InputGroup>
            <InputGroupInput id="input-group-11" placeholder="First Name" />
            <InputGroupAddon align="inline-end">
              <InfoIcon />
            </InputGroupAddon>
          </InputGroup>
        </Field>
        <Field>
          <FieldLabel htmlFor="input-group-12">Last Name</FieldLabel>
          <InputGroup>
            <InputGroupInput id="input-group-12" placeholder="Last Name" />
            <InputGroupAddon align="inline-end">
              <InfoIcon />
            </InputGroupAddon>
          </InputGroup>
        </Field>
      </FieldGroup>
      <Field data-disabled="true">
        <FieldLabel htmlFor="input-group-29">
          Loading (&quot;data-disabled=&quot;true&quot;)
        </FieldLabel>
        <InputGroup>
          <InputGroupInput id="input-group-29" disabled defaultValue="shadcn" />
          <InputGroupAddon align="inline-end">
            <Spinner />
          </InputGroupAddon>
        </InputGroup>
        <FieldDescription>
          This is a description of the input group.
        </FieldDescription>
      </Field>
    </FieldGroup>
  )
}
