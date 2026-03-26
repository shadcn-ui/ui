import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/examples/base/ui/avatar"
import { PlusIcon } from "lucide-react"

export function AvatarBadgeIconExample() {
  return (
    <Avatar className="grayscale">
      <AvatarImage src="https://github.com/pranathip.png" alt="@pranathip" />
      <AvatarFallback>PP</AvatarFallback>
      <AvatarBadge>
        <PlusIcon />
      </AvatarBadge>
    </Avatar>
  )
}
