"use client"

import { FC } from "react"
import Link from "next/link"
import type { AppRouter } from "@/server/api/root"
import { api } from "@/trpc/react"
import { StarFilledIcon, StarIcon } from "@radix-ui/react-icons"
import type { inferRouterOutputs } from "@trpc/server"
import { CalendarDays, Download } from "lucide-react"

import { cn, findFallback, formatDate } from "@/lib/utils"
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
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/registry/new-york/ui/hover-card"
import { ScrollArea } from "@/registry/new-york/ui/scroll-area"

import { Icons } from "./icons"
import { DashboardTableOfContents } from "./toc"

interface MarketplaceContainerProps {
  data: inferRouterOutputs<AppRouter>["packages"]["newPackages"]
}

export const MarketplaceExplore = ({ data }: MarketplaceContainerProps) => {
  return (
    <ScrollArea>
      <div
        className={cn(
          "mt-4 flex flex-col gap-4 md:grid md:grid-cols-2 lg:grid-cols-3"
        )}
      >
        {data.map((instance) => (
          <MarketCard key={instance.name} data={instance} />
        ))}
      </div>
    </ScrollArea>
  )
}

interface MarketplaceCardProps {
  data: inferRouterOutputs<AppRouter>["packages"]["newPackages"][number]
}

const MarketCard: FC<MarketplaceCardProps> = ({ data }) => {
  return (
    <Link href={`/marketplace/${data.name}`}>
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>{data.name}</CardTitle>
          <div className="flex items-center justify-center gap-2 text-sm">
            {data.downloads} <Download scale={10} />
          </div>
        </CardHeader>
        <CardFooter className="mt-10 justify-between">
          <p>{data.description}</p>
          <HoverCard>
            <HoverCardTrigger asChild>
              <Avatar>
                <AvatarFallback>
                  {findFallback(data.author.name)}
                </AvatarFallback>
                <AvatarImage src={data.author.image || ""} />
              </Avatar>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <Profile component={data} />
            </HoverCardContent>
          </HoverCard>
        </CardFooter>
      </Card>
    </Link>
  )
}

interface ProfileProps {
  component: inferRouterOutputs<AppRouter>["packages"]["newPackages"][0]
}

const Profile = ({ component }: ProfileProps) => {
  return (
    <div className="flex flex-col justify-start space-y-2">
      <div className="mb-2 flex items-center space-x-4">
        <Avatar>
          <AvatarImage src={component.author.image || ""} />
          <AvatarFallback>{findFallback(component.author.name)}</AvatarFallback>
        </Avatar>
        <div>
          <h4 className="text-sm font-semibold">{component.author.name}</h4>
          <p className="text-sm">{component.author.username || "dfghjk"}</p>
        </div>
      </div>
      <div className="flex items-center">
        <CalendarDays className="mr-2 h-4 w-4 opacity-70" />{" "}
        <span className="text-xs text-muted-foreground">
          Created: {formatDate(component.created_at)}
        </span>
      </div>
      <div className="flex items-center">
        <CalendarDays className="mr-2 h-4 w-4 opacity-70" />{" "}
        <span className="text-xs text-muted-foreground">
          Last modified: {formatDate(component.created_at)}
        </span>
      </div>
      <div className="flex items-center">
        <Download className="mr-2 h-4 w-4 opacity-70" />{" "}
        <span className="text-xs text-muted-foreground">
          Total downloads: {component.downloads}
        </span>
      </div>
      <div className="flex items-center">
        <StarFilledIcon className="mr-2 h-4 w-4 opacity-70" />{" "}
        <span className="text-xs text-muted-foreground">
          Total stars: {component.downloads}
        </span>
      </div>
    </div>
  )
}

export const AsideMarketplaceExplore = () => {
  const { data, isLoading } = api.packages.nameSomePackages.useQuery()

  const tocItems = data
    ? data.map((e) => ({ title: e.name, url: `/marketplace/${e.name}` }))
    : []
  return (
    <div className="hidden text-sm xl:block">
      <div className="sticky top-16 -mt-10 pt-4">
        <ScrollArea className="pb-10">
          <div className="sticky top-16 -mt-10 h-[calc(100vh-3.5rem)] py-12">
            {isLoading ? (
              <Icons.spinner className="animate-spin" />
            ) : (
              <DashboardTableOfContents title="Explore" toc={{ items: tocItems }} />
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}

