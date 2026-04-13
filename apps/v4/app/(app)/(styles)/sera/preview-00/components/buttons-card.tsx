"use client"

import {
  BoldIcon,
  ItalicIcon,
  PlusIcon,
  Trash2Icon,
  UnderlineIcon,
} from "lucide-react"

import { Button } from "@/styles/base-sera/ui/button"
import { ButtonGroup } from "@/styles/base-sera/ui/button-group"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/styles/base-sera/ui/card"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/styles/base-sera/ui/toggle-group"

export function ButtonsCard() {
  return (
    <Card className="col-span-full md:col-span-6 lg:col-span-3">
      <CardHeader className="border-b">
        <CardTitle>Buttons and Controls</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        <Button className="col-span-full">Primary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="secondary">Secondary</Button>
        <ToggleGroup defaultValue={["monthly"]} variant="outline">
          <ToggleGroupItem value="monthly">Monthly</ToggleGroupItem>
          <ToggleGroupItem value="annual">Annual</ToggleGroupItem>
        </ToggleGroup>
        <ButtonGroup className="ml-auto">
          <Button size="icon" aria-label="Add">
            <PlusIcon />
          </Button>
        </ButtonGroup>
        <Button variant="link" className="col-span-full">
          Text Link
        </Button>
      </CardContent>
    </Card>
  )
}
