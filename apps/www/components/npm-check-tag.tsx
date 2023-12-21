import Link from "next/link"
import {
  CalendarDays,
  Check,
  GitBranch,
  GithubIcon,
  Link2,
  LinkIcon,
  Loader,
  X,
} from "lucide-react"
import useSWR from "swr"

import { fetcher, swr_options } from "@/lib/fetcher"
import { cn, formatDate } from "@/lib/utils"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/new-york/ui/avatar"
import { Button } from "@/registry/new-york/ui/button"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/registry/new-york/ui/hover-card"

import { Tag, tagVariants } from "./tag-input"

// Convert to human-readable format


type NPMData =
  | "_id "
  | "_rev"
  | "name"
  | "description"
  | "dist-tags"
  | "versions"
  | "maintainers"
  | "readme"
  | "readmeFilename"
  | "homepage"
  | "keywords"
  | "bugs"
  | "users"
  | "license"

export const NpmRegisteryCheckTag = ({
  tag,
  action,
}: {
  tag: Tag
  action: () => void
}) => {
  type Data = { [T in NPMData]: string } & {
    time: {
      modified: string
      created: string
    }
    repository: {
      type: "git"
      url: `git+${string}`
      directory: string
    }
  }

  const { data, error, isLoading } = useSWR<Data>(
    `/api/npm/${tag.text}`,
    fetcher,
    swr_options
  )
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <span
          key={tag.id}
          className={cn(
            tagVariants({ variant: error ? "destructive" : "default" }),
            "flex"
          )}
        >
          {error && (
            <>
              <X className="me-2 ms-1" size={14} />
              {tag.text}
            </>
          )}
          {isLoading && (
            <>
              <Loader className="me-2 ms-1 animate-spin" size={14} />
              {tag.text}
            </>
          )}
          <p className="ps-2 opacity-60">
            {error && `NPM dependency not found`}
            {isLoading && `Checking NPM registry`}
          </p>

          {data && (
            <Button className="gap-2 ps-0" variant="link">
              <Check className="text-green-500" size={14} /> {tag.text}
            </Button>
          )}

          <Button
            type="button"
            variant="ghost"
            onClick={action}
            className={"ms-auto h-full px-2 py-1 hover:bg-transparent"}
          >
            <X size={14} />
          </Button>
        </span>
      </HoverCardTrigger>
      {data && (
        <HoverCardContent className="w-96 space-y-2">
          <div className="flex justify-start space-x-4">
            <Avatar className="rounded-sm">
              <AvatarImage
                className="rounded-sm"
                src="https://github.com/npm.png"
              />
              <AvatarFallback>NPM</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h4 className="text-sm font-semibold lowercase">{data.name}</h4>
              <p className="text-sm">{data.description}</p>
            </div>
          </div>
          <div className="flex items-center">
            <CalendarDays className="mr-2 h-4 w-4 opacity-70" />{" "}
            <span className="text-xs text-muted-foreground">
              Created:
              <br />
              {formatDate(data.time.created)}
            </span>
          </div>
          <div className="flex items-center">
            <CalendarDays className="mr-2 h-4 w-4 opacity-70" />
            <span className="text-xs text-muted-foreground">
              Last modified:
              <br />
              {formatDate(data.time.modified)}
            </span>
          </div>
          {data.repository && (
            <div className="flex items-center lowercase">
              <GithubIcon className="mr-2 h-4 w-4 opacity-70" />
              <Link
                className="text-xs text-muted-foreground"
                href={
                  data.repository?.url?.replaceAll(/git\+|\.git/g, "") || ""
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                {data.repository.url?.replaceAll(/git\+|\.git/g, "")}
              </Link>
            </div>
          )}
          {data.homepage && (
            <div className="flex items-center lowercase">
              <LinkIcon className="mr-2 h-4 w-4 opacity-70" />
              <Link
                className="text-xs text-muted-foreground"
                href={data.homepage || ""}
                target="_blank"
                rel="noopener noreferrer"
              >
                {data.homepage}
              </Link>
            </div>
          )}
        </HoverCardContent>
      )}
    </HoverCard>
  )
}
