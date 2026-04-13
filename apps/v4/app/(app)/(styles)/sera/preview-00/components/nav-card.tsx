"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/styles/base-sera/ui/accordion"
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/styles/base-sera/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/styles/base-sera/ui/tabs"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/styles/base-sera/ui/toggle-group"

export function NavCard() {
  return (
    <Card className="col-span-full md:col-span-6 lg:col-span-3">
      <CardHeader className="border-b">
        <CardTitle>Navigation</CardTitle>
        <CardAction>
          <span className="font-serif text-sm text-muted-foreground italic">
            Segments
          </span>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-8">
        <ToggleGroup defaultValue={["list"]} variant="outline">
          <ToggleGroupItem value="list">List</ToggleGroupItem>
          <ToggleGroupItem value="grid">Grid</ToggleGroupItem>
          <ToggleGroupItem value="board">Board</ToggleGroupItem>
        </ToggleGroup>
        <Tabs defaultValue="overview">
          <TabsList variant="line">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
        </Tabs>
        <Accordion defaultValue={["design-assets"]}>
          <AccordionItem value="design-assets">
            <AccordionTrigger>Design Assets</AccordionTrigger>
            <AccordionContent>
              Access the full library of icons, illustrations, and photographic
              assets curated for editorial use.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="typography-rules">
            <AccordionTrigger>Typography Rules</AccordionTrigger>
            <AccordionContent>
              Guidelines for font pairing, line heights, and tracking values
              across all publication formats.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  )
}
