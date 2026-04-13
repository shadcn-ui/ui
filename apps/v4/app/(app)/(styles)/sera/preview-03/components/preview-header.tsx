"use client"

import * as React from "react"
import { ArrowLeftIcon } from "lucide-react"

import { Button } from "@/styles/base-sera/ui/button"

export function PreviewHeader() {
  return (
    <header className="container flex flex-col gap-6 py-8 md:py-10">
      <Button
        variant="ghost"
        className="h-auto w-fit px-0 text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase hover:bg-transparent hover:text-foreground"
      >
        <ArrowLeftIcon className="size-3.5" />
        Back to articles
      </Button>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <h1 className="font-heading text-4xl leading-none tracking-tight uppercase md:text-5xl">
          The Future of Sustainable Architecture
        </h1>

        <div className="flex flex-wrap items-center gap-2 lg:justify-end">
          <div className="inline-flex h-9 items-center gap-2 border border-border/70 px-3 text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
            <span className="size-1 rounded-full bg-foreground/80" />
            Autosaved 2 mins ago
          </div>
          <Button
            variant="outline"
            size="sm"
            className="h-9 px-4 text-[10px] font-semibold tracking-[0.16em]"
          >
            Preview
          </Button>
          <Button size="sm" className="h-9 px-4 text-[10px] font-semibold tracking-[0.16em]">
            Submit Draft
          </Button>
        </div>
      </div>
    </header>
  )
}
