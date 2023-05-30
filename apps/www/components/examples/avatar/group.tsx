import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupList,
  AvatarImage,
  AvatarOverflowIndicator,
} from "@/components/ui/avatar"

export function AvatarGroupDemo() {
  return (
    <AvatarGroup limit={3}>
      <AvatarGroupList>
        {Array.from({ length: 5 }).map((_, i) => (
          <Avatar key={i}>
            <AvatarImage
              src={`https://xsgames.co/randomusers/assets/avatars/female/${i}.jpg`}
              alt="@shadcn"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        ))}
      </AvatarGroupList>
      <AvatarOverflowIndicator />
    </AvatarGroup>
  )
}
