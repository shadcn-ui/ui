import { type JSX } from "react"
import { BadgeCheck, Laptop, Mail, MapPin } from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/new-york/ui/avatar"

import UserActions from "./user-actions"

interface UserInfoProps {
  user: {
    name: string
    avatar: string
    avatarFallback?: string
    following: number
    followers: number
    email?: string
    location?: string
    role?: string
  }
}

export default function UserInfo({
  user,
}: Readonly<UserInfoProps>): JSX.Element {
  return (
    <div>
      <div className="flex h-fit w-full gap-4 md:gap-6">
      <Avatar className="h-24 w-24 rounded-md md:h-44 md:w-44">
        <AvatarImage
          src="https://github.com/javierdev0.png"
          alt="@javierdev0"
        />
        <AvatarFallback className="rounded-md text-7xl font-bold">
          {user.avatarFallback ?? "JD"}
        </AvatarFallback>
      </Avatar>
      <div className="flex w-full flex-col justify-center gap-2 text-sm md:gap-4">
        <div className="flex w-full items-center justify-between">
          <h1 className="flex items-center gap-2 text-xl font-bold leading-none sm:text-2xl md:leading-normal">
            {user.name}
            <BadgeCheck size={18} />
          </h1>
        </div>

        <div className="flex items-center gap-4 text-xs leading-none text-foreground/80 md:text-sm md:leading-normal">
          <p>
            <span className="font-semibold text-foreground">
              {user.following ?? 0}
            </span>{" "}
            Following
          </p>
          <p>
            <span className="font-semibold text-foreground">
              {user.followers ?? 0}
            </span>{" "}
            Followers
          </p>
        </div>

          <button className='text-left text-xs font-semibold text-foreground md:hidden'>
            More info
        </button>

        <ul className="hidden flex-col gap-1.5 text-xs text-foreground/80 md:flex md:flex-row lg:text-sm xl:items-center xl:gap-4">
          <li className="flex items-center gap-1.5 leading-none">
            <span>
              <Mail size={16} />
            </span>
            <span>{user.email}</span>
          </li>
          <li className="flex items-center gap-1.5 leading-none">
            <span>
              <MapPin size={16} />
            </span>
            <span>{user.location}</span>
          </li>
          <li className="flex items-center gap-1.5 leading-none">
            <span>
              <Laptop size={16} />
            </span>
            <span>{user.role}</span>
          </li>
        </ul>
        <div className="hidden md:block">
          <UserActions />
        </div>
      </div>
      </div>
      <div className="md:hidden">
          <UserActions />
        </div>
      </div>
  )
}
