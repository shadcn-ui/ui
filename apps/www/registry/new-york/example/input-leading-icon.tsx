import { EnvelopeClosedIcon } from "@radix-ui/react-icons"
import { InputWithIcon } from "@/registry/new-york/ui/input-with-icon"

export default function InputIconLeadingIconDemo() {
  return (
    <InputWithIcon icon={<EnvelopeClosedIcon />} inputProps={{
      placeholder: "Email",
    }} position={"trailing"}  />
  )
}
