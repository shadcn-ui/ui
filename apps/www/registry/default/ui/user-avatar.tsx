import * as React from "react"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/default/ui/avatar"


type UserAvatarProps = {
  name: string,
  image: string,
  title: string,
}
const UserAvatar = ({
  name,
  image,
  title
}: UserAvatarProps) => {
  const fullNameSplit = name.split(" ")
  const firstName = fullNameSplit[0]
  const lastName = fullNameSplit[fullNameSplit.length - 1]
  const initials = `${firstName.charAt(0) ?? ""} ${lastName.charAt(0) ?? ""}`
  return (
    <div className="flex gap-2 ">

      <Avatar>
        <AvatarImage src={image} alt={name} />
        <AvatarFallback>{initials.toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className='flex flex-col items-start justify-center gap-[-20px]'>
        <p className='leading-none" text-sm font-medium'>{name}</p>
        <p className='text-xs leading-none text-muted-foreground'>{title}</p>
      </div>
    </div>

  )

}

export { UserAvatar }
