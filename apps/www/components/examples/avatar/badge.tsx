import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

export function AvatarBadgeDemo() {
  return (
    <Avatar>
      <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
      <AvatarFallback>CN</AvatarFallback>
      <AvatarBadge>
        <span className="relative">
          <span className="absolute w-full h-full rounded-full opacity-75 bg-lime-400 animate-ping"></span>
          <span className="absolute w-full h-full rounded-full bg-lime-500"></span>
        </span>
      </AvatarBadge>
    </Avatar>
  )
}
