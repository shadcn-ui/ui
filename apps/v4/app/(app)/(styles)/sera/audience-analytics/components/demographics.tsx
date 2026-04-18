"use client"

import * as React from "react"
import { MoveRightIcon } from "lucide-react"

import { Button } from "@/styles/base-sera/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/styles/base-sera/ui/card"
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/styles/base-sera/ui/progress"

const DEMOGRAPHIC_DATA = [
  { age: "18 - 24", percentage: 22 },
  { age: "25 - 34", percentage: 64 },
  { age: "35 - 44", percentage: 12 },
  { age: "45+", percentage: 5 },
]

export function Demographics({ ...props }: React.ComponentProps<typeof Card>) {
  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle className="text-2xl">Demographics</CardTitle>
        <CardDescription>Reader Profile</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-10">
        {DEMOGRAPHIC_DATA.map((item) => (
          <Progress
            key={item.age}
            value={item.percentage}
            aria-label={item.age}
          >
            <ProgressLabel>{item.age}</ProgressLabel>
            <ProgressValue>
              {(formattedValue) => `${formattedValue}`}
            </ProgressValue>
          </Progress>
        ))}
      </CardContent>
      <CardFooter>
        <Button variant="link" className="w-full">
          View all source <MoveRightIcon data-icon="inline-end" />
        </Button>
      </CardFooter>
    </Card>
  )
}
