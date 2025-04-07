"use client"

import { useState } from "react"
import {
  MousePointerClick,
  Plus,
  Search,
  Sparkles,
  SunMoon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/registry/default/ui/avatar"
import { Button } from "@/registry/default/ui/button"
import { Input } from "@/registry/default/ui/input"
import { Separator } from "@/registry/default/ui/separator"

export function Toolbar() {
  const [search, setSearch] = useState("")
  const [isActive, setIsActive] = useState(true)
  const [activeButton, setActiveButton] = useState<string | null>(null)

  const handleButtonClick = (buttonName: string) => {
    setActiveButton(buttonName)
    setTimeout(() => setActiveButton(null), 1000)
  }

  const submitSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setActiveButton("Search")
    setSearch("")
  }

  return (
    <div className="relative w-fit rounded-xl border border-zinc-200 bg-white p-2 shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
      <div className="absolute -top-8 left-1/2 -translate-x-1/2 rounded-md text-xs font-medium text-blue-600">
        {activeButton && (
          <div className="relative flex flex-col items-center">
            <div>{activeButton}</div>
            <div className="relative mt-1 h-0.5 w-24 bg-slate-200">
              <div className="absolute left-0 h-full bg-blue-500" />
            </div>
          </div>
        )}
      </div>
      <div className="flex h-10 items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleButtonClick("Theme toggle")}
        >
          <SunMoon className="h-4 w-4" />
        </Button>
        <Separator orientation="vertical" className="h-6" />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleButtonClick("Plus")}
        >
          <Plus className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleButtonClick("Sparkles")}
        >
          <Sparkles className="h-4 w-4" />
        </Button>
        <div className="relative flex items-center">
          <div className="relative flex h-10 items-center gap-2 overflow-hidden rounded-xl bg-zinc-100 px-3 dark:bg-zinc-800">
            <Search
              className={cn(
                "h-4 w-4",
                isActive && "text-[#0C8CE9] dark:text-blue-400"
              )}
            />
            <div className="relative flex items-center">
              <form onSubmit={submitSearch}>
                <Input
                  type="search"
                  value={search}
                  placeholder="Search..."
                  className="h-7 border-none bg-transparent px-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  onChange={(e) => setSearch(e.target.value)}
                />
              </form>
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          className="h-10 w-10 md:w-20"
          onClick={() => handleButtonClick("MousePointerClick")}
        >
          <div className="relative flex items-center gap-2">
            <span className="hidden text-sm font-medium  md:block">Click!</span>
            <MousePointerClick className="h-4 w-4" />
          </div>
        </Button>
        <Separator orientation="vertical" className="h-6" />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleButtonClick("User")}
        >
          <Avatar className="h-6 w-6">
            <AvatarFallback>D</AvatarFallback>
          </Avatar>
        </Button>
      </div>
    </div>
  )
}
