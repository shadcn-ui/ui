"use client"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/styles/base-sera/ui/card"
import { Field, FieldLabel } from "@/styles/base-sera/ui/field"
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/styles/base-sera/ui/progress"
import { Slider } from "@/styles/base-sera/ui/slider"

export function ProgressCard() {
  return (
    <Card className="col-span-full md:col-span-6 lg:col-span-4">
      <CardHeader>
        <CardTitle>Progress & Slider</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-8">
        <Progress value={45}>
          <ProgressLabel>Editorial</ProgressLabel>
          <ProgressValue>{(value) => value}</ProgressValue>
        </Progress>
        <Progress value={80}>
          <ProgressLabel>Word Count</ProgressLabel>
          <ProgressValue>{(value) => value}</ProgressValue>
        </Progress>
        <Progress value={100}>
          <ProgressLabel>Complete</ProgressLabel>
          <ProgressValue>{(value) => value}</ProgressValue>
        </Progress>
        <Field>
          <FieldLabel>Slider</FieldLabel>
          <Slider defaultValue={[35]} />
        </Field>
        <Field>
          <FieldLabel>Range Slider</FieldLabel>
          <Slider defaultValue={[50, 90]} />
        </Field>
      </CardContent>
    </Card>
  )
}
