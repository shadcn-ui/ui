import { LoaderIcon } from "lucide-react"

import { Input } from "@/registry/new-york-v4/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from "@/registry/new-york-v4/ui/input-group"
import { Spinner } from "@/registry/new-york-v4/ui/spinner"

export default function InputGroupSpinner() {
  return (
    <div className="grid w-full max-w-sm gap-4">
      <InputGroup data-disabled>
        <Input placeholder="Searching..." disabled />
        <InputGroupAddon align="inline-end">
          <Spinner />
        </InputGroupAddon>
      </InputGroup>
      <InputGroup data-disabled>
        <Input placeholder="Processing..." disabled />
        <InputGroupAddon>
          <Spinner />
        </InputGroupAddon>
      </InputGroup>
      <InputGroup data-disabled>
        <Input placeholder="Saving changes..." disabled />
        <InputGroupAddon align="inline-end">
          <InputGroupText>Saving...</InputGroupText>
          <Spinner />
        </InputGroupAddon>
      </InputGroup>
      <InputGroup data-disabled>
        <Input placeholder="Refreshing data..." disabled />
        <InputGroupAddon>
          <LoaderIcon className="animate-spin" />
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">
          <InputGroupText className="text-muted-foreground">
            Please wait...
          </InputGroupText>
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}
