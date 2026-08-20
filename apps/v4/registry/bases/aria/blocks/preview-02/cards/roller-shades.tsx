"use client"

import * as React from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/bases/aria/ui/card"
import { Slider } from "@/registry/bases/aria/ui/slider"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/registry/bases/aria/ui/toggle-group"

export function RollerShades() {
  const [position, setPosition] = React.useState([50])

  const preset =
    position[0] <= 10 ? "open" : position[0] >= 90 ? "closed" : "half"

  return (
    <Card>
      <CardHeader>
        <CardTitle>Living Room</CardTitle>
        <CardDescription>Roller Shades</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex h-32 flex-col overflow-hidden rounded-lg border bg-muted">
          <div
            className="bg-muted-foreground transition-all duration-300"
            style={{ height: `${position[0]}%` }}
          />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
            Open
          </span>
          <Slider
            value={position}
            onChange={(value) =>
              setPosition(Array.isArray(value) ? [...value] : [value])
            }
            maxValue={100}
            className="flex-1"
          />
          <span className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
            Close
          </span>
        </div>
      </CardContent>
      <CardFooter>
        <ToggleGroup
          selectedKeys={[preset]}
          onSelectionChange={(value) => {
            const v = Array.from(value)[0]
            if (v === "open") setPosition([0])
            if (v === "half") setPosition([50])
            if (v === "closed") setPosition([100])
          }}
          variant="outline"
          spacing={1}
          className="w-full"
        >
          <ToggleGroupItem id="open" className="flex-1">
            Open
          </ToggleGroupItem>
          <ToggleGroupItem id="half" className="flex-1">
            Half
          </ToggleGroupItem>
          <ToggleGroupItem id="closed" className="flex-1">
            Closed
          </ToggleGroupItem>
        </ToggleGroup>
      </CardFooter>
    </Card>
  )
}
