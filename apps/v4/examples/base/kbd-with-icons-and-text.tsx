import { Kbd, KbdGroup } from "@/examples/base/ui/kbd"
import { ArrowLeftIcon, CircleDashedIcon } from "lucide-react"

export function KbdWithIconsAndText() {
  return (
    <KbdGroup>
      <Kbd>
        <ArrowLeftIcon />
        Left
      </Kbd>
      <Kbd>
        <CircleDashedIcon />
        Voice Enabled
      </Kbd>
    </KbdGroup>
  )
}
