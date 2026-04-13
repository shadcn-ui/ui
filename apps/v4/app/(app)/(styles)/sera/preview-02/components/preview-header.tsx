"use client"

import * as React from "react"
import { ChevronLeftIcon, SearchIcon } from "lucide-react"

import { Button } from "@/styles/base-sera/ui/button"
import { Input } from "@/styles/base-sera/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/styles/base-sera/ui/select"

export function PreviewHeader() {
  return (
    <header className="container flex flex-col gap-8 py-8 md:py-10">
      <div className="flex flex-col gap-2">
        <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
          <ChevronLeftIcon className="size-3.5" />
          <span>Editorial dashboard</span>
        </div>
        <h1 className="font-heading text-4xl leading-none tracking-tight uppercase md:text-5xl">
          Article Directory
        </h1>
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-end">
        <div className="relative w-full max-w-[320px]">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search articles..."
            className="h-10 border border-border/80 bg-background py-2 pr-3 pl-9 text-[11px] font-medium tracking-[0.14em] uppercase placeholder:tracking-[0.14em]"
          />
        </div>

        <Select defaultValue="all-issues">
          <SelectTrigger className="h-10 min-w-[132px] border border-border/80 bg-background px-4 text-[11px] font-semibold tracking-[0.14em] uppercase">
            <SelectValue placeholder="All issues" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-issues">All issues</SelectItem>
            <SelectItem value="summer-2024">Summer 2024</SelectItem>
            <SelectItem value="autumn-2024">Autumn 2024</SelectItem>
            <SelectItem value="winter-2024">Winter 2024</SelectItem>
          </SelectContent>
        </Select>

        <Button className="h-10 px-5 text-[11px] tracking-[0.16em]">
          New Article
        </Button>
      </div>
    </header>
  )
}
