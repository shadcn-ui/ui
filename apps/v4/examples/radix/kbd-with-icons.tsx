import { Kbd, KbdGroup } from "@/examples/radix/ui/kbd"
import { ArrowLeftIcon, ArrowRightIcon, CircleDashedIcon } from "lucide-react"

export function KbdWithIcons() {
  return (
    <KbdGroup>
      <Kbd>
        <CircleDashedIcon />
      </Kbd>
      <Kbd>
        <ArrowLeftIcon />
      </Kbd>
      <Kbd>
        <ArrowRightIcon />
      </Kbd>
    </KbdGroup>
  )
}
