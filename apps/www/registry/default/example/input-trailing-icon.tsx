import { EnvelopeClosedIcon } from "@radix-ui/react-icons"

import { InputWithIcon } from "@/registry/default/ui/input-with-icon"

export default function InputIconTrailingIconDemo() {
  return (
    <InputWithIcon
      icon={<EnvelopeClosedIcon />}
      inputProps={{
        placeholder: "Email",
      }}
      position={"trailing"}
    />
  )
}
