import { EnvelopeClosedIcon } from "@radix-ui/react-icons"

import { InputWithIcon } from "@/registry/default/ui/input-with-icon"

export default function InputIconLeadingIconDemo() {
  return (
    <InputWithIcon icon={<EnvelopeClosedIcon />} position={"trailing"}  />
  )
}

