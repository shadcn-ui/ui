import type { JSX } from "react"


import UserInfo from "./user-info"
import UserOptions from "./user-options"

const user = {
  name: "John Doe",
  avatar: "https://github.com/javierdev0.png",
  following: 100,
  followers: 1000,
  email: "john.doe@shadcn.ui",
  location: "Silicon Valley, CA",
  role: "Software Engineer",
}

export default function Banner(): JSX.Element {
  return (
    <div className="h-fit rounded-lg border border-border bg-background p-4 md:p-6">
      <div className="flex w-full items-start justify-between">
        <UserInfo user={user} />
        <div className="flex items-center gap-4">
          <UserOptions />
        </div> 
      </div>
    </div>
  )
}
