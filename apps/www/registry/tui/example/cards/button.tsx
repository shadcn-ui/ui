"use client"

import { addDays } from "date-fns"

import { Card, CardContent } from "@/registry/tui/ui/card"
import { } from "../../ui/badge"
import { Button } from "../../ui/button"
import { CheckCircleIcon } from "lucide-react"
import { Icons } from "@/components/icons"

const start = new Date(2023, 5, 5)

export function CardsButton() {
  return (
    <Card className="">
      <CardContent className="space-y-1 p-2">
        <div className="truncate text-sm font-medium leading-7 text-slate-900">Primary buttons</div>
        <div className="flex items-center space-x-2">
          <Button type="button" size="xs">Button text</Button>
          <Button type="button" size="sm">Button text</Button>
          <Button type="button" size="md">Button text</Button>
          <Button type="button" size="lg">Button text</Button>
          <Button type="button" size="xl">Button text</Button>
        </div>
        <div className="truncate text-sm font-medium leading-7 text-slate-900">Secondary buttons</div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" type="button" size="xs">Button text</Button>
          <Button variant="outline" type="button" size="sm">Button text</Button>
          <Button variant="outline" type="button" size="md">Button text</Button>
          <Button variant="outline" type="button" size="lg">Button text</Button>
          <Button variant="outline" type="button" size="xl">Button text</Button>
        </div>
        <div className="truncate text-sm font-medium leading-7 text-slate-900">Soft buttons</div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" type="button" size="xs" className="bg-indigo-50 text-indigo-600">Button text</Button>
          <Button variant="ghost" type="button" size="sm" className="bg-indigo-50 text-indigo-600">Button text</Button>
          <Button variant="ghost" type="button" size="md" className="bg-indigo-50 text-indigo-600">Button text</Button>
          <Button variant="ghost" type="button" size="lg" className="bg-indigo-50 text-indigo-600">Button text</Button>
          <Button variant="ghost" type="button" size="xl" className="bg-indigo-50 text-indigo-600">Button text</Button>
        </div>
        <div className="truncate text-sm font-medium leading-7 text-slate-900">Buttons with leading icon</div>
        <div className="flex items-center space-x-2">
          <Button type="button" size="xs" ><Icons.gitHub className="-ml-0.5 h-4 w-4" />Button text</Button>
          <Button type="button" size="sm" ><Icons.gitHub className="-ml-0.5 h-4 w-4" />Button text</Button>
          <Button type="button" size="md" ><Icons.gitHub className="-ml-0.5 h-4 w-4" />Button text</Button>
          <Button type="button" size="lg" ><Icons.gitHub className="-ml-0.5 h-4 w-4" />Button text</Button>
          <Button type="button" size="xl" ><Icons.gitHub className="-ml-0.5 h-4 w-4" />Button text</Button>
        </div>
        <div className="truncate text-sm font-medium leading-7 text-slate-900">Buttons with leading icon</div>
        <div className="flex items-center space-x-2">
          <Button type="button" size="xs" className="rounded-full">Button text</Button>
          <Button type="button" size="sm" className="rounded-full">Button text</Button>
          <Button type="button" size="md" className="rounded-full">Button text</Button>
          <Button type="button" size="lg" className="rounded-full">Button text</Button>
          <Button type="button" size="xl" className="rounded-full">Button text</Button>
        </div>
        <div className="truncate text-sm font-medium leading-7 text-slate-900">Buttons with leading icon</div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" type="button" size="xs" className="rounded-full">Button text</Button>
          <Button variant="outline" type="button" size="sm" className="rounded-full">Button text</Button>
          <Button variant="outline" type="button" size="md" className="rounded-full">Button text</Button>
          <Button variant="outline" type="button" size="lg" className="rounded-full">Button text</Button>
          <Button variant="outline" type="button" size="xl" className="rounded-full">Button text</Button>
        </div>
        <div className="truncate text-sm font-medium leading-7 text-slate-900">Buttons with leading icon</div>
        <div className="flex items-center space-x-2">
          <Button variant="icon" type="button" size="xs" className="rounded-full"><Icons.google className="h-5 w-4" /></Button>
          <Button variant="icon" type="button" size="sm" className="rounded-full"><Icons.google className="h-5 w-4" /></Button>
          <Button variant="icon" type="button" size="md" className="rounded-full"><Icons.google className="h-5 w-4" /></Button>
          <Button variant="icon" type="button" size="lg" className="rounded-full"><Icons.google className="h-5 w-4" /></Button>
          <Button variant="icon" type="button" size="xl" className="rounded-full"><Icons.google className="h-5 w-4" /></Button>
        </div>
      </CardContent>
    </Card>
  )
}
