"use client"

import * as React from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/bases/radix/ui/card"

const FITNESS_WEEKLY_LOAD = [
  { day: "M", load: 84 },
  { day: "T", load: 52 },
  { day: "W", load: 73 },
  { day: "T", load: 66 },
  { day: "F", load: 91 },
  { day: "S", load: 48 },
  { day: "S", load: 61 },
]

export function WeeklyFitnessSummary() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Fitness Summary</CardTitle>
        <CardDescription>Calories and workout load by day</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="grid grid-cols-7 gap-1.5">
          {FITNESS_WEEKLY_LOAD.map((day, index) => (
            <div
              key={`${day.day}-${index}`}
              className="ring-border rounded-md p-1.5 text-center ring"
            >
              <div className="text-muted-foreground text-sm">{day.day}</div>
              <div className="bg-muted relative mt-1 h-16 overflow-hidden rounded-sm">
                <div
                  className="bg-chart-3 absolute inset-x-0 bottom-0 rounded-sm"
                  style={
                    {
                      height: `${day.load}%`,
                    } as React.CSSProperties
                  }
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
