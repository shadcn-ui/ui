import { FC } from "react"
import { StarIcon } from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"
import { CardTitle } from "@/registry/default/ui/card"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/new-york/ui/avatar"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/registry/new-york/ui/card"
import { ScrollArea } from "@/registry/new-york/ui/scroll-area"

import { Icons } from "./icons"

interface MarketplaceCardProps {}

type Data = {
  name: string // "calendar"
  dependencies?: string[] // ["react-day-picker", "date-fns"]
  registryDependencies?: string[] // ["button"]
  files: {
    name: `${string}.tsx` // "calendar.tsx"
    dir: `${"components/addos"}/${string}` // "components/ui"
    content: string // "use client"\n\n  ${string}\n
  }[]
  type: "ui" | "addons"
}[]

const MarketplaceExplore = () => {
  return (
    <ScrollArea>
      <div className={cn("mt-4 grid grid-cols-3 gap-4")}>
        <MarketCard />
        <MarketCard />
        <MarketCard />
        <MarketCard />
        <MarketCard />
        <MarketCard />
      </div>
    </ScrollArea>
  )
}
export default MarketplaceExplore

const MarketCard: FC<MarketplaceCardProps> = () => {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <div className="flex gap-2">
          <Icons.react className="w-6" />
          <Icons.astro className="w-6" />
          <Icons.nextjs className="w-6" />
          <Icons.remix className="w-6" />
        </div>
        <div className="flex items-center justify-center gap-2 text-sm">
          32 <StarIcon scale={30} />
        </div>
      </CardHeader>
      <CardContent className="hover:opacity-1 opacity-0">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores neque
        accusamus sit laboriosam beatae nulla delectus? Harum itaque corrupti
        amet.
      </CardContent>
      <CardFooter className="justify-between">
        <CardTitle>Item-selector-input</CardTitle>
        <Avatar>
          <AvatarFallback>hi</AvatarFallback>
          <AvatarImage></AvatarImage>
        </Avatar>
      </CardFooter>
    </Card>
  )
}
