import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/new-york/ui/avatar"
import { AvatarGroup } from "@/registry/new-york/ui/avatar-group"

export default function AvatarGroupDemo() {
  return (
    <AvatarGroup orientation="horizontal">
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage src="https://github.com/dpaulos6.png" />
        <AvatarFallback>DP</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage src="https://github.com/shuding.png" />
        <AvatarFallback>SD</AvatarFallback>
      </Avatar>
    </AvatarGroup>
  )
}
