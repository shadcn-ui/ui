import * as React from "react"
import Image from "next/image"

import { ScrollArea, ScrollBar } from "@/registry/new-york/ui/scroll-area"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/registry/new-york/ui/tooltip"

export interface Artwork {
  artist: string
  art: string
}

export const works: Artwork[] = [
  {
    artist: "Ornella Binni",
    art: "https://images.unsplash.com/photo-1465869185982-5a1a7522cbcb?auto=format&fit=crop&w=300&q=80",
  },
  {
    artist: "Tom Byrom",
    art: "https://images.unsplash.com/photo-1548516173-3cabfa4607e9?auto=format&fit=crop&w=300&q=80",
  },
  {
    artist: "Vladimir Malyavko",
    art: "https://images.unsplash.com/photo-1494337480532-3725c85fd2ab?auto=format&fit=crop&w=300&q=80",
  },
]

export default function ScrollAreaHorizontalDemo() {
  return (
    <ScrollArea className="w-96 whitespace-nowrap rounded-md border">
      <div className="flex space-x-4 pb-4">
        {works.map((artwork) => (
          <div
            key={artwork.artist}
            className="h-[400px] w-[300px] overflow-hidden rounded-md"
          >
            <Tooltip>
              <TooltipTrigger>
                <Image
                  src={artwork.art}
                  alt={`Photo by ${artwork.artist}`}
                  width={300}
                  height={400}
                />
              </TooltipTrigger>
              <TooltipContent>Photo by {artwork.artist}</TooltipContent>
            </Tooltip>
          </div>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}
