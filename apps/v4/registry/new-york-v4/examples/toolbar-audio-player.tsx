"use client"

import { useState } from "react"
import {
  HeadphoneOff,
  Headphones,
  HeartIcon,
  PauseIcon,
  PlayIcon,
  RepeatIcon,
  ShuffleIcon,
  SkipBackIcon,
  SkipForwardIcon,
  Volume2,
  VolumeX,
} from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/new-york-v4/ui/popover"
import { Slider } from "@/registry/new-york-v4/ui/slider"
import {
  Toolbar,
  ToolbarButton,
  ToolbarGroup,
} from "@/registry/new-york-v4/ui/toolbar"

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, "0")}`
}

export default function AudioPlayerExample() {
  const [volume, setVolume] = useState(50)
  const [duration, setDuration] = useState(347)
  const [currentTime, setCurrentTime] = useState(126)

  const [isMuted, setIsMuted] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [isShuffling, setIsShuffling] = useState(false)

  const [repeatMode, setRepeatMode] = useState<"none" | "one" | "all">("none")

  const toggleMute = () => {
    setIsMuted((prev) => !prev)
  }

  const toggleRepeat = () => {
    setRepeatMode((prev) =>
      prev === "none" ? "one" : prev === "one" ? "all" : "none"
    )
  }

  const togglePause = () => setIsPaused((prev) => !prev)
  const toggleLike = () => setIsLiked((prev) => !prev)

  return (
    <Toolbar
      aria-label="Player controls"
      className="mx-auto w-full max-w-lg flex-col gap-4"
    >
      <ToolbarGroup className="flex w-full flex-col">
        <div className="flex w-full items-center justify-between">
          <span className="text-sm">{formatDuration(currentTime)}</span>
          <span className="text-muted-foreground text-sm">
            {formatDuration(duration)}
          </span>
        </div>
        <Slider
          value={[currentTime]}
          max={duration}
          onValueChange={(v) => setCurrentTime(v[0])}
        />
      </ToolbarGroup>
      <ToolbarGroup className="flex w-full items-center justify-between">
        <ToolbarGroup className="w-full max-w-xs justify-start">
          <ToolbarButton
            onClick={toggleLike}
            tooltip={isLiked ? "Deslike" : "Like"}
            size="icon"
            variant="ghost"
          >
            <HeartIcon className={cn(isLiked && "fill-primary")} />
          </ToolbarButton>
        </ToolbarGroup>
        <ToolbarGroup className="w-full">
          <ToolbarButton
            tooltip="Random"
            size="icon"
            variant="ghost"
            onClick={() => setIsShuffling((p) => !p)}
            className={cn(isShuffling && "text-primary")}
          >
            <ShuffleIcon />
          </ToolbarButton>
          <ToolbarButton tooltip="Previous" size="icon" variant="ghost">
            <SkipBackIcon />
          </ToolbarButton>
          <ToolbarButton
            tooltip={isPaused ? "Play" : "Pause"}
            onClick={togglePause}
            size="icon"
            variant="ghost"
          >
            {isPaused ? <PlayIcon /> : <PauseIcon />}
          </ToolbarButton>
          <ToolbarButton tooltip="Next" size="icon" variant="ghost">
            <SkipForwardIcon />
          </ToolbarButton>
          <ToolbarButton
            tooltip="Repeat"
            size="icon"
            variant="ghost"
            onClick={toggleRepeat}
            className={cn(
              repeatMode !== "none" && "text-primary",
              repeatMode === "one" &&
                "before:absolute before:text-xs before:content-['1']"
            )}
          >
            <RepeatIcon />
          </ToolbarButton>
        </ToolbarGroup>
        <ToolbarGroup className="w-full max-w-xs justify-end">
          <ToolbarButton
            size="icon"
            variant="ghost"
            onClick={toggleMute}
            tooltip={isMuted ? "Muted" : "Desmuted"}
            aria-label={isMuted ? "Muted" : "Desmuted"}
          >
            {isMuted ? <HeadphoneOff /> : <Headphones />}
          </ToolbarButton>
          <Popover>
            <PopoverTrigger asChild>
              <ToolbarButton tooltip="Sound" size="icon" variant="ghost">
                {volume === 0 ? <VolumeX /> : <Volume2 />}
              </ToolbarButton>
            </PopoverTrigger>
            <PopoverContent
              side="top"
              align="center"
              className="flex max-w-12 flex-col p-2"
            >
              <Slider
                orientation="vertical"
                value={[volume]}
                max={100}
                onValueChange={(v) => setVolume(v[0])}
              />
              <span className="text-muted-foreground mt-2 text-center text-xs">
                {volume}%
              </span>
            </PopoverContent>
          </Popover>
        </ToolbarGroup>
      </ToolbarGroup>
    </Toolbar>
  )
}
