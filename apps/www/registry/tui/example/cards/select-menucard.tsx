"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/tui/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select"

const frameworks: any = [
  {
    value: "next.js",
    label: "Next.js",
    imagePath: "/avatars/01.png",
    status: false,
    secondaryText: "@next"
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
    imagePath: "/avatars/02.png",
    status: true,
    secondaryText: "@svelte"
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
    imagePath: "/avatars/03.png",
    status: true,
    secondaryText: "@nuxt"
  },
  {
    value: "remix",
    label: "Remix",
    imagePath: "/avatars/04.png",
    status: false,
    secondaryText: "@remix"
  },
  {
    value: "astro",
    label: "Astro",
    imagePath: "/avatars/05.png",
    status: true,
    secondaryText: "@astro"
  },
]

export function SelectMenu() {
  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Select Menu Variants</CardTitle>
        <CardDescription>
          List of possible variants of Select Menu
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <CardDescription>
          Simple Select Menu
        </CardDescription>
        <div className="grid gap-2">
          <Select defaultValue="billing">
            <SelectTrigger id={`area`} aria-label="Area">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {frameworks.map((framework: any, idx: number) =>
                <SelectItem key={idx} value={framework.value} menuData={framework}>{framework.label}</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
      <CardContent className="grid gap-4">
        <CardDescription>
          Simple Select Menu with Check Icon on Right
        </CardDescription>
        <div className="grid gap-2">
          <Select defaultValue="billing">
            <SelectTrigger id={`area`} aria-label="Area">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent >
              {frameworks.map((framework: any, idx: number) =>
                <SelectItem key={idx} value={framework.value} menuData={framework} alignIcon="right">{framework.label}</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
      <CardContent className="grid gap-4">
        <CardDescription>
          Select Menu with Image Avatar
        </CardDescription>
        <div className="grid gap-2">
          <Select defaultValue="billing">
            <SelectTrigger id={`area`} aria-label="Area">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent >
              {frameworks.map((framework: any, idx: number) =>
                <SelectItem key={idx} value={framework.value} menuData={framework} avatarActive>{framework.label}</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
      <CardContent className="grid gap-4">
        <CardDescription>
          Select Menu with Status Indicator
        </CardDescription>
        <div className="grid gap-2">
          <Select defaultValue="billing">
            <SelectTrigger id={`area`} aria-label="Area">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent >
              {frameworks.map((framework: any, idx: number) =>
                <SelectItem key={idx} value={framework.value} menuData={framework} statusIndicator>{framework.label}</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
      <CardContent className="grid gap-4">
        <CardDescription>
          Select Menu with Secondary Text
        </CardDescription>
        <div className="grid gap-2">
          <Select defaultValue="billing">
            <SelectTrigger id={`area`} aria-label="Area">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent >
              {frameworks.map((framework: any, idx: number) =>
                <SelectItem key={idx} value={framework.value} menuData={framework} secondaryActive>{framework.label}</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
      <CardFooter>
      </CardFooter>
    </Card>
  )
}
