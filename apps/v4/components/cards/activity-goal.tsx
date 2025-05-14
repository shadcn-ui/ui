"use client"

import * as React from "react"
import { MinusIcon, PlusIcon } from "lucide-react"
import { Bar, BarChart } from "recharts"

import { Button } from "@/registry/new-york-v4/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/new-york-v4/ui/card"
import { ChartConfig, ChartContainer } from "@/registry/new-york-v4/ui/chart"

const data = [
  {
    goal: 400,
  },
  {
    goal: 300,
  },
  {
    goal: 200,
  },
  {
    goal: 300,
  },
  {
    goal: 200,
  },
  {
    goal: 278,
  },
  {
    goal: 189,
  },
  {
    goal: 239,
  },
  {
    goal: 300,
  },
  {
    goal: 200,
  },
  {
    goal: 278,
  },
  {
    goal: 189,
  },
  {
    goal: 349,
  },
]

const chartConfig = {
  goal: {
    label: "Goal",
    color: "var(--primary)",
  },
} satisfies ChartConfig

export function CardsActivityGoal() {
  const [goal, setGoal] = React.useState(350)

  function onClick(adjustment: number) {
    setGoal(Math.max(200, Math.min(400, goal + adjustment)))
  }

  return (
    <Card className="h-full gap-5">
      <CardHeader>
        <CardTitle>Move Goal</CardTitle>
        <CardDescription>Set your daily activity goal.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col">
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="outline"
            size="icon"
            className="size-7 rounded-full"
            onClick={() => onClick(-10)}
            disabled={goal <= 200}
          >
            <MinusIcon />
            <span className="sr-only">Decrease</span>
          </Button>
          <div className="text-center">
            <div className="text-4xl font-bold tracking-tighter tabular-nums">
              {goal}
            </div>
            <div className="text-muted-foreground text-xs uppercase">
              Calories/day
            </div>
          </div>
          <Button
            variant="outline"
            size="icon"
            className="size-7 rounded-full"
            onClick={() => onClick(10)}
            disabled={goal >= 400}
          >
            <PlusIcon />
            <span className="sr-only">Increase</span>
          </Button>
        </div>
        <div className="flex-1">
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-full w-full"
          >
            <BarChart data={data}>
              <Bar dataKey="goal" radius={4} fill="var(--color-goal)" />
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" variant="secondary">
          Set Goal
        </Button>
      </CardFooter>
    </Card>
  )
}
