import React from "react"
import Image from "next/image"
import { format } from "date-fns"
import {
  CloudDownloadIcon,
  DotIcon,
  DownloadIcon,
  FileIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { AspectRatio } from "@/registry/default/ui/aspect-ratio"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/default/ui/avatar"
import { Button } from "@/registry/default/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/registry/default/ui/tooltip"

type Message = {
  sender: string
  message: string
  timestamp: Date
  image?: string
  file?: {
    name: string
    type: string
    size: number
    pages: number
    url: string
  }
  link?: string
}

interface MessageProps {
  message: Message
}

export function Message({ message }: MessageProps) {
  return (
    <div className={cn("flex", message.sender === "@me" && "justify-end")}>
      <div
        className={cn(
          "flex items-start gap-2.5",
          message.sender === "@me" && "flex-row-reverse"
        )}
      >
        <Avatar className="size-8 rounded-lg">
          <AvatarImage src="/placeholder.svg" />
          <AvatarFallback>{message.sender.charAt(0)}</AvatarFallback>
        </Avatar>
        <div
          className={cn(
            "flex w-full max-w-[320px] flex-col gap-1",
            message.sender === "@me" && "items-end"
          )}
        >
          <div
            className={cn(
              "flex items-center justify-between space-x-2 rtl:space-x-reverse",
              message.sender === "@me" &&
                "flex-row-reverse justify-end space-x-reverse"
            )}
          >
            <span className="text-sm font-medium text-foreground">
              {message.sender === "@me" ? "You" : "Mia Johnson"}
            </span>
            <span className="text-xs font-normal text-muted-foreground">
              {format(message.timestamp, "EEEE, HH:mm")}
            </span>
          </div>
          <div
            className={cn(
              "leading-1.5 flex flex-col border bg-muted/50 p-4",
              message.sender === "@me"
                ? "rounded-s-lg rounded-ee-lg"
                : "rounded-e-lg rounded-es-lg",
              (message.image || message.file || message.link) && "space-y-2.5"
            )}
          >
            <p className="text-sm font-normal">{message.message}</p>

            {message.image && (
              <div className="group relative my-2.5">
                <div className="absolute z-20 flex h-full w-full items-center justify-center rounded-lg bg-zinc-900/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild className="z-50">
                        <Button
                          variant="outline"
                          size="icon"
                          className="size-10 rounded-full border-none bg-background/30 hover:bg-background/50"
                          aria-label="Download"
                        >
                          <DownloadIcon
                            size={16}
                            strokeWidth={2}
                            aria-hidden="true"
                          />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        <p>Download</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="aspect-[3/2] rounded-lg bg-muted">
                  <Image
                    fill
                    src={message.image || "/placeholder.svg"}
                    alt="Image"
                    className="h-full w-full rounded-lg object-cover"
                  />
                </div>
              </div>
            )}

            {message.file && (
              <div className="flex items-start rounded-lg border bg-muted p-2">
                <div className="me-2 flex-1">
                  <span className="flex items-center gap-2 pb-2 text-sm font-medium">
                    <FileIcon size={16} strokeWidth={1.5} aria-hidden="true" />
                    {message.file.name}
                  </span>
                  <span className="flex gap-2 text-xs font-normal text-muted-foreground">
                    {message.file.pages} Pages
                    <DotIcon
                      size={8}
                      strokeWidth={2}
                      className="self-center text-foreground"
                    />
                    {message.file.size} MB
                    <DotIcon
                      size={8}
                      strokeWidth={2}
                      className="self-center text-foreground"
                    />
                    {message.file.type === "application/pdf" ? "PDF" : "DOCX"}
                  </span>
                </div>
                <div className="inline-flex items-center self-center">
                  <Button
                    variant="outline"
                    size="icon"
                    type="button"
                    className="size-8"
                  >
                    <CloudDownloadIcon
                      size={16}
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                  </Button>
                </div>
              </div>
            )}

            {message.link && (
              <div className="w-full max-w-[280px]">
                <Button
                  variant="link"
                  className="whitespace-normal p-0"
                  asChild
                >
                  <a href={message.link}>{message.link}</a>
                </Button>

                <div className="mb-2 cursor-pointer space-y-2.5 rounded-lg bg-muted p-4 hover:bg-accent">
                  <AspectRatio ratio={16 / 9} className="rounded-lg bg-muted">
                    <Image
                      fill
                      src="/placeholder.svg"
                      alt="Image"
                      className="rounded-lg object-cover"
                    />
                  </AspectRatio>
                  <div className="flex flex-col">
                    <span className="mb-2 truncate text-sm font-medium leading-none">
                      Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                      Totam ut exercitationem quibusdam dolorem maxime
                      accusantium unde fugiat earum modi culpa.
                    </span>
                    <span className="text-xs font-normal leading-none text-muted-foreground">
                      {message.link.slice(0, 40)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
          <span className="pb-2.5 text-xs font-normal text-muted-foreground">
            Delivered
          </span>
        </div>
      </div>
    </div>
  )
}
