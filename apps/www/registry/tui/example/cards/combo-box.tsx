"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/tui/ui/card"
import { Combobox } from "@/registry/tui/ui/combobox"

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

export function CardsComboBox() {
  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Combobox Variants</CardTitle>
        <CardDescription>
          List of possible variants of ComboBox
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <CardDescription>
          Simple Combobox
        </CardDescription>
        <Combobox listArray={frameworks} />
      </CardContent>
      <CardContent className="grid gap-4">
        <CardDescription>
          Simple Combobox with Check Icon on Right
        </CardDescription>
        <Combobox listArray={frameworks} alignIcon={"right"} />
      </CardContent>
      <CardContent className="grid gap-4">
        <CardDescription>
          Combobox with Image Avatar
        </CardDescription>
        <Combobox listArray={frameworks} avatarActive />
      </CardContent>
      <CardContent className="grid gap-4">
        <CardDescription>
          Combobox with Status Indicator
        </CardDescription>
        <Combobox listArray={frameworks} statusIndicator />
      </CardContent>
      <CardContent className="grid gap-4">
        <CardDescription>
          Combobox with Secondary Text
        </CardDescription>
        <Combobox listArray={frameworks} secondaryActive />
      </CardContent>
      <CardFooter>
      </CardFooter>
    </Card>
  )
}




