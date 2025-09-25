import { CheckIcon, CreditCardIcon, MailIcon, SearchIcon } from "lucide-react"

import { Input } from "@/registry/new-york-v4/ui/input"
import {
  InputGroup,
  InputGroupAddon,
} from "@/registry/new-york-v4/ui/input-group"

export default function InputGroupIcon() {
  return (
    <div className="grid w-full max-w-sm gap-6">
      <InputGroup>
        <Input placeholder="Search..." />
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <Input type="email" placeholder="Enter your email" />
        <InputGroupAddon>
          <MailIcon />
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <Input placeholder="Card number" />
        <InputGroupAddon>
          <CreditCardIcon />
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">
          <CheckIcon />
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}
