import { MapIcon, MapPin } from "lucide-react"

import { Input } from "@/registry/default/ui/input"

export default function InputWithIcons() {
  return (
    <div className="flex flex-col gap-4">
      <Input>
        <Input.Icon side="left">
          <MapIcon />
        </Input.Icon>
        <Input.Icon side="right">
          <MapPin />
        </Input.Icon>
      </Input>
      <Input>
        <Input.Icon side="left">
          <MapIcon />
        </Input.Icon>
      </Input>
      <Input>
        <Input.Icon side="right">
          <MapIcon />
        </Input.Icon>
      </Input>
    </div>
  )
}
