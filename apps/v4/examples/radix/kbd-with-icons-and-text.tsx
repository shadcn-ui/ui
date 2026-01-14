import { Kbd, KbdGroup } from "@/examples/radix/ui/kbd"
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
