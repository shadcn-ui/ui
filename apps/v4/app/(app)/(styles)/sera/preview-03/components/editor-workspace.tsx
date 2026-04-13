"use client"

import * as React from "react"
import { BoldIcon, Code2Icon, LinkIcon } from "lucide-react"

import { Button } from "@/styles/base-sera/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/styles/base-sera/ui/card"
import { Checkbox } from "@/styles/base-sera/ui/checkbox"
import { Progress, ProgressValue } from "@/styles/base-sera/ui/progress"
import { Separator } from "@/styles/base-sera/ui/separator"

type Milestone = {
  name: string
  complete: boolean
  note?: string
}

const MILESTONES: Milestone[] = [
  {
    name: "Outline & Commissioning",
    complete: true,
  },
  {
    name: "First Draft Submitted",
    complete: true,
  },
  {
    name: "Review & Revisions",
    complete: false,
    note: "Waiting on editor",
  },
  {
    name: "Final Copy Edit",
    complete: false,
  },
  {
    name: "Art Direction & Layout",
    complete: false,
  },
]

export function EditorWorkspace() {
  return (
    <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
      <section className="flex min-h-[980px] flex-col border border-border/70 bg-background">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 px-4 py-3">
          <div className="flex flex-wrap items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase"
            >
              Normal Text
            </Button>
            <Separator orientation="vertical" className="h-4" />
            <Button variant="ghost" size="icon-sm" className="size-7">
              <BoldIcon className="size-3.5" />
            </Button>
            <Button variant="ghost" size="icon-sm" className="size-7">
              <Code2Icon className="size-3.5" />
            </Button>
            <Button variant="ghost" size="icon-sm" className="size-7">
              <LinkIcon className="size-3.5" />
            </Button>
          </div>
          <p className="text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
            1,402 words
          </p>
        </div>

        <div className="flex flex-1 flex-col gap-8 px-10 py-10 md:px-14">
          <p className="max-w-[72ch] text-[29px] leading-[1.65] text-foreground/95">
            As cities continue to expand at an unprecedented rate, the architectural
            paradigm is shifting from mere expansion to sustainable integration. The
            concrete jungles of the 20th century are making way for structures that
            breathe, adapt, and give back to their environments.
          </p>

          <p className="max-w-[72ch] text-[29px] leading-[1.65] text-foreground/95">
            Historically, urban development has been a zero-sum game with nature. We
            paved over wetlands, redirected rivers, and constructed imposing glass towers
            that guzzled energy. However, a new generation of architects, like Alistair
            Sterling, are proposing a radical rethink of our built environment.
          </p>

          <h2 className="font-heading text-4xl tracking-tight uppercase">
            The Living Building Challenge
          </h2>

          <p className="max-w-[72ch] text-[29px] leading-[1.65] text-foreground/95">
            Sterling's latest project in downtown Seattle is a testament to this new
            philosophy. "We are no longer designing static structures," Sterling
            explained during a recent site visit. "We are engineering localized
            ecosystems."
          </p>

          <p className="max-w-[72ch] text-[29px] leading-[1.65] text-foreground/95">
            The building features a facade of responsive biomaterials that adjust their
            porosity based on humidity and temperature, significantly reducing the need
            for artificial climate control. Rainwater is not merely channeled away but
            captured, filtered through a series of integrated rooftop wetlands, and
            reused within the building's greywater system.
          </p>

          <p className="max-w-[72ch] text-[29px] leading-[1.65] text-foreground/95">
            This shift requires more than just innovative materials; it demands a
            fundamental change in how we value space. The metric of success is no longer
            simply cost per square foot, but the building's overall environmental impact
            over its lifecycle.
          </p>

          <p className="max-w-[72ch] text-[25px] italic leading-[1.6] text-muted-foreground">
            Integration of solar passive design elements needs more elaboration here.
            Check with engineering team for specific stats.
          </p>
        </div>
      </section>

      <aside className="flex min-h-[980px] flex-col gap-6">
        <Card className="gap-0 py-0">
          <CardHeader className="border-b border-border/70 py-5">
            <CardTitle>Article Details</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-5 py-5">
            <div className="flex flex-col gap-1">
              <p className="text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                Issue
              </p>
              <p className="font-medium">Summer Issue 2024</p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                Author
              </p>
              <p className="font-medium">Elena Rostova</p>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                Target Word Count
              </p>
              <Progress value={70}>
                <ProgressValue className="w-full text-right text-[10px] font-medium tracking-[0.12em] text-muted-foreground uppercase">
                  1.4k / 2.0k
                </ProgressValue>
              </Progress>
            </div>
          </CardContent>
        </Card>

        <Card className="gap-0 py-0">
          <CardHeader className="border-b border-border/70 py-5">
            <CardTitle>Publication Flow</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-5 py-5">
            <div className="flex flex-col gap-2">
              <p className="text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                Editorial Progress
              </p>
              <Progress value={45}>
                <ProgressValue className="w-full text-right text-[10px] font-medium tracking-[0.12em] text-muted-foreground uppercase">
                  45%
                </ProgressValue>
              </Progress>
            </div>

            <div className="flex flex-col gap-3">
              <p className="text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                Required Milestones
              </p>
              {MILESTONES.map((milestone) => (
                <label
                  key={milestone.name}
                  className="grid grid-cols-[18px_1fr] items-start gap-2.5"
                >
                  <Checkbox checked={milestone.complete} />
                  <span className="flex flex-col gap-0.5">
                    <span className="text-sm text-foreground">{milestone.name}</span>
                    <span className="text-[10px] tracking-[0.12em] text-muted-foreground uppercase">
                      {milestone.note ?? ""}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </CardContent>
        </Card>

        <CardFooter className="mt-auto border border-border/70 bg-background py-4">
          <Button
            variant="outline"
            className="w-full text-[10px] font-semibold tracking-[0.16em]"
          >
            Add Note for Editor
          </Button>
        </CardFooter>
      </aside>
    </div>
  )
}
