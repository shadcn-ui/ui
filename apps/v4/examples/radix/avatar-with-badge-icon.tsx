import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/examples/radix/ui/avatar"
import { CheckIcon, PlusIcon } from "lucide-react"

export function AvatarWithBadgeIcon() {
  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <Avatar size="sm">
          <AvatarImage
            src="https://github.com/pranathip.png"
            alt="@pranathip"
          />
          <AvatarFallback>PP</AvatarFallback>
          <AvatarBadge>
            <PlusIcon />
          </AvatarBadge>
        </Avatar>
        <Avatar>
          <AvatarImage
            src="https://github.com/pranathip.png"
            alt="@pranathip"
          />
          <AvatarFallback>PP</AvatarFallback>
          <AvatarBadge>
            <PlusIcon />
          </AvatarBadge>
        </Avatar>
        <Avatar size="lg">
          <AvatarImage
            src="https://github.com/pranathip.png"
            alt="@pranathip"
          />
          <AvatarFallback>PP</AvatarFallback>
          <AvatarBadge>
            <PlusIcon />
          </AvatarBadge>
        </Avatar>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Avatar size="sm">
          <AvatarFallback>PP</AvatarFallback>
          <AvatarBadge>
            <CheckIcon />
          </AvatarBadge>
        </Avatar>
        <Avatar>
          <AvatarFallback>PP</AvatarFallback>
          <AvatarBadge>
            <CheckIcon />
          </AvatarBadge>
        </Avatar>
        <Avatar size="lg">
          <AvatarFallback>PP</AvatarFallback>
          <AvatarBadge>
            <CheckIcon />
          </AvatarBadge>
        </Avatar>
      </div>
    </>
  )
}
