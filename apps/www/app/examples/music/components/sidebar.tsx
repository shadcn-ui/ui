import {
  LayoutGrid,
  Library,
  ListMusic,
  Mic2,
  Music,
  Music2,
  PlayCircle,
  Radio,
  User,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/new-york/ui/button"
import { ScrollArea } from "@/registry/new-york/ui/scroll-area"

import { Playlist } from "../data/playlists"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  playlists: Playlist[]
}

export function Sidebar({ className, playlists }: SidebarProps) {
  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Discover
          </h2>
          <div className="space-y-1">
            <Button variant="secondary" className="w-full justify-start">
              <PlayCircle className="mr-2 h-4 w-4" />
              Listen Now
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <LayoutGrid className="mr-2 h-4 w-4" />
              Browse
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Radio className="mr-2 h-4 w-4" />
              Radio
            </Button>
          </div>
        </div>
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Library
          </h2>
          <div className="space-y-1">
            <Button variant="ghost" className="w-full justify-start">
              <ListMusic className="mr-2 h-4 w-4" />
              Playlists
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Music2 className="mr-2 h-4 w-4" />
              Songs
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <User className="mr-2 h-4 w-4" />
              Made for You
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Mic2 className="mr-2 h-4 w-4" />
              Artists
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Library className="mr-2 h-4 w-4" />
              Albums
            </Button>
          </div>
        </div>
        <div className="py-2">
          <h2 className="relative px-7 text-lg font-semibold tracking-tight">
            Playlists
          </h2>
          <ScrollArea className="h-[300px] px-1">
            <div className="space-y-1 p-2">
              {playlists?.map((playlist, i) => (
                <Button
                  key={`${playlist}-${i}`}
                  variant="ghost"
                  className="w-full justify-start font-normal"
                >
                  <ListMusic className="mr-2 h-4 w-4" />
                  {playlist}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}
