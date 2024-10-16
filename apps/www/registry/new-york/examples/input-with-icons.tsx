import { MapIcon, MapPin } from "lucide-react"

import { Input } from "@/registry/new-york/ui/input"

export default function InputWithIcons() {
  return (
    <div>
      <Input>
        <Input.Icon side="left">
          <MapIcon />
        </Input.Icon>
        <Input.Icon side="right">
          <MapPin />
        </Input.Icon>
      </Input>
    </div>
  )
}
