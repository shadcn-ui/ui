"use client";

import Link from "next/link";
import { MoreHorizontal, SquarePen } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/registry/new-york/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/registry/new-york/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Message } from "../data";

interface SidebarProps {
  isCollapsed: boolean;
  links: {
    name: string;
    messages: Message[];
    avatar: string;
    variant: "secondary" | "ghost";
  }[];
  onClick?: () => void;
}

export function Sidebar({ links, isCollapsed }: SidebarProps) {
  return (
    <div
      data-collapsed={isCollapsed}
      className="relative group flex bg-muted/20 flex-col h-full gap-4 p-2 data-[collapsed=true]:p-2 "
    >
      {!isCollapsed && (
        <div className="flex justify-between p-2 items-center">
          <div className="flex gap-2 items-center text-2xl">
            <p className="font-medium">Chats</p>
            <span className="text-zinc-300">({links.length})</span>
          </div>

          <div>
            <Link
              href="#"
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon" }),
                "h-9 w-9"
              )}
            >
              <MoreHorizontal size={20} />
            </Link>

            <Link
              href="#"
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon" }),
                "h-9 w-9"
              )}
            >
              <SquarePen size={20} />
            </Link>
          </div>
        </div>
      )}
      <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
        {links.map((link, index) =>
          isCollapsed ? (
            <TooltipProvider key={index}>
              <Tooltip key={index} delayDuration={0}>
                <TooltipTrigger asChild>
                  <Link
                    href="#"
                    className={cn(
                      buttonVariants({ variant: link.variant, size: "icon" }),
                      "h-11 w-11 md:h-16 md:w-16",
                    )}
                  >
                    <Avatar className="flex justify-center items-center">
                      <AvatarImage
                        src={link.avatar}
                        alt={link.avatar}
                        width={6}
                        height={6}
                        className="w-10 h-10 "
                      />
                      <AvatarFallback>
                        {link.name[0].substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>{" "}
                    <span className="sr-only">{link.name}</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  className="flex items-center gap-4"
                >
                  {link.name}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <Link
              key={index}
              href="#"
              className={cn(
                buttonVariants({ variant: link.variant, size: "lg" }),
                "justify-start gap-4 py-8"
              )}
            >
              <Avatar className="flex justify-center items-center">
                <AvatarImage
                  src={link.avatar}
                  alt={link.avatar}
                  width={6}
                  height={6}
                  className="w-10 h-10 "
                />
                <AvatarFallback>
                  {link.name[0].substring(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col max-w-28">
                <span>{link.name}</span>
                {link.messages.length > 0 && (
                  <span className="text-zinc-300 text-xs truncate ">
                    {link.messages[link.messages.length - 1].name.split(" ")[0]}
                    : {link.messages[link.messages.length - 1].message}
                  </span>
                )}
              </div>
            </Link>
          )
        )}
      </nav>
    </div>
  );
}
