"use client"
import { Card, CardContent } from "@/registry/tui/ui/card"
import AvatarDemo from "../avatar-demo"
import { Avatar, AvatarImage } from "../../ui/avatar"


export function CardsAvatar() {
  return (
    <Card className="">
      <CardContent className="space-y-1 p-2">
        <div className="flex items-center space-x-2">
          <Avatar size="xs" src="https://github.com/shadcn.png" alt="@shadcn">
          </Avatar>
          <Avatar size="sm" src="https://github.com/shadcn.png" alt="@shadcn">
          </Avatar>
          <Avatar size="md" src="https://github.com/shadcn.png" alt="@shadcn">
          </Avatar>
          <Avatar size="lg" src="https://github.com/shadcn.png" alt="@shadcn">
          </Avatar>
          <Avatar size="xl" src="https://github.com/shadcn.png" alt="@shadcn">
          </Avatar>
        </div>
        <div className="flex items-center space-x-2">
          <Avatar size="xs" src="https://github.com/shadcn.png" alt="@shadcn" variant="rounded">
          </Avatar>
          <Avatar size="sm" src="https://github.com/shadcn.png" alt="@shadcn" variant="rounded">
          </Avatar>
          <Avatar size="md" src="https://github.com/shadcn.png" alt="@shadcn" variant="rounded">
          </Avatar>
          <Avatar size="lg" src="https://github.com/shadcn.png" alt="@shadcn" variant="rounded">
          </Avatar>
          <Avatar size="xl" src="https://github.com/shadcn.png" alt="@shadcn" variant="rounded">
          </Avatar>
        </div>
        <div className="flex items-center space-x-2">
          <Avatar variant="dotCircular" color="gray" size="xs" src="https://github.com/shadcn.png" alt="@shadcn" >
          </Avatar>
          <Avatar variant="dotCircular" color="red" size="sm" src="https://github.com/shadcn.png" alt="@shadcn" >
          </Avatar>
          <Avatar variant="dotCircular" color="green" size="md" src="https://github.com/shadcn.png" alt="@shadcn" >
          </Avatar>
          <Avatar variant="dotCircular" color="blue" size="lg" src="https://github.com/shadcn.png" alt="@shadcn" >
          </Avatar>
          <Avatar variant="dotCircular" color="yellow" size="xl" src="https://github.com/shadcn.png" alt="@shadcn" >
          </Avatar>
        </div>
        <div className="flex items-center space-x-2">
          <Avatar variant="dotRounded" color="gray" size="xs" src="https://github.com/shadcn.png" alt="@shadcn" >
          </Avatar>
          <Avatar variant="dotRounded" color="red" size="sm" src="https://github.com/shadcn.png" alt="@shadcn" >
          </Avatar>
          <Avatar variant="dotRounded" color="green" size="md" src="https://github.com/shadcn.png" alt="@shadcn" >
          </Avatar>
          <Avatar variant="dotRounded" color="blue" size="lg" src="https://github.com/shadcn.png" alt="@shadcn" >
          </Avatar>
          <Avatar variant="dotRounded" color="yellow" size="xl" src="https://github.com/shadcn.png" alt="@shadcn" >
          </Avatar>
        </div>
        <div className="flex items-center space-x-2">
          <Avatar size="xs" className="bg-red-500">
            AW
          </Avatar>
          <Avatar size="sm">
            AW
          </Avatar>
          <Avatar size="md">
            AW
          </Avatar>
          <Avatar size="lg">
            AW
          </Avatar>
          <Avatar size="xl">
            AW
          </Avatar>
        </div>
        <div className="flex -space-x-1 overflow-hidden">
          <Avatar size="sm" src="https://github.com/shadcn.png" alt="@shadcn" variant="ring" />
          <Avatar size="sm" src="https://github.com/shadcn.png" alt="@shadcn" variant="ring" />
          <Avatar size="sm" src="https://github.com/shadcn.png" alt="@shadcn" variant="ring" />
          <Avatar size="sm" src="https://github.com/shadcn.png" alt="@shadcn" variant="ring" />
          <Avatar size="sm" src="https://github.com/shadcn.png" alt="@shadcn" variant="ring" />
        </div>
      </CardContent>
    </Card>
  )
}
